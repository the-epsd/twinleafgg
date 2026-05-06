import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useRef,
  useState,
  type ReactNode,
} from 'react';
import type { CardsInfo, ServerConfig, UserInfo } from 'ptcg-server';
import { loginRequest, refreshTokenRequest, registerRequest } from '../api/authApi';
import { getCardsAll } from '../api/cardsApi';
import { setAuthInvalidHandler } from '../api/client';
import { getProfileMe } from '../api/profileApi';
import { clearAuthTokens, getStoredToken, setStoredApiUrlOverride, setStoredToken } from '../api/storage';
import { appConfig } from '../env/config';
import { getSocketManager } from '../socket/socketManager';
import { applyCardsInfoToGameEngine, clearGameEngineCards } from '../table/gameEngineCards';

interface AuthState {
  user: UserInfo | null;
  token: string | null;
  cardsInfo: CardsInfo | null;
  serverConfig: ServerConfig | null;
  ready: boolean;
  apiUrlInput: string;
}

interface AuthContextValue extends AuthState {
  isAuthenticated: boolean;
  login: (name: string, password: string) => Promise<void>;
  register: (name: string, password: string, email: string, serverPassword?: string) => Promise<void>;
  logout: () => void;
  setApiUrlOverride: (url: string | undefined) => void;
  refreshSession: () => Promise<void>;
}

const AuthContext = createContext<AuthContextValue | null>(null);

function isRefreshTokenUsable(token: string): boolean {
  const parts = token.split(',');
  if (parts.length !== 3) {
    return false;
  }

  const userId = Number(parts[0]);
  const expire = Number(parts[1]);
  if (!Number.isInteger(userId) || userId <= 0 || !Number.isInteger(expire)) {
    return false;
  }

  const nowSec = Math.floor(Date.now() / 1000);
  return expire > nowSec;
}

async function loadUserAndCards(): Promise<{ user: UserInfo; cardsInfo: CardsInfo }> {
  const [profile, cardsRes] = await Promise.all([getProfileMe(), getCardsAll()]);
  return { user: profile.user, cardsInfo: cardsRes.cardsInfo };
}

export function AuthProvider({ children }: { children: ReactNode }) {
  const [state, setState] = useState<AuthState>({
    user: null,
    token: null,
    cardsInfo: null,
    serverConfig: null,
    ready: false,
    apiUrlInput: '',
  });
  const refreshTimer = useRef<ReturnType<typeof setInterval> | null>(null);

  const logout = useCallback(() => {
    clearGameEngineCards();
    clearAuthTokens();
    getSocketManager().disable();
    setState((s) => ({
      ...s,
      user: null,
      token: null,
      cardsInfo: null,
      serverConfig: null,
    }));
    if (refreshTimer.current) {
      clearInterval(refreshTimer.current);
      refreshTimer.current = null;
    }
  }, []);

  useEffect(() => {
    setAuthInvalidHandler(() => {
      logout();
    });
    return () => setAuthInvalidHandler(null);
  }, [logout]);

  const applyToken = useCallback((token: string) => {
    setStoredToken(token);
    setState((s) => ({ ...s, token }));
    getSocketManager().setServerUrl(appConfig.apiUrl);
    getSocketManager().updateAuthToken(token);
  }, []);

  const refreshSession = useCallback(async () => {
    const t = getStoredToken();
    if (!t) {
      setState((s) => ({ ...s, ready: true }));
      return;
    }
    if (!isRefreshTokenUsable(t)) {
      clearGameEngineCards();
      clearAuthTokens();
      setState((s) => ({
        ...s,
        user: null,
        token: null,
        cardsInfo: null,
        serverConfig: null,
        ready: true,
      }));
      return;
    }
    try {
      const refreshed = await refreshTokenRequest();
      applyToken(refreshed.token);
      const { user, cardsInfo } = await loadUserAndCards();
      applyCardsInfoToGameEngine(cardsInfo);
      setState((s) => ({
        ...s,
        user,
        cardsInfo,
        serverConfig: refreshed.config ?? s.serverConfig,
        token: refreshed.token,
        ready: true,
      }));
    } catch {
      clearGameEngineCards();
      clearAuthTokens();
      setState({
        user: null,
        token: null,
        cardsInfo: null,
        serverConfig: null,
        ready: true,
        apiUrlInput: '',
      });
    }
  }, [applyToken]);

  useEffect(() => {
    void refreshSession();
  }, [refreshSession]);

  useEffect(() => {
    if (!state.token || !state.user) {
      return;
    }
    if (refreshTimer.current) {
      clearInterval(refreshTimer.current);
    }
    refreshTimer.current = setInterval(() => {
      void (async () => {
        try {
          const token = getStoredToken();
          if (!token || !isRefreshTokenUsable(token)) {
            logout();
            return;
          }
          const res = await refreshTokenRequest();
          applyToken(res.token);
          getSocketManager().updateAuthToken(res.token);
          setState((s) => ({ ...s, token: res.token, serverConfig: res.config ?? s.serverConfig }));
        } catch {
          logout();
        }
      })();
    }, appConfig.refreshTokenIntervalMs);
    return () => {
      if (refreshTimer.current) {
        clearInterval(refreshTimer.current);
        refreshTimer.current = null;
      }
    };
  }, [state.token, state.user, applyToken, logout]);

  const login = useCallback(
    async (name: string, password: string) => {
      const res = await loginRequest(name, password);
      applyToken(res.token);
      const { user, cardsInfo } = await loadUserAndCards();
      applyCardsInfoToGameEngine(cardsInfo);
      setState((s) => ({
        ...s,
        user,
        cardsInfo,
        serverConfig: res.config ?? null,
        token: res.token,
        ready: true,
      }));
    },
    [applyToken]
  );

  const register = useCallback(
    async (name: string, password: string, email: string, serverPassword?: string) => {
      await registerRequest(name, password, email, serverPassword);
    },
    []
  );

  const setApiUrlOverride = useCallback((url: string | undefined) => {
    setStoredApiUrlOverride(url);
    getSocketManager().setServerUrl(appConfig.apiUrl);
 setState((s) => ({ ...s, apiUrlInput: url ?? '' }));
  }, []);

  const value = useMemo<AuthContextValue>(
    () => ({
      ...state,
      isAuthenticated: !!state.token && !!state.user,
      login,
      register,
      logout,
      setApiUrlOverride,
      refreshSession,
    }),
    [state, login, register, logout, setApiUrlOverride, refreshSession]
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth(): AuthContextValue {
  const ctx = useContext(AuthContext);
  if (!ctx) {
    throw new Error('useAuth must be used within AuthProvider');
  }
  return ctx;
}
