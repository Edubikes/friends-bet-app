import { createContext, useContext, useReducer, useEffect } from 'react';
import { supabase } from './supabaseClient';

const BetContext = createContext();

// Helper for monthly logic
const getCurrentMonthKey = () => {
  const d = new Date();
  return `${d.getMonth() + 1}-${d.getFullYear()}`;
};

// Helper for daily logic
const getTodayKey = () => {
  const d = new Date();
  return `${d.getDate()}-${d.getMonth() + 1}-${d.getFullYear()}`;
};

// State now starts mostly empty/loading
const initialState = {
  currentUser: JSON.parse(localStorage.getItem('friendsbet_user')) || null, // Keep user login in LS for convenience
  currentMonth: getCurrentMonthKey(),
  lastMonthWinner: null,
  monthlyPrize: 'Cargando...',
  users: [],
  bets: [],
  loading: true
};

function betReducer(state, action) {
  switch (action.type) {
    case 'SET_DATA': {
      return {
        ...state,
        users: action.payload.users || [],
        bets: action.payload.bets || [],
        monthlyPrize: action.payload.globals?.monthly_prize || 'Sugerir Premio',
        lastMonthWinner: action.payload.globals?.last_month_winner || null,
        loading: false
      };
    }
    case 'REALTIME_UPDATE_BETS': {
      // Triggered by subscription, we just updated state via SET_DATA mostly, 
      // but if we implemented granular updates, they would go here.
      // For this MVP, we rely on refetching in the effect.
      return state;
    }
    case 'SET_PRIZE': {
      return { ...state, monthlyPrize: action.payload };
    }
    case 'LOGIN': {
      const user = action.payload;
      localStorage.setItem('friendsbet_user', JSON.stringify(user));
      return { ...state, currentUser: user };
    }
    case 'LOGOUT': {
      localStorage.removeItem('friendsbet_user');
      return { ...state, currentUser: null };
    }
    default:
      return state;
  }
}

export function BetProvider({ children }) {
  const [state, dispatch] = useReducer(betReducer, initialState);

  // --- ACTIONS (Async Wrappers) ---

  const fetchData = async () => {
    try {
      const { data: users } = await supabase.from('users').select('*');
      const { data: bets } = await supabase.from('bets').select('*');
      const { data: globals } = await supabase.from('globals').select('*').single();

      dispatch({
        type: 'SET_DATA',
        payload: { users, bets, globals }
      });
    } catch (e) {
      console.error("Error fetching data:", e);
    }
  };

  const login = async (name) => {
    // Check if user exists in Supabase
    let { data: user } = await supabase.from('users').select('*').ilike('name', name).single();

    if (!user) {
      // Create new user
      const newUser = { id: `u${Date.now()}`, name, avatar: '👤', points: 100 };
      await supabase.from('users').insert(newUser);
      user = newUser;
    } else {
      // Check Daily Reward Logic on Cloud User
      const today = getTodayKey();
      if (user.last_reward_date !== today) {
        const newPoints = (user.points || 0) + 100;
        await supabase.from('users').update({ points: newPoints, last_reward_date: today }).eq('id', user.id);
        user = { ...user, points: newPoints, last_reward_date: today };
        setTimeout(() => alert(`🎉 ¡Recompensa Diaria!\nRecibiste +100 puntos por entrar hoy.`), 500);
      }
    }

    dispatch({ type: 'LOGIN', payload: user });
  };

  const logout = () => {
    dispatch({ type: 'LOGOUT' });
  };

  const placeBet = async (betId, optionId, amount) => {
    // 1. Get current bet & user to ensure strict consistency (optional but safer)
    // For MVP, we use local state data but push to DB
    const bet = state.bets.find(b => b.id === betId);
    const user = state.currentUser;

    if (!bet || !user) return;

    // Update User Points
    await supabase.from('users').update({ points: user.points - amount }).eq('id', user.id);

    // Update Bet Pool
    const updatedOptions = bet.options.map(opt =>
      opt.id === optionId ? { ...opt, pool: opt.pool + amount } : opt
    );
    const newVoters = [...(bet.voters || []), user.id];

    await supabase.from('bets').update({
      options: updatedOptions,
      total_pool: bet.totalPool + amount,
      voters: newVoters
    }).eq('id', betId);
  };

  const createBet = async (title, options, imageUrl) => {
    const newBet = {
      id: `b${Date.now()}`,
      author_id: state.currentUser.id,
      title,
      image_url: imageUrl || null,
      options: options.map((text, idx) => ({ id: idx + 1, text, pool: 0 })),
      status: 'active',
      created_at: Date.now(),
      total_pool: 0,
      voters: [],
      comments: []
    };
    await supabase.from('bets').insert(newBet);
  };

  const resolveBet = async (betId, winningOptionId) => {
    await supabase.from('bets').update({
      status: 'resolved',
      result_option_id: winningOptionId
    }).eq('id', betId);
  };

  const deleteBet = async (betId) => {
    await supabase.from('bets').delete().eq('id', betId);
  };

  const addComment = async (betId, text) => {
    const bet = state.bets.find(b => b.id === betId);
    const newComment = {
      id: `c${Date.now()}`,
      user: state.currentUser.name,
      text,
      time: Date.now()
    };
    const newComments = [...(bet.comments || []), newComment];

    await supabase.from('bets').update({ comments: newComments }).eq('id', betId);
  };

  const setPrize = async (prize) => {
    await supabase.from('globals').update({ monthly_prize: prize }).eq('id', 'config');
    // Local dispatch to feel instant
    dispatch({ type: 'SET_PRIZE', payload: prize });
  };

  // --- INITIAL LOAD & REALTIME ---
  useEffect(() => {
    fetchData();

    // Subscribe to ALL changes
    const subscription = supabase
      .channel('public:everything')
      .on('postgres_changes', { event: '*', schema: 'public' }, () => {
        console.log('Change received! Refreshing data...');
        fetchData();
      })
      .subscribe();

    return () => {
      supabase.removeChannel(subscription);
    };
  }, []);

  // Sync currentUser with latest fetched users data
  useEffect(() => {
    if (state.currentUser && state.users.length > 0) {
      const syncedUser = state.users.find(u => u.id === state.currentUser.id);
      if (syncedUser && (syncedUser.points !== state.currentUser.points)) {
        // Upate local session user if remote changed
        dispatch({ type: 'LOGIN', payload: syncedUser });
      }
    }
  }, [state.users]);

  return (
    <BetContext.Provider value={{ state, placeBet, resolveBet, createBet, deleteBet, login, logout, setPrize, addComment }}>
      {children}
    </BetContext.Provider>
  );
}

export function useBets() {
  return useContext(BetContext);
}
