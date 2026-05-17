import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { useAuth } from '../context/AuthContext';

export default function Matches() {
  const [matches, setMatches] = useState([]);
  const { token, logout } = useAuth();
  const navigate = useNavigate();

  console.log('Matches component rendered, token:', token);

  useEffect(() => {
    console.log('useEffect running, token:', token);
    const fetchMatches = async () => {
      try {
        console.log('Fetching matches...');
        const res = await axios.get('http://localhost:5000/api/matches', {
          headers: { Authorization: `Bearer ${token}` }
        });
        console.log('Matches data:', res.data);
        setMatches(res.data);
      } catch (err) {
        console.error('Fetch error:', err);
      }
    };
    fetchMatches();
  }, [token]);

  return (
    <div style={{ minHeight: '100vh', backgroundColor: '#fff0f3' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', backgroundColor: 'white', padding: '16px 32px', boxShadow: '0 2px 10px rgba(0,0,0,0.1)' }}>
        <h1 style={{ color: '#e63946' }}>MurudoMurudo 💕</h1>
        <div>
          <button style={btn} onClick={() => navigate('/dashboard')}>Discover</button>
          <button style={btn} onClick={() => navigate('/profile')}>Profile</button>
          <button style={btn} onClick={() => { logout(); navigate('/login'); }}>Logout</button>
        </div>
      </div>
      <h2 style={{ textAlign: 'center', padding: '32px', color: '#333' }}>Your Matches 💕</h2>
      <div style={{ display: 'flex', flexWrap: 'wrap', gap: '24px', justifyContent: 'center', padding: '0 32px 32px' }}>
        {matches.length === 0 && <p style={{ color: '#666' }}>No matches yet — keep liking people! 💪</p>}
        {matches.map(m => (
          <div key={m.id} style={{ backgroundColor: 'white', borderRadius: '16px', padding: '24px', width: '250px', boxShadow: '0 4px 15px rgba(0,0,0,0.1)', textAlign: 'center' }}>
            <div style={{ width: '64px', height: '64px', borderRadius: '50%', backgroundColor: '#e63946', color: 'white', fontSize: '2rem', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 16px' }}>
              {m.name[0]}
            </div>
            <h3 style={{ fontSize: '1.2rem', marginBottom: '8px' }}>{m.name}</h3>
            <p style={{ color: '#666', fontSize: '0.9rem', marginBottom: '4px' }}>{m.university}</p>
            <p style={{ color: '#666', fontSize: '0.9rem', marginBottom: '4px' }}>{m.major} • {m.year}</p>
            <p style={{ color: '#999', fontSize: '0.85rem', margin: '12px 0' }}>{m.bio || 'No bio yet'}</p>
            <button style={{ padding: '10px 24px', backgroundColor: '#e63946', color: 'white', border: 'none', borderRadius: '8px', cursor: 'pointer' }} onClick={() => navigate(`/chat/${m.id}`)}>
              💬 Chat
            </button>
          </div>
        ))}
      </div>
    </div>
  );
}

const btn = { marginLeft: '12px', padding: '8px 16px', backgroundColor: '#e63946', color: 'white', border: 'none', borderRadius: '8px', cursor: 'pointer' };