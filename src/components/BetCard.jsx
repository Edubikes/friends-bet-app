import React, { useState } from 'react';
import { useBets } from '../lib/BetContext';

export function BetCard({ bet }) {
    const { placeBet, resolveBet, state } = useBets();
    const [betAmount, setBetAmount] = useState(10);
    const [showResolve, setShowResolve] = useState(false);

    const calculateOdds = (optionPool, totalPool) => {
        if (optionPool === 0) return '2.00'; // Base odds if no bets
        // Simple logic: Total / Option. 
        // E.g. Pool 100. Option A has 50. Odds = 2.0. If you bet 10, you get 20.
        return (totalPool / optionPool).toFixed(2);
    };

    const handleBet = (optionId) => {
        // Determine bet amount
        const amount = parseInt(betAmount);
        if (state.currentUser.points < amount) {
            alert("No tienes puntos suficientes");
            return;
        }
        placeBet(bet.id, optionId, amount);
    };

    return (
        <div className="card bet-card">
            <div className="bet-header flex justify-between items-center">
                <div className="flex items-center gap-sm">
                    <div className="avatar">{bet.authorId === 'u1' ? '😎' : '👤'}</div>
                    {/* In real app, look up user by ID */}
                    <span className="text-sm text-muted">@{bet.authorId} preguntó:</span>
                </div>
                <div className="status-badge text-sm">
                    {bet.status === 'active' ? '🟢 En curso' : '🔴 Finalizada'}
                </div>
            </div>

            <h3 className="bet-title">{bet.title}</h3>

            <div className="options-grid">
                {bet.options.map((opt) => {
                    const odds = calculateOdds(opt.pool, bet.totalPool);
                    const isWinner = bet.status === 'resolved' && bet.result === opt.id;

                    return (
                        <button
                            key={opt.id}
                            className={`option-btn ${isWinner ? 'winner' : ''}`}
                            disabled={bet.status !== 'active'}
                            onClick={() => handleBet(opt.id)}
                        >
                            <div className="flex justify-between w-100">
                                <span>{opt.text}</span>
                                <span className="odds">x{odds}</span>
                            </div>
                            <div className="progress-bar">
                                <div
                                    className="fill"
                                    style={{ width: `${bet.totalPool > 0 ? (opt.pool / bet.totalPool) * 100 : 0}%` }}
                                />
                            </div>
                        </button>
                    );
                })}
            </div>

            {bet.status === 'active' && (
                <div className="bet-actions">
                    <div className="bet-input-group">
                        <label>Apuesta:</label>
                        <input
                            type="number"
                            value={betAmount}
                            onChange={(e) => setBetAmount(e.target.value)}
                            step="10"
                            min="10"
                        />
                        <span>pts</span>
                    </div>
                    <button className="btn-ghost text-sm" onClick={() => setShowResolve(!showResolve)}>
                        {showResolve ? 'Cancelar' : '⚠ Finalizar Apuesta'}
                    </button>
                </div>
            )}

            {showResolve && bet.status === 'active' && (
                <div className="resolve-panel glass">
                    <p className="text-sm font-bold text-center mb-2">¿Cuál fue el resultado real?</p>
                    <div className="flex flex-col gap-sm">
                        {bet.options.map(opt => (
                            <button
                                key={opt.id}
                                className="btn btn-secondary"
                                onClick={() => resolveBet(bet.id, opt.id)}
                            >
                                Gano: {opt.text}
                            </button>
                        ))}
                    </div>
                </div>
            )}

            {bet.status === 'resolved' && (
                <div className="result-banner text-center mt-2">
                    Resultado: <strong>{bet.options.find(o => o.id === bet.result)?.text}</strong>
                </div>
            )}

            <style>{`
        .bet-card {
          margin-bottom: var(--spacing-lg);
          position: relative;
          overflow: hidden;
        }
        .bet-title {
          font-size: var(--font-size-lg);
          margin: var(--spacing-sm) 0 var(--spacing-md);
        }
        .avatar {
          background: var(--bg-surface);
          border-radius: 50%;
          width: 32px;
          height: 32px;
          display: flex; 
          align-items: center; 
          justify-content: center;
        }
        .options-grid {
          display: flex;
          flex-direction: column;
          gap: var(--spacing-md);
        }
        .option-btn {
          background: var(--bg-surface);
          border: 1px solid var(--border-subtle);
          padding: var(--spacing-md);
          border-radius: var(--radius-sm);
          color: white;
          cursor: pointer;
          position: relative;
          text-align: left;
          width: 100%;
          transition: border 0.2s;
        }
        .option-btn:hover:not(:disabled) {
          border-color: var(--primary);
        }
        .option-btn.winner {
          border-color: var(--success);
          background: rgba(16, 185, 129, 0.1);
        }
        .odds {
          color: var(--accent);
          font-weight: bold;
        }
        .progress-bar {
          height: 3px;
          background: rgba(255,255,255,0.1);
          margin-top: 8px;
          border-radius: 2px;
          overflow: hidden;
        }
        .progress-bar .fill {
          height: 100%;
          background: var(--primary);
        }
        .bet-actions {
          margin-top: var(--spacing-lg);
          display: flex;
          justify-content: space-between;
          align-items: center;
          border-top: 1px solid var(--border-subtle);
          padding-top: var(--spacing-sm);
        }
        .bet-input-group {
          display: flex;
          align-items: center;
          gap: 8px;
          font-size: 14px;
        }
        .bet-input-group input {
          background: var(--bg-surface);
          border: 1px solid var(--border-subtle);
          color: white;
          width: 60px;
          padding: 4px;
          border-radius: 4px;
        }
        .resolve-panel {
          position: absolute;
          inset: 0;
          display: flex;
          flex-direction: column;
          justify-content: center;
          padding: 20px;
          z-index: 10;
        }
      `}</style>
        </div>
    );
}
