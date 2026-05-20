import API from '../config';
import React, { useEffect, useState, useRef } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import axios from 'axios';
import { useAuth } from '../context/AuthContext';

export default function Chat() {
  const [messages, setMessages] = useState([]);
  const [newMessage, setNewMessage] = useState('');
  const { token, user } = useAuth();
  const { id } = useParams();
  const navigate = useNavigate();
  const bottomRef = useRef(null);

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

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const handleSend = async (e) => {
    e.preventDefault();
    if (!newMessage.trim()) return;
    try {
      await axios.post(`http://localhost:5000/api/messages/${id}`, { content: newMessage }, {
        headers: { Authorization: `Bearer ${token}` }
      });
      setNewMessage('');
      fetchMessages();
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <div style={{ minHeight: '100vh', backgroundColor: '#fff0f3', display: 'flex', flexDirection: 'column' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', backgroundColor: 'white', padding: '16px 32px', boxShadow: '0 2px 10px rgba(0,0,0,0.1)' }}>
        <h1 style={{ color: '#e63946' }}>MurudoMurudo 💕</h1>
        <button style={btn} onClick={() => navigate('/matches')}>Back to Matches</button>
      </div>
      <div style={{ flex: 1, overflowY: 'auto', padding: '24px 32px', display: 'flex', flexDirection: 'column', gap: '12px' }}>
        {messages.length === 0 && <p style={{ textAlign: 'center', color: '#666' }}>No messages yet — say hello! 👋</p>}
        {messages.map(m => (
          <div key={m.id} style={{ display: 'flex', justifyContent: m.sender_id === user?.id ? 'flex-end' : 'flex-start' }}>
            <div style={{ backgroundColor: m.sender_id === user?.id ? '#e63946' : 'white', color: m.sender_id === user?.id ? 'white' : '#333', padding: '12px 16px', borderRadius: '16px', maxWidth: '60%', boxShadow: '0 2px 8px rgba(0,0,0,0.1)' }}>
              {m.content}
            </div>
          </div>
        ))}
        <div ref={bottomRef} />
      </div>
      <form onSubmit={handleSend} style={{ display: 'flex', padding: '16px 32px', backgroundColor: 'white', boxShadow: '0 -2px 10px rgba(0,0,0,0.1)', gap: '12px' }}>
        <input
          style={{ flex: 1, padding: '12px', borderRadius: '8px', border: '1px solid #ddd', fontSize: '1rem' }}
          placeholder="Type a message..."
          value={newMessage}
          onChange={(e) => setNewMessage(e.target.value)}
        />
        <button style={{ ...btn, marginLeft: '0' }} type="submit">Send 💕</button>
      </form>
    </div>
  );
}

const btn = { marginLeft: '12px', padding: '8px 16px', backgroundColor: '#e63946', color: 'white', border: 'none', borderRadius: '8px', cursor: 'pointer' };