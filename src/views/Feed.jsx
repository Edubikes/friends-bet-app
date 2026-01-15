import React, { useState } from 'react';
import { useBets } from '../lib/BetContext';
import { BetCard } from '../components/BetCard';

export function Feed() {
  const { state, logout } = useBets();
  const [activeTab, setActiveTab] = useState('active'); // active | resolved

  // Sort by newest
  const allBets = [...state.bets].sort((a, b) => b.created_at - a.created_at);
  const filteredBets = allBets.filter(bet => bet.status === activeTab);

  return (
    <div className="view-container">
      <header className="header glass flex-col gap-sm">
        <div className="flex justify-between items-center w-100">
          <h1 className="logo">MierclitorisBET 🍑</h1>
          <div className="flex items-center gap-sm">
            <div className="user-score">
              <span>{state.currentUser.points} pts</span>
              <span className="avatar-sm">{state.currentUser.avatar}</span>
            </div>
            <button onClick={logout} className="btn-icon-glass" title="Salir">🚪</button>
          </div>
        </div>

        <div className="tabs w-100 flex gap-xs p-1 bg-surface rounded">
          <button
            className={`tab-btn ${activeTab === 'active' ? 'active' : ''}`}
            onClick={() => setActiveTab('active')}
          >
            🔥 En Curso
          </button>
          <button
            className={`tab-btn ${activeTab === 'resolved' ? 'active' : ''}`}
            onClick={() => setActiveTab('resolved')}
          >
            🏁 Finalizadas
          </button>
        </div>
      </header>

      <div className="feed-content">
        {filteredBets.length === 0 ? (
          <div className="text-center text-muted mt-4">
            No hay apuestas {activeTab === 'active' ? 'en curso' : 'finalizadas'}
          </div>
        ) : (
          filteredBets.map(bet => (
            <BetCard key={bet.id} bet={bet} />
          ))
        )}
      </div>

      <style>{`
        .header {
          position: sticky;
          top: 0;
          z-index: 90;
          padding: var(--spacing-md);
          border-bottom: 1px solid var(--border-subtle);
        }
        .logo {
          font-size: 1.2rem;
          font-weight: 800;
          background: linear-gradient(to right, #fff, #ccc);
          -webkit-background-clip: text;
          -webkit-text-fill-color: transparent;
        }
        .user-score {
          display: flex;
          align-items: center;
          gap: 8px;
          font-weight: bold;
          font-size: 0.9rem;
          background: rgba(255,255,255,0.1);
          padding: 4px 12px;
          border-radius: var(--radius-full);
        }
        .feed-content {
          padding: var(--spacing-md);
          padding-bottom: 80px; /* Space for navbar */
        }
        .bg-surface { background: var(--bg-surface); }
        .rounded { border-radius: var(--radius-sm); }
        .p-1 { padding: 4px; }
        .gap-xs { gap: 4px; }
        .tab-btn {
            flex: 1;
            background: none;
            border: none;
            color: var(--text-secondary);
            padding: 8px;
            border-radius: var(--radius-sm);
            cursor: pointer;
            font-weight: bold;
            font-size: 0.9rem;
            transition: all 0.2s;
        }
        .tab-btn.active {
            background: var(--bg-card);
            color: white;
            box-shadow: 0 2px 4px rgba(0,0,0,0.2);
        }
        .btn-icon-glass {
            background: rgba(255, 255, 255, 0.1);
            border: none;
            border-radius: 50%;
            width: 32px;
            height: 32px;
            display: flex;
            align-items: center;
            justify-content: center;
            cursor: pointer;
            font-size: 1.2rem;
            transition: all 0.2s;
        }
        .btn-icon-glass:hover {
            background: rgba(255, 25, 25, 0.3);
            transform: scale(1.1);
        }
      `}</style>
    </div>
  );
}
