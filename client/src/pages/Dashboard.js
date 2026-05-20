import API from '../config';
import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { useAuth } from '../context/AuthContext';

export default function Dashboard() {
  const [users, setUsers] = useState([]);
  const { token, logout } = useAuth();
  const navigate = useNavigate();

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

  const handleLike = async (id) => {
    try {
      const res = await axios.post(`${API}/api/matches/like/${id}`, {}, {
        headers: { Authorization: `Bearer ${token}` }
      });
      alert(res.data.message);
    } catch (err) {
      console.error(err);
    }
  };

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  return (
    <div style={{ minHeight: '100vh', backgroundColor: '#fff0f3' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', backgroundColor: 'white', padding: '16px 32px', boxShadow: '0 2px 10px rgba(0,0,0,0.1)' }}>
        <h1 style={{ color: '#e63946' }}>MurudoMurudo 💕</h1>
        <div>
  <button style={btn} onClick={() => navigate('/matches')}>Matches 💕</button>
  <button style={btn} onClick={() => navigate('/profile')}>Profile</button>
  <button style={btn} onClick={handleLogout}>Logout</button>
</div>
      </div>
      <h2 style={{ textAlign: 'center', padding: '32px', color: '#333' }}>Discover People 👀</h2>
      <div style={{ display: 'flex', flexWrap: 'wrap', gap: '24px', justifyContent: 'center', padding: '0 32px 32px' }}>
        {users.length === 0 && <p style={{ color: '#666' }}>No users to discover yet. Invite friends! 🎉</p>}
        {users.map(u => (
          <div key={u.id} style={{ backgroundColor: 'white', borderRadius: '16px', padding: '24px', width: '250px', boxShadow: '0 4px 15px rgba(0,0,0,0.1)', textAlign: 'center' }}>
            <div style={{ width: '64px', height: '64px', borderRadius: '50%', backgroundColor: '#e63946', color: 'white', fontSize: '2rem', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 16px' }}>
              {u.name[0]}
            </div>
            <h3 style={{ fontSize: '1.2rem', marginBottom: '8px' }}>{u.name}</h3>
            <p style={{ color: '#666', fontSize: '0.9rem', marginBottom: '4px' }}>{u.university}</p>
            <p style={{ color: '#666', fontSize: '0.9rem', marginBottom: '4px' }}>{u.major} • {u.year}</p>
            <p style={{ color: '#999', fontSize: '0.85rem', margin: '12px 0' }}>{u.bio || 'No bio yet'}</p>
            <button style={{ padding: '10px 24px', backgroundColor: '#e63946', color: 'white', border: 'none', borderRadius: '8px', cursor: 'pointer', fontSize: '1rem' }} onClick={() => handleLike(u.id)}>
              💕 Like
            </button>
          </div>
        ))}
      </div>
    </div>
  );
}

const btn = { marginLeft: '12px', padding: '8px 16px', backgroundColor: '#e63946', color: 'white', border: 'none', borderRadius: '8px', cursor: 'pointer' };