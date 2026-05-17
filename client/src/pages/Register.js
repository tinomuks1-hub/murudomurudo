import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import axios from 'axios';
import { useAuth } from '../context/AuthContext';

export default function Register() {
  const [form, setForm] = useState({ name: '', email: '', password: '', university: '', major: '', year: '' });
  const [error, setError] = useState('');
  const { login } = useAuth();
  const navigate = useNavigate();

  const handleChange = (e) => setForm({ ...form, [e.target.name]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const res = await axios.post('http://localhost:5000/api/auth/register', form);
      login(res.data.user, res.data.token);
      navigate('/dashboard');
    } catch (err) {
      setError(err.response?.data?.message || 'Registration failed');
    }
  };

  return (
    <div style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', backgroundColor: '#fff0f3' }}>
      <div style={{ backgroundColor: 'white', padding: '40px', borderRadius: '16px', boxShadow: '0 4px 20px rgba(0,0,0,0.1)', width: '100%', maxWidth: '400px' }}>
        <h1 style={{ color: '#e63946', textAlign: 'center' }}>MurudoMurudo 💕</h1>
        <h2 style={{ textAlign: 'center', color: '#666', marginBottom: '24px' }}>Create your account</h2>
        {error && <p style={{ color: 'red', textAlign: 'center' }}>{error}</p>}
        <form onSubmit={handleSubmit}>
          <input style={inp} type="text" name="name" placeholder="Full name" onChange={handleChange} required />
          <input style={inp} type="email" name="email" placeholder="University email" onChange={handleChange} required />
          <input style={inp} type="password" name="password" placeholder="Password" onChange={handleChange} required />
          <input style={inp} type="text" name="university" placeholder="University name" onChange={handleChange} />
          <input style={inp} type="text" name="major" placeholder="Your major" onChange={handleChange} />
          <select style={inp} name="year" onChange={handleChange}>
            <option value="">Select year</option>
            <option value="1st Year">1st Year</option>
            <option value="2nd Year">2nd Year</option>
            <option value="3rd Year">3rd Year</option>
            <option value="4th Year">4th Year</option>
            <option value="Graduate">Graduate</option>
          </select>
          <button style={{ ...inp, backgroundColor: '#e63946', color: 'white', border: 'none', cursor: 'pointer', fontSize: '1rem' }} type="submit">
            Create Account
          </button>
        </form>
        <p style={{ textAlign: 'center', marginTop: '16px', color: '#666' }}>
          Already have an account? <Link to="/login">Login</Link>
        </p>
      </div>
    </div>
  );
}

const inp = { width: '100%', padding: '12px', marginBottom: '16px', borderRadius: '8px', border: '1px solid #ddd', fontSize: '1rem', boxSizing: 'border-box' };