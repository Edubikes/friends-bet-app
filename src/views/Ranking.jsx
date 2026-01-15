import React, { useState } from 'react';
import { useBets } from '../lib/BetContext';

export function Ranking() {
  const { state, setPrize } = useBets();
  const [isEditing, setIsEditing] = useState(false);
  const [tempPrize, setTempPrize] = useState(state.monthlyPrize);

  const sortedUsers = [...state.users].sort((a, b) => b.points - a.points);

  const savePrize = () => {
    setPrize(tempPrize);
    setIsEditing(false);
  };

  return (
    <div className="view-container">
      <header className="header glass flex-col items-center">
        <h1 className="text-center w-100 mb-2">🏆 MierclitorisBET Ranking</h1>

        {state.lastMonthWinner && (
          <div className="winner-banner w-100 text-center mb-4">
            👑 Ganador del mes pasado: <strong>{state.lastMonthWinner.name}</strong>
          </div>
        )}

        <div className="prize-container w-100 card glass-dark">
          <div className="flex justify-between items-center mb-2">
            <span className="text-sm text-muted">🎁 Premio del mes:</span>
            {!isEditing && <button className="btn-icon-sm" onClick={() => setIsEditing(true)}>✏️</button>}
          </div>
          {isEditing ? (
            <div className="flex gap-sm">
              <input
                value={tempPrize}
                onChange={e => setTempPrize(e.target.value)}
                className="prize-input"
              />
              <button className="btn-sm" onClick={savePrize}>💾</button>
            </div>
          ) : (
            <div className="prize-text">{state.monthlyPrize}</div>
          )}
        </div>
      </header>

      <div className="ranking-list">
        {sortedUsers.map((user, index) => (
          <div key={user.id} className="rank-item card flex items-center justify-between">
            <div className="flex items-center gap-md">
              <div className={`rank-number rank-${index + 1}`}>{index + 1}</div>
              <div className="avatar rank-avatar">{user.avatar}</div>
              <div>
                <div className="font-bold">{user.name}</div>
                {user.id === state.currentUser.id && <div className="text-sm text-muted">Tú</div>}
              </div>
            </div>
            <div className="points font-bold">{user.points} pts</div>
          </div>
        ))}
      </div>

      <style>{`
        .header {
          padding: var(--spacing-md);
          border-bottom: 1px solid var(--border-subtle);
        }
        .ranking-list {
          padding: var(--spacing-md);
          padding-bottom: 80px;
          display: flex;
          flex-direction: column;
          gap: var(--spacing-sm);
        }
        .winner-banner {
            background: linear-gradient(90deg, #f59e0b, #ebbf1c);
            color: black;
            padding: 8px;
            border-radius: var(--radius-sm);
            font-size: 0.9rem;
            margin-bottom: 12px;
        }
        .prize-container {
            padding: 12px;
            border: 1px solid var(--accent);
        }
        .prize-text { font-size: 1.1rem; font-weight: bold; color: var(--accent); }
        .prize-input { width: 100%; background: #000; color: white; border: 1px solid #333; padding: 4px; }
        .btn-icon-sm { background: none; border: none; cursor: pointer; }
        .btn-sm { background: var(--primary); border: none; border-radius: 4px; padding: 4px 8px; cursor: pointer; }
        .glass-dark { background: rgba(0,0,0,0.3); }
        .rank-item {
          padding: var(--spacing-md);
        }
        .rank-number {
          font-weight: 900;
          font-size: 1.2rem;
          opacity: 0.5;
          width: 24px;
        }
        .rank-1 { color: #ebbf1c; opacity: 1; font-size: 1.5rem; }
        .rank-2 { color: #c0c0c0; opacity: 1; }
        .rank-3 { color: #cd7f32; opacity: 1; }
        
        .rank-avatar {
          background: var(--bg-surface);
          border-radius: 50%;
          width: 40px;
          height: 40px;
          display: flex; 
          align-items: center; 
          justify-content: center;
          font-size: 1.2rem;
        }
        .points {
          color: var(--accent);
        }
      `}</style>
    </div>
  );
}
