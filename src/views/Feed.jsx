import React from 'react';
import { useBets } from '../lib/BetContext';
import { BetCard } from '../components/BetCard';

export function Feed() {
    const { state } = useBets();

    // Sort by newest
    const sortedBets = [...state.bets].sort((a, b) => b.createdAt - a.createdAt);

    return (
        <div className="view-container">
            <header className="header glass">
                <h1 className="logo">FriendsBet 💸</h1>
                <div className="user-score">
                    <span>{state.currentUser.points} pts</span>
                    <span className="avatar-sm">{state.currentUser.avatar}</span>
                </div>
            </header>

            <div className="feed-content">
                {sortedBets.map(bet => (
                    <BetCard key={bet.id} bet={bet} />
                ))}
            </div>

            <style>{`
        .header {
          position: sticky;
          top: 0;
          z-index: 90;
          padding: var(--spacing-md);
          display: flex;
          justify-content: space-between;
          align-items: center;
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
      `}</style>
        </div>
    );
}
