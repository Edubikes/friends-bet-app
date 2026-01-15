import { createContext, useContext, useReducer, useEffect } from 'react';

const BetContext = createContext();

// Helper to get initial user from local storage
const getStoredUser = () => {
  const stored = localStorage.getItem('friendsbet_user');
  return stored ? JSON.parse(stored) : null;
};

// Helper for monthly logic
const getCurrentMonthKey = () => {
  const d = new Date();
  return `${d.getMonth() + 1}-${d.getFullYear()}`;
};

const initialState = {
  currentUser: getStoredUser(),
  currentMonth: getCurrentMonthKey(),
  lastMonthWinner: null, // { name: 'Edu', month: '12-2025' }
  monthlyPrize: 'Una caguama bien fría 🍺',
  users: [
    { id: 'u1', name: 'Eduardo', avatar: '😎', points: 100 },
    { id: 'u2', name: 'Sofia', avatar: '👩‍🎤', points: 100 },
    { id: 'u3', name: 'Diego', avatar: '🧢', points: 100 },
    { id: 'u4', name: 'Ana', avatar: '🌺', points: 100 },
  ],
  bets: [
    {
      id: 'b1',
      authorId: 'u2',
      title: '¿A Edu lo sacan de la peda antes de las 12?',
      options: [
        { id: 1, text: 'Antes de las 12', pool: 50 },
        { id: 2, text: 'Después de las 12', pool: 30 },
        { id: 3, text: 'No lo sacan', pool: 10 },
      ],
      status: 'active', // active, resolved
      createdAt: Date.now() - 100000,
      totalPool: 90
    },
    {
      id: 'b2',
      authorId: 'u3',
      title: '¿Quién gana el FIFA?',
      options: [
        { id: 1, text: 'Diego', pool: 100 },
        { id: 2, text: 'Edu', pool: 20 },
        { id: 3, text: 'Empate', pool: 5 },
      ],
      status: 'active',
      createdAt: Date.now() - 50000,
      totalPool: 125
    }
  ],
};

function betReducer(state, action) {
  switch (action.type) {
    case 'CHECK_MONTHLY_RESET': {
      const nowKey = getCurrentMonthKey();
      if (state.currentMonth !== nowKey) {
        // New Month! Find winner
        const winner = [...state.users].sort((a, b) => b.points - a.points)[0];

        // Reset all to 100
        const resetUsers = state.users.map(u => ({ ...u, points: 100 }));

        // Update current user if exists
        let newCurrentUser = state.currentUser;
        if (newCurrentUser) newCurrentUser = { ...newCurrentUser, points: 100 };

        return {
          ...state,
          currentMonth: nowKey,
          lastMonthWinner: { name: winner.name, month: state.currentMonth },
          users: resetUsers,
          currentUser: newCurrentUser
        };
      }
      return state;
    }
    case 'SET_PRIZE': {
      return { ...state, monthlyPrize: action.payload };
    }
    case 'LOGIN': {
      const user = action.payload;
      localStorage.setItem('friendsbet_user', JSON.stringify(user));
      // Check if user exists in list, if not add them
      const exists = state.users.find(u => u.name.toLowerCase() === user.name.toLowerCase());
      let newUsers = state.users;
      let currentUser = exists || { ...user, id: `u${Date.now()}`, points: 100, avatar: '👤' };

      if (!exists) {
        newUsers = [...state.users, currentUser];
      } else {
        currentUser = exists; // Use existing data (points etc)
      }

      return { ...state, currentUser, users: newUsers };
    }
    case 'LOGOUT': {
      localStorage.removeItem('friendsbet_user');
      return { ...state, currentUser: null };
    }
    case 'PLACE_BET': {
      const { betId, optionId, amount } = action.payload;
      // Update User Points
      const updatedUser = { ...state.currentUser, points: state.currentUser.points - amount };

      // Update Bet Pool
      const updatedBets = state.bets.map(bet => {
        if (bet.id === betId) {
          const updatedOptions = bet.options.map(opt =>
            opt.id === optionId ? { ...opt, pool: opt.pool + amount } : opt
          );
          return { ...bet, options: updatedOptions, totalPool: bet.totalPool + amount };
        }
        return bet;
      });

      return { ...state, currentUser: updatedUser, bets: updatedBets };
    }
    case 'DELETE_BET': {
      const betId = action.payload;
      return { ...state, bets: state.bets.filter(b => b.id !== betId) };
    }
    case 'RESOLVE_BET': {
      const { betId, winningOptionId } = action.payload;

      // 1. Mark bet as resolved
      // 2. Distribute payouts (simplified for this proof of concept)
      // In a real app we would calculate payouts for all users. 
      // Here we just mark it resolved.

      const updatedBets = state.bets.map(bet =>
        bet.id === betId ? { ...bet, status: 'resolved', result: winningOptionId } : bet
      );

      return { ...state, bets: updatedBets };
    }
    case 'CREATE_BET': {
      const newBet = {
        id: `b${Date.now()}`,
        authorId: state.currentUser.id,
        title: action.payload.title,
        imageUrl: action.payload.imageUrl || null,
        options: action.payload.options.map((text, idx) => ({ id: idx + 1, text, pool: 0 })),
        status: 'active',
        createdAt: Date.now(),
        totalPool: 0
      };
      return { ...state, bets: [newBet, ...state.bets] };
    }
    default:
      return state;
  }
}

export function BetProvider({ children }) {
  const [state, dispatch] = useReducer(betReducer, initialState);

  const placeBet = (betId, optionId, amount) => {
    dispatch({ type: 'PLACE_BET', payload: { betId, optionId, amount } });
  };

  const resolveBet = (betId, winningOptionId) => {
    dispatch({ type: 'RESOLVE_BET', payload: { betId, winningOptionId } });
  };

  const createBet = (title, options, imageUrl) => {
    dispatch({ type: 'CREATE_BET', payload: { title, options, imageUrl } });
  };

  const deleteBet = (betId) => {
    dispatch({ type: 'DELETE_BET', payload: betId });
  };

  const login = (name) => {
    dispatch({ type: 'LOGIN', payload: { name, avatar: '👤' } });
  };

  const logout = () => {
    dispatch({ type: 'LOGOUT' });
  };

  const setPrize = (prize) => {
    dispatch({ type: 'SET_PRIZE', payload: prize });
  };

  // Check for reset on load
  useEffect(() => {
    dispatch({ type: 'CHECK_MONTHLY_RESET' });
  }, []);

  return (
    <BetContext.Provider value={{ state, placeBet, resolveBet, createBet, deleteBet, login, logout, setPrize }}>
      {children}
    </BetContext.Provider>
  );
}

export function useBets() {
  return useContext(BetContext);
}
