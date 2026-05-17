import React, { useEffect, useState } from 'react';
import { View, Text, ScrollView, TouchableOpacity, StyleSheet, Alert } from 'react-native';
import axios from 'axios';
import { useAuth } from '../context';
import { useRouter } from 'expo-router';

const API = 'http://192.168.108.109:5000';

export default function Dashboard() {
  const [users, setUsers] = useState<any[]>([]);
  const { token, logout } = useAuth();
  const router = useRouter();

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const res = await axios.get(`${API}/api/users/discover`, {
          headers: { Authorization: `Bearer ${token}` }
        });
        setUsers(res.data);
      } catch (err) {
        console.error(err);
      }
    };
    fetchUsers();
  }, [token]);

  const handleLike = async (id: number) => {
    try {
      const res = await axios.post(`${API}/api/matches/like/${id}`, {}, {
        headers: { Authorization: `Bearer ${token}` }
      });
      Alert.alert('💕', res.data.message);
    } catch (err: any) {
      Alert.alert('Error', err.response?.data?.message || 'Something went wrong');
    }
  };

  const handleLogout = async () => {
    await logout();
    router.replace('/screens/Login');
  };

  return (
    <View style={styles.container}>
      <View style={styles.navbar}>
        <Text style={styles.logo}>MurudoMurudo 💕</Text>
        <View style={styles.navButtons}>
          <TouchableOpacity style={styles.navBtn} onPress={() => router.push('/screens/Matches')}>
            <Text style={styles.navBtnText}>Matches</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.navBtn} onPress={() => router.push('/screens/Profile')}>
            <Text style={styles.navBtnText}>Profile</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.navBtn} onPress={handleLogout}>
            <Text style={styles.navBtnText}>Logout</Text>
          </TouchableOpacity>
        </View>
      </View>
      <Text style={styles.heading}>Discover People 👀</Text>
      <ScrollView contentContainerStyle={styles.grid}>
        {users.length === 0 && <Text style={styles.empty}>No users yet. Invite friends! 🎉</Text>}
        {users.map(u => (
          <View key={u.id} style={styles.card}>
            <View style={styles.avatar}>
              <Text style={styles.avatarText}>{u.name[0]}</Text>
            </View>
            <Text style={styles.name}>{u.name}</Text>
            <Text style={styles.info}>{u.university}</Text>
            <Text style={styles.info}>{u.major} • {u.year}</Text>
            <Text style={styles.bio}>{u.bio || 'No bio yet'}</Text>
            <TouchableOpacity style={styles.likeBtn} onPress={() => handleLike(u.id)}>
              <Text style={styles.likeBtnText}>💕 Like</Text>
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
  navButtons: { flexDirection: 'row', gap: 8 },
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
  likeBtn: { backgroundColor: '#e63946', padding: 10, borderRadius: 8, marginTop: 8 },
  likeBtnText: { color: 'white', fontSize: 14 },
  empty: { textAlign: 'center', color: '#666', fontSize: 16 },
});