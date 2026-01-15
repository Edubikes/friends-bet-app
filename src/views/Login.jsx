import React, { useState } from 'react';
import { useBets } from '../lib/BetContext';

export function Login() {
    const { login } = useBets();
    const [name, setName] = useState('');
    const [password, setPassword] = useState('');

    const handleSubmit = (e) => {
        e.preventDefault();
        if (!name || !password) {
            alert("Por favor ingresa tu nombre y contraseña");
            return;
        }
        // Simple logic: name is the user. Password just needs to be non-empty.
        login(name);
    };

    return (
        <div className="login-container">
            <div className="login-card glass">
                <h1 className="logo text-center mb-4">FriendsBet 💸</h1>
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
          display: flex;
          align-items: center;
          justify-content: center;
          padding: var(--spacing-md);
          background: radial-gradient(circle at top right, #1e1e1e 0%, #000000 100%);
        }
        .login-card {
          width: 100%;
          max-width: 400px;
          padding: var(--spacing-xl);
          border-radius: var(--radius-lg);
          border: 1px solid var(--border-subtle);
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
        input {
          width: 100%;
          background: var(--bg-surface);
          border: 1px solid var(--border-subtle);
          padding: 12px;
          border-radius: var(--radius-sm);
          color: white;
          font-size: 1rem;
        }
        input:focus {
          border-color: var(--primary);
          outline: none;
        }
      `}</style>
        </div>
    );
}
