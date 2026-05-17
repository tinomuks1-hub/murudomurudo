import React, { useEffect, useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, ScrollView, Alert } from 'react-native';
import axios from 'axios';
import { useAuth } from '../context';
import { useRouter } from 'expo-router';

const API = 'http://192.168.108.109:5000';

export default function Profile() {
  const [form, setForm] = useState({ name: '', university: '', major: '', year: '', bio: '' });
  const { token, logout } = useAuth();
  const router = useRouter();

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const res = await axios.get(`${API}/api/users/profile`, {
          headers: { Authorization: `Bearer ${token}` }
        });
        setForm(res.data);
      } catch (err) {
        console.error(err);
      }
    };
    fetchProfile();
  }, [token]);

  const handleSave = async () => {
    try {
      await axios.put(`${API}/api/users/profile`, form, {
        headers: { Authorization: `Bearer ${token}` }
      });
      Alert.alert('✅', 'Profile updated!');
    } catch (err) {
      Alert.alert('Error', 'Update failed');
    }
  };

  const handleLogout = async () => {
    await logout();
    router.replace('/screens/Login');
  };

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <View style={styles.navbar}>
        <Text style={styles.logo}>MurudoMurudo 💕</Text>
        <View style={styles.navButtons}>
          <TouchableOpacity style={styles.navBtn} onPress={() => router.push('/screens/Dashboard')}>
            <Text style={styles.navBtnText}>Dashboard</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.navBtn} onPress={handleLogout}>
            <Text style={styles.navBtnText}>Logout</Text>
          </TouchableOpacity>
        </View>
      </View>
      <View style={styles.content}>
        <Text style={styles.heading}>Your Profile</Text>
        <TextInput style={styles.input} placeholder="Full name" value={form.name || ''} onChangeText={v => setForm({...form, name: v})} />
        <TextInput style={styles.input} placeholder="University" value={form.university || ''} onChangeText={v => setForm({...form, university: v})} />
        <TextInput style={styles.input} placeholder="Major" value={form.major || ''} onChangeText={v => setForm({...form, major: v})} />
        <TextInput style={styles.input} placeholder="Year (e.g. 1st Year)" value={form.year || ''} onChangeText={v => setForm({...form, year: v})} />
        <TextInput style={[styles.input, { height: 100 }]} placeholder="Bio" value={form.bio || ''} onChangeText={v => setForm({...form, bio: v})} multiline />
        <TouchableOpacity style={styles.button} onPress={handleSave}>
          <Text style={styles.buttonText}>Save Changes</Text>
        </TouchableOpacity>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { flexGrow: 1, backgroundColor: '#fff0f3' },
  navbar: { backgroundColor: 'white', padding: 16, flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', elevation: 4 },
  logo: { fontSize: 18, fontWeight: 'bold', color: '#e63946' },
  navButtons: { flexDirection: 'row', gap: 8 },
  navBtn: { backgroundColor: '#e63946', padding: 8, borderRadius: 8 },
  navBtnText: { color: 'white', fontSize: 12 },
  content: { padding: 24 },
  heading: { fontSize: 24, fontWeight: 'bold', color: '#e63946', textAlign: 'center', marginBottom: 24 },
  input: { backgroundColor: 'white', padding: 14, borderRadius: 10, marginBottom: 16, fontSize: 16, borderWidth: 1, borderColor: '#ddd' },
  button: { backgroundColor: '#e63946', padding: 14, borderRadius: 10, alignItems: 'center' },
  buttonText: { color: 'white', fontSize: 16, fontWeight: 'bold' },
});