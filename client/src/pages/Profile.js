import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { useAuth } from '../context/AuthContext';

export default function Profile() {
  const [form, setForm] = useState({ name: '', university: '', major: '', year: '', bio: '' });
  const [message, setMessage] = useState('');
  const { token, logout } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const res = await axios.get('http://localhost:5000/api/users/profile', {
          headers: { Authorization: `Bearer ${token}` }
        });
        setForm(res.data);
      } catch (err) {
        console.error(err);
      }
    };
    fetchProfile();
  }, [token]);

  const handleChange = (e) => setForm({ ...form, [e.target.name]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await axios.put('http://localhost:5000/api/users/profile', form, {
        headers: { Authorization: `Bearer ${token}` }
      });
      setMessage('Profile updated! ✅');
    } catch (err) {
      setMessage('Update failed');
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
          <button style={btn} onClick={() => navigate('/dashboard')}>Dashboard</button>
          <button style={btn} onClick={handleLogout}>Logout</button>
        </div>
      </div>
      <div style={{ display: 'flex', justifyContent: 'center', padding: '40px' }}>
        <div style={{ backgroundColor: 'white', padding: '40px', borderRadius: '16px', boxShadow: '0 4px 20px rgba(0,0,0,0.1)', width: '100%', maxWidth: '480px' }}>
          <h2 style={{ color: '#e63946', marginBottom: '24px', textAlign: 'center' }}>Your Profile</h2>
          {message && <p style={{ color: 'green', textAlign: 'center' }}>{message}</p>}
          <form onSubmit={handleSubmit}>
            <input style={inp} type="text" name="name" placeholder="Full name" value={form.name || ''} onChange={handleChange} />
            <input style={inp} type="text" name="university" placeholder="University" value={form.university || ''} onChange={handleChange} />
            <input style={inp} type="text" name="major" placeholder="Major" value={form.major || ''} onChange={handleChange} />
            <select style={inp} name="year" value={form.year || ''} onChange={handleChange}>
              <option value="">Select year</option>
              <option value="1st Year">1st Year</option>
              <option value="2nd Year">2nd Year</option>
              <option value="3rd Year">3rd Year</option>
              <option value="4th Year">4th Year</option>
              <option value="Graduate">Graduate</option>
            </select>
            <textarea style={{ ...inp, height: '100px' }} name="bio" placeholder="Write a short bio..." value={form.bio || ''} onChange={handleChange} />
            <button style={{ ...btn, width: '100%', padding: '12px', fontSize: '1rem', marginLeft: '0' }} type="submit">Save Changes</button>
          </form>
        </div>
      </div>
    </div>
  );
}

const inp = { width: '100%', padding: '12px', marginBottom: '16px', borderRadius: '8px', border: '1px solid #ddd', fontSize: '1rem', boxSizing: 'border-box' };
const btn = { marginLeft: '12px', padding: '8px 16px', backgroundColor: '#e63946', color: 'white', border: 'none', borderRadius: '8px', cursor: 'pointer' };