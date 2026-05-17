import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, Alert, ScrollView } from 'react-native';
import axios from 'axios';
import { useAuth } from '../context';
import { useRouter } from 'expo-router';

const API = 'http://192.168.108.109:5000';

export default function Register() {
  const [form, setForm] = useState({ name: '', email: '', password: '', university: '', major: '', year: '' });
  const { login } = useAuth();
  const router = useRouter();

  const handleRegister = async () => {
    try {
      const res = await axios.post(`${API}/api/auth/register`, form);
      await login(res.data.user, res.data.token);
      router.replace('/screens/Dashboard');
    } catch (err: any) {
      Alert.alert('Error', err.response?.data?.message || 'Registration failed');
    }
  };

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <Text style={styles.title}>MurudoMurudo 💕</Text>
      <Text style={styles.subtitle}>Create your account</Text>
      <TextInput style={styles.input} placeholder="Full name" onChangeText={v => setForm({...form, name: v})} />
      <TextInput style={styles.input} placeholder="University email" onChangeText={v => setForm({...form, email: v})} keyboardType="email-address" autoCapitalize="none" />
      <TextInput style={styles.input} placeholder="Password" onChangeText={v => setForm({...form, password: v})} secureTextEntry />
      <TextInput style={styles.input} placeholder="University name" onChangeText={v => setForm({...form, university: v})} />
      <TextInput style={styles.input} placeholder="Your major" onChangeText={v => setForm({...form, major: v})} />
      <TextInput style={styles.input} placeholder="Year (e.g. 1st Year)" onChangeText={v => setForm({...form, year: v})} />
      <TouchableOpacity style={styles.button} onPress={handleRegister}>
        <Text style={styles.buttonText}>Create Account</Text>
      </TouchableOpacity>
      <TouchableOpacity onPress={() => router.push('/screens/Login')}>
        <Text style={styles.link}>Already have an account? Login</Text>
      </TouchableOpacity>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { flexGrow: 1, backgroundColor: '#fff0f3', alignItems: 'center', justifyContent: 'center', padding: 24 },
  title: { fontSize: 32, fontWeight: 'bold', color: '#e63946', marginBottom: 8 },
  subtitle: { fontSize: 16, color: '#666', marginBottom: 32 },
  input: { width: '100%', backgroundColor: 'white', padding: 14, borderRadius: 10, marginBottom: 16, fontSize: 16, borderWidth: 1, borderColor: '#ddd' },
  button: { width: '100%', backgroundColor: '#e63946', padding: 14, borderRadius: 10, alignItems: 'center', marginBottom: 16 },
  buttonText: { color: 'white', fontSize: 16, fontWeight: 'bold' },
  link: { color: '#e63946', fontSize: 14 },
});