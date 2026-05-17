import React, { useEffect, useState, useRef } from 'react';
import { View, Text, TextInput, TouchableOpacity, ScrollView, StyleSheet, KeyboardAvoidingView, Platform } from 'react-native';
import axios from 'axios';
import { useAuth } from '../context';
import { useRouter, useLocalSearchParams } from 'expo-router';

const API = 'http://192.168.108.109:5000';

export default function Chat() {
  const [messages, setMessages] = useState<any[]>([]);
  const [newMessage, setNewMessage] = useState('');
  const { token, user } = useAuth();
  const { id } = useLocalSearchParams();
  const router = useRouter();
  const scrollRef = useRef<ScrollView>(null);

  const fetchMessages = async () => {
    try {
      const res = await axios.get(`${API}/api/messages/${id}`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      setMessages(res.data);
    } catch (err) {
      console.error(err);
    }
  };

  useEffect(() => {
    fetchMessages();
    const interval = setInterval(fetchMessages, 3000);
    return () => clearInterval(interval);
  }, [id, token]);

  const handleSend = async () => {
    if (!newMessage.trim()) return;
    try {
      await axios.post(`${API}/api/messages/${id}`, { content: newMessage }, {
        headers: { Authorization: `Bearer ${token}` }
      });
      setNewMessage('');
      fetchMessages();
      scrollRef.current?.scrollToEnd({ animated: true });
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <KeyboardAvoidingView style={styles.container} behavior={Platform.OS === 'ios' ? 'padding' : 'height'}>
      <View style={styles.navbar}>
        <Text style={styles.logo}>MurudoMurudo 💕</Text>
        <TouchableOpacity style={styles.navBtn} onPress={() => router.push('/screens/Matches')}>
          <Text style={styles.navBtnText}>Back</Text>
        </TouchableOpacity>
      </View>
      <ScrollView ref={scrollRef} contentContainerStyle={styles.messages} onContentSizeChange={() => scrollRef.current?.scrollToEnd({ animated: true })}>
        {messages.length === 0 && <Text style={styles.empty}>No messages yet — say hello! 👋</Text>}
        {messages.map(m => (
          <View key={m.id} style={{ alignItems: m.sender_id === user?.id ? 'flex-end' : 'flex-start', marginBottom: 8 }}>
            <View style={{ backgroundColor: m.sender_id === user?.id ? '#e63946' : 'white', padding: 12, borderRadius: 16, maxWidth: '70%', elevation: 2 }}>
              <Text style={{ color: m.sender_id === user?.id ? 'white' : '#333' }}>{m.content}</Text>
            </View>
          </View>
        ))}
      </ScrollView>
      <View style={styles.inputBar}>
        <TextInput
          style={styles.input}
          placeholder="Type a message..."
          value={newMessage}
          onChangeText={setNewMessage}
        />
        <TouchableOpacity style={styles.sendBtn} onPress={handleSend}>
          <Text style={styles.sendBtnText}>Send 💕</Text>
        </TouchableOpacity>
      </View>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#fff0f3' },
  navbar: { backgroundColor: 'white', padding: 16, flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', elevation: 4 },
  logo: { fontSize: 18, fontWeight: 'bold', color: '#e63946' },
  navBtn: { backgroundColor: '#e63946', padding: 8, borderRadius: 8 },
  navBtnText: { color: 'white', fontSize: 12 },
  messages: { padding: 16, flexGrow: 1 },
  empty: { textAlign: 'center', color: '#666', fontSize: 16, marginTop: 32 },
  inputBar: { flexDirection: 'row', padding: 12, backgroundColor: 'white', gap: 8, elevation: 4 },
  input: { flex: 1, backgroundColor: '#f5f5f5', padding: 12, borderRadius: 8, fontSize: 16 },
  sendBtn: { backgroundColor: '#e63946', padding: 12, borderRadius: 8, justifyContent: 'center' },
  sendBtnText: { color: 'white', fontWeight: 'bold' },
});