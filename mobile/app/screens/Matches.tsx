import React, { useEffect, useState } from 'react';
import { View, Text, ScrollView, TouchableOpacity, StyleSheet } from 'react-native';
import axios from 'axios';
import { useAuth } from '../context';
import { useRouter } from 'expo-router';

const API = 'http://192.168.108.109:5000';

export default function Matches() {
  const [matches, setMatches] = useState<any[]>([]);
  const { token } = useAuth();
  const router = useRouter();

  useEffect(() => {
    const fetchMatches = async () => {
      try {
        const res = await axios.get(`${API}/api/matches`, {
          headers: { Authorization: `Bearer ${token}` }
        });
        setMatches(res.data);
      } catch (err) {
        console.error(err);
      }
    };
    fetchMatches();
  }, [token]);

  return (
    <View style={styles.container}>
      <View style={styles.navbar}>
        <Text style={styles.logo}>MurudoMurudo 💕</Text>
        <TouchableOpacity style={styles.navBtn} onPress={() => router.push('/screens/Dashboard')}>
          <Text style={styles.navBtnText}>Discover</Text>
        </TouchableOpacity>
      </View>
      <Text style={styles.heading}>Your Matches 💕</Text>
      <ScrollView contentContainerStyle={styles.grid}>
        {matches.length === 0 && <Text style={styles.empty}>No matches yet — keep liking! 💪</Text>}
        {matches.map(m => (
          <View key={m.id} style={styles.card}>
            <View style={styles.avatar}>
              <Text style={styles.avatarText}>{m.name[0]}</Text>
            </View>
            <Text style={styles.name}>{m.name}</Text>
            <Text style={styles.info}>{m.university}</Text>
            <Text style={styles.info}>{m.major} • {m.year}</Text>
            <Text style={styles.bio}>{m.bio || 'No bio yet'}</Text>
            <TouchableOpacity style={styles.chatBtn} onPress={() => router.push(`/screens/Chat?id=${m.id}`)}>
              <Text style={styles.chatBtnText}>💬 Chat</Text>
            </TouchableOpacity>
          </View>
        ))}
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#fff0f3' },
  navbar: { backgroundColor: 'white', padding: 16, flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', elevation: 4 },
  logo: { fontSize: 18, fontWeight: 'bold', color: '#e63946' },
  navBtn: { backgroundColor: '#e63946', padding: 8, borderRadius: 8 },
  navBtnText: { color: 'white', fontSize: 12 },
  heading: { fontSize: 22, fontWeight: 'bold', textAlign: 'center', padding: 24, color: '#333' },
  grid: { padding: 16, gap: 16 },
  card: { backgroundColor: 'white', borderRadius: 16, padding: 24, alignItems: 'center', elevation: 3 },
  avatar: { width: 64, height: 64, borderRadius: 32, backgroundColor: '#e63946', alignItems: 'center', justifyContent: 'center', marginBottom: 12 },
  avatarText: { color: 'white', fontSize: 28, fontWeight: 'bold' },
  name: { fontSize: 18, fontWeight: 'bold', marginBottom: 4 },
  info: { color: '#666', fontSize: 14, marginBottom: 2 },
  bio: { color: '#999', fontSize: 13, marginVertical: 8, textAlign: 'center' },
  chatBtn: { backgroundColor: '#e63946', padding: 10, borderRadius: 8, marginTop: 8 },
  chatBtnText: { color: 'white', fontSize: 14 },
  empty: { textAlign: 'center', color: '#666', fontSize: 16 },
});