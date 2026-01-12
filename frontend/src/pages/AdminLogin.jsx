import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { loginAdmin } from '../services/api';
import Navbar from '../components/Navbar';
import Button from '../components/Button';
import Input from '../components/Input';

const AdminLogin = () => {
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const navigate = useNavigate();

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            const { data } = await loginAdmin({ username, password });
            localStorage.setItem('token', data.token);
            navigate('/admin/dashboard');
        } catch (error) {
            alert('Invalid credentials');
        }
    };

    return (
        <>
      <div style={{
        minHeight: '100vh',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        background: 'var(--primary-gradient)',
        position: 'relative',
        overflow: 'hidden',
        padding: 'var(--spacing-xl)'
      }}>
        {/* Abstract Background Shapes */}
        <div style={{
          position: 'absolute',
          top: '-10%',
          right: '-5%',
          width: '300px',
          height: '300px',
          background: 'var(--brand-gradient)',
          borderRadius: '50%',
          filter: 'blur(80px)',
          opacity: 0.1,
          animation: 'pulse 4s ease-in-out infinite'
        }} />
        
        <div className="glass" style={{ 
          width: '100%', 
          maxWidth: '450px', 
          padding: 'var(--spacing-3xl) var(--spacing-2xl)',
          borderRadius: 'var(--radius-2xl)',
          background: 'rgba(255, 255, 255, 0.98)',
          boxShadow: '0 40px 80px rgba(0,0,0,0.2)',
          animation: 'fadeInUp 0.8s cubic-bezier(0.4, 0, 0.2, 1) forwards',
          position: 'relative',
          zIndex: 1,
          border: '1px solid rgba(255, 255, 255, 0.2)'
        }}>
          <div style={{ textAlign: 'center', marginBottom: 'var(--spacing-2xl)' }}>
            <div style={{
              width: '64px',
              height: '64px',
              margin: '0 auto var(--spacing-lg)',
              background: 'var(--brand-gradient)',
              borderRadius: 'var(--radius-lg)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              boxShadow: '0 8px 20px rgba(124, 58, 237, 0.3)'
            }}>
              <img src="/favicon.png" alt="VibeKart" style={{ width: '32px', height: '32px' }} />
            </div>
            <h2 style={{ 
              fontSize: '32px', 
              fontWeight: '900',
              color: 'var(--text-color)',
              letterSpacing: '-1px'
            }}>
              Admin <span className="brand-text">Control</span>
            </h2>
            <p style={{ color: 'var(--text-light)', marginTop: '8px', fontWeight: '600' }}>
              Executive Dashboard Access
            </p>
          </div>

          <form onSubmit={handleSubmit}>
            <div style={{ marginBottom: 'var(--spacing-lg)' }}>
              <Input 
                label="Executive ID" 
                value={username} 
                onChange={(e) => setUsername(e.target.value)} 
                required
              />
            </div>
            <div style={{ marginBottom: 'var(--spacing-xl)' }}>
              <Input 
                label="Passkey" 
                type="password"
                value={password} 
                onChange={(e) => setPassword(e.target.value)} 
                required
              />
            </div>
            <Button 
                type="submit" 
                variant="primary"
                style={{ 
                    width: '100%',
                    padding: '18px',
                    fontSize: '16px',
                    fontWeight: '900',
                    boxShadow: '0 8px 30px rgba(124, 58, 237, 0.3)',
                    letterSpacing: '0.05em'
                }}
            >
                AUTHENTICATE
            </Button>
          </form>
        </div>
      </div>
        </>
    );
};

export default AdminLogin;
