import React, { useState } from 'react';
import { useBets } from '../lib/BetContext';

export function CreateBet({ onComplete }) {
    const { createBet } = useBets();
    const [title, setTitle] = useState('');
    const [options, setOptions] = useState(['', '', '']); // 3 options default

    const handleOptionChange = (idx, val) => {
        const newOpts = [...options];
        newOpts[idx] = val;
        setOptions(newOpts);
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        if (!title || options.some(o => !o)) {
            alert("Llena todos los campos");
            return;
        }
        createBet(title, options);
        onComplete(); // Go back to feed
    };

    return (
        <div className="view-container">
            <header className="header glass">
                <h1>Nueva Apuesta</h1>
            </header>

            <form className="create-form container" onSubmit={handleSubmit}>
                <div className="form-group">
                    <label>¿Qué va a pasar?</label>
                    <textarea
                        placeholder="Ej: A Edu lo sacan de la peda..."
                        value={title}
                        onChange={e => setTitle(e.target.value)}
                        rows={3}
                    />
                </div>

                <label>Opciones (Mínimo 3)</label>
                {options.map((opt, idx) => (
                    <div key={idx} className="form-group">
                        <input
                            placeholder={`Opción ${idx + 1}`}
                            value={opt}
                            onChange={e => handleOptionChange(idx, e.target.value)}
                        />
                    </div>
                ))}

                <button type="submit" className="btn w-100 mt-4">Publicar Apuesta</button>
            </form>

            <style>{`
        .header { padding: var(--spacing-md); border-bottom: 1px solid var(--border-subtle); }
        .create-form { padding-top: var(--spacing-xl); }
        .form-group { margin-bottom: var(--spacing-md); }
        .form-group label { display: block; marginBottom: 8px; color: var(--text-secondary); font-size: 0.9rem;}
        
        textarea, input {
          width: 100%;
          background: var(--bg-card);
          border: 1px solid var(--border-subtle);
          padding: 12px;
          border-radius: var(--radius-sm);
          color: white;
          font-family: inherit;
        }
        textarea:focus, input:focus {
          border-color: var(--primary);
          outline: none;
        }
        .w-100 { width: 100%; }
        .mt-4 { margin-top: 24px; }
      `}</style>
        </div>
    );
}
