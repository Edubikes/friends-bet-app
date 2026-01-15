import React from 'react';
import { useBets } from '../lib/BetContext';

export function Ranking() {
    const { state } = useBets();

    const sortedUsers = [...state.users].sort((a, b) => b.points - a.points);

    return (
        <div className="view-container">
            <header className="header glass">
                <h1 className="text-center w-100">🏆 Ranking</h1>
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
