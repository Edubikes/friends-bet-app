import React, { useState, useEffect } from 'react';
import { useBets } from '../lib/BetContext';

const BACKGROUNDS = [
  '/images/bg-1.jpg',
  '/images/bg-2.jpg'
];

export function Login() {
  const { login } = useBets();
  const [name, setName] = useState('');
  const [password, setPassword] = useState('');
  const [bgIndex, setBgIndex] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setBgIndex(prev => (prev + 1) % BACKGROUNDS.length);
    }, 5000); // Change every 5 seconds
    return () => clearInterval(interval);
  }, []);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!name || !password) {
      alert("Por favor ingresa tu nombre y contraseña");
      return;
    }
    login(name);
  };

  return (
    <div className="login-container">
      <div
        className="bg-slideshow"
        style={{ backgroundImage: `url(${BACKGROUNDS[bgIndex]})` }}
      />
      <div className="overlay" />

      <div className="login-card glass">
        <h1 className="logo text-center mb-4">MierclitorisBET 🍑</h1>
        <p className="text-center text-muted mb-4">Inicia sesión para jugar</p>

        <form onSubmit={handleSubmit} className="flex flex-col gap-md">
          <div className="form-group">
            <label>Nombre de usuario</label>
            <input
              type="text"
              placeholder="Ej: Eduardo"
              value={name}
              onChange={e => setName(e.target.value)}
              autoFocus
            />
          </div>

          <div className="form-group">
            <label>Contraseña</label>
            <input
              type="password"
              placeholder="••••"
              value={password}
              onChange={e => setPassword(e.target.value)}
            />
          </div>

          <button type="submit" className="btn w-100 mt-2">Entrar</button>
        </form>
      </div>

      <style>{`
        .login-container {
          min-height: 100vh;
          width: 100%;
          display: flex;
          align-items: center;
          justify-content: center;
          padding: var(--spacing-md);
          position: relative;
          overflow: hidden;
        }
        .bg-slideshow {
            position: absolute;
            inset: 0;
            background-size: cover;
            background-position: center;
            transition: background-image 1s ease-in-out;
            z-index: 0;
        }
        .overlay {
            position: absolute;
            inset: 0;
            background: rgba(0,0,0,0.6); /* Darken bg for readability */
            z-index: 1;
        }
        .login-card {
          width: 100%;
          max-width: 400px;
          padding: var(--spacing-xl);
          border-radius: var(--radius-lg);
          border: 1px solid rgba(255,255,255,0.1);
          background: rgba(0, 0, 0, 0.4);
          backdrop-filter: blur(20px);
          -webkit-backdrop-filter: blur(20px);
          z-index: 2;
          box-shadow: 0 8px 32px 0 rgba(0, 0, 0, 0.37);
        }
        .logo {
          font-size: 2rem;
          font-weight: 800;
          background: linear-gradient(to right, #fff, #ccc);
          -webkit-background-clip: text;
          -webkit-text-fill-color: transparent;
        }
        .mb-4 { margin-bottom: 24px; }
        .mt-2 { margin-top: 16px; }
        .form-group label { display: block; margin-bottom: 8px; font-weight: bold; font-size: 0.9rem; }
        input {
          width: 100%;
          background: rgba(255,255,255,0.1);
          border: 1px solid rgba(255,255,255,0.2);
          padding: 12px;
          border-radius: var(--radius-sm);
          color: white;
          font-size: 1rem;
        }
        input:focus {
          border-color: var(--primary);
          outline: none;
          background: rgba(255,255,255,0.15);
        }
        .btn {
            padding: 12px;
            font-size: 1rem;
            font-weight: bold;
        }
      `}</style>
    </div>
  );
}
