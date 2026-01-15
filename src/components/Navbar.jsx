import React from 'react';

export function Navbar({ activeTab, onTabChange }) {
    // Simple inline SVGs for icons
    const icons = {
        feed: (
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"></path>
                <polyline points="9 22 9 12 15 12 15 22"></polyline>
            </svg>
        ),
        rankings: (
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M6 9H4.5a2.5 2.5 0 0 1 0-5H6"></path>
                <path d="M18 9h1.5a2.5 2.5 0 0 0 0-5H18"></path>
                <path d="M4 22h16"></path>
                <path d="M10 14.66V17c0 .55-.47.98-.97 1.21C7.85 18.75 7 20.24 7 22"></path>
                <path d="M14 14.66V17c0 .55.47.98.97 1.21C16.15 18.75 17 20.24 17 22"></path>
                <path d="M18 2H6v7a6 6 0 0 0 12 0V2Z"></path>
            </svg>
        ),
        create: (
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <circle cx="12" cy="12" r="10"></circle>
                <line x1="12" y1="8" x2="12" y2="16"></line>
                <line x1="8" y1="12" x2="16" y2="12"></line>
            </svg>
        )
    };

    return (
        <nav className="navbar glass">
            <button
                className={`nav-item ${activeTab === 'feed' ? 'active' : ''}`}
                onClick={() => onTabChange('feed')}
            >
                {icons.feed}
                <span>Feed</span>
            </button>

            <button
                className={`nav-item ${activeTab === 'create' ? 'active' : ''}`}
                onClick={() => onTabChange('create')}
            >
                {icons.create}
                <span>Crear</span>
            </button>

            <button
                className={`nav-item ${activeTab === 'rankings' ? 'active' : ''}`}
                onClick={() => onTabChange('rankings')}
            >
                {icons.rankings}
                <span>Rank</span>
            </button>

            <style>{`
        .navbar {
          position: fixed;
          bottom: 0;
          left: 0;
          right: 0;
          height: 60px;
          display: flex;
          justify-content: space-around;
          align-items: center;
          border-top: 1px solid var(--border-subtle);
          z-index: 100;
        }
        .nav-item {
          background: none;
          border: none;
          color: var(--text-secondary);
          display: flex;
          flex-direction: column;
          align-items: center;
          font-size: 10px;
          gap: 4px;
          cursor: pointer;
        }
        .nav-item.active {
          color: var(--primary);
        }
      `}</style>
        </nav>
    );
}
