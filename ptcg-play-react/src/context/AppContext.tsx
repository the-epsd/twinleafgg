import React, { createContext, useContext, useState, useEffect } from 'react';
import { authService } from '../services/auth.service';
import { socketService } from '../services/socket.service';

interface User {
  id: number;
  name: string;
  roleId: number;
}

interface AppContextType {
  isLoggedIn: boolean;
  user: User | null;
  setUser: (user: User | null) => void;
  login: (username: string, password: string) => Promise<void>;
  logout: () => void;
  socketConnected: boolean;
}

const AppContext = createContext<AppContextType | undefined>(undefined);

export const AppProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [isLoggedIn, setIsLoggedIn] = useState(authService.isAuthenticated());
  const [user, setUser] = useState<User | null>(authService.getUser());
  const [socketConnected, setSocketConnected] = useState(socketService.isConnected);

  useEffect(() => {
    const unsubscribe = socketService.subscribeToConnection((connected) => {
      setSocketConnected(connected);
    });

    return () => {
      unsubscribe();
    };
  }, []);

  const login = async (username: string, password: string) => {
    try {
      const user = await authService.login(username, password);
      setUser(user);
      setIsLoggedIn(true);
    } catch (error) {
      console.error('Login failed:', error);
      throw error;
    }
  };

  const logout = () => {
    authService.logout();
    setUser(null);
    setIsLoggedIn(false);
  };

  return (
    <AppContext.Provider
      value={{
        isLoggedIn,
        user,
        setUser,
        login,
        logout,
        socketConnected,
      }}
    >
      {children}
    </AppContext.Provider>
  );
};

export const useApp = () => {
  const context = useContext(AppContext);
  if (context === undefined) {
    throw new Error('useApp must be used within an AppProvider');
  }
  return context;
}; 