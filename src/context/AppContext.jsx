import { createContext, useContext, useReducer, useCallback, useMemo } from 'react';
import { physicians as seedPhysicians, patients as seedPatients, initialAppointments } from '../data/mockData';

const AppContext = createContext(null);

const initialState = {
  currentUser: null,
  appointments: initialAppointments,
  physicians: seedPhysicians,
  patients: seedPatients,
  notifications: [],
  toast: null,
};

function uid(prefix) {
  return `${prefix}-${Math.random().toString(36).slice(2, 8)}-${Date.now().toString(36)}`;
}

function reducer(state, action) {
  switch (action.type) {
    case 'SET_USER':
      return { ...state, currentUser: action.payload };
    case 'LOGOUT':
      return { ...state, currentUser: null };
    case 'ADD_APPOINTMENT':
      return { ...state, appointments: [...state.appointments, action.payload] };
    case 'UPDATE_APPOINTMENT': {
      const { id, patch } = action.payload;
      return {
        ...state,
        appointments: state.appointments.map((a) => (a.id === id ? { ...a, ...patch } : a)),
      };
    }
    case 'CANCEL_APPOINTMENT': {
      const { id, cancelledBy, feeOwed } = action.payload;
      return {
        ...state,
        appointments: state.appointments.map((a) =>
          a.id === id ? { ...a, status: 'cancelled', cancelledBy, feeOwed: !!feeOwed } : a
        ),
      };
    }
    case 'ADD_NOTIFICATION':
      return { ...state, notifications: [action.payload, ...state.notifications] };
    case 'MARK_NOTIFICATION_READ':
      return {
        ...state,
        notifications: state.notifications.map((n) => (n.id === action.payload ? { ...n, read: true } : n)),
      };
    case 'MARK_ALL_NOTIFICATIONS_READ':
      return {
        ...state,
        notifications: state.notifications.map((n) =>
          action.payload.userId && n.userId === action.payload.userId ? { ...n, read: true } : n
        ),
      };
    case 'SET_TOAST':
      return { ...state, toast: action.payload };
    case 'CLEAR_TOAST':
      return { ...state, toast: null };
    default:
      return state;
  }
}

export function AppProvider({ children }) {
  const [state, dispatch] = useReducer(reducer, initialState);

  const setUser = useCallback((user) => dispatch({ type: 'SET_USER', payload: user }), []);
  const logout = useCallback(() => dispatch({ type: 'LOGOUT' }), []);

  const addAppointment = useCallback((appt) => {
    const fullAppt = { id: uid('appt'), createdAt: new Date().toISOString(), ...appt };
    dispatch({ type: 'ADD_APPOINTMENT', payload: fullAppt });
    return fullAppt;
  }, []);

  const updateAppointment = useCallback((id, patch) => {
    dispatch({ type: 'UPDATE_APPOINTMENT', payload: { id, patch } });
  }, []);

  const cancelAppointment = useCallback((id, cancelledBy, feeOwed = false) => {
    dispatch({ type: 'CANCEL_APPOINTMENT', payload: { id, cancelledBy, feeOwed } });
  }, []);

  const addNotification = useCallback((notification) => {
    const full = {
      id: uid('notif'),
      createdAt: new Date().toISOString(),
      read: false,
      ...notification,
    };
    dispatch({ type: 'ADD_NOTIFICATION', payload: full });
    return full;
  }, []);

  const markNotificationRead = useCallback((id) => {
    dispatch({ type: 'MARK_NOTIFICATION_READ', payload: id });
  }, []);

  const markAllRead = useCallback((userId) => {
    dispatch({ type: 'MARK_ALL_NOTIFICATIONS_READ', payload: { userId } });
  }, []);

  const showToast = useCallback((message, variant = 'success') => {
    const id = uid('toast');
    dispatch({ type: 'SET_TOAST', payload: { id, message, variant } });
    setTimeout(() => {
      dispatch({ type: 'CLEAR_TOAST' });
    }, 3000);
  }, []);

  const value = useMemo(
    () => ({
      ...state,
      setUser,
      logout,
      addAppointment,
      updateAppointment,
      cancelAppointment,
      addNotification,
      markNotificationRead,
      markAllRead,
      showToast,
    }),
    [
      state,
      setUser,
      logout,
      addAppointment,
      updateAppointment,
      cancelAppointment,
      addNotification,
      markNotificationRead,
      markAllRead,
      showToast,
    ]
  );

  return <AppContext.Provider value={value}>{children}</AppContext.Provider>;
}

export function useApp() {
  const ctx = useContext(AppContext);
  if (!ctx) throw new Error('useApp must be used within AppProvider');
  return ctx;
}
