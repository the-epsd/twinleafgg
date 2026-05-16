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
import { guestLoginRequest, refreshTokenRequest } from '../api/authApi';
import { getCardsAll } from '../api/cardsApi';
import { setAuthInvalidHandler } from '../api/client';
import { clearAuthTokens, getStoredToken, setStoredToken } from '../api/storage';
import { appConfig } from '../env/config';
import { getSocketManager } from '../socket/socketManager';
import { applyCardsInfoToGameEngine, clearGameEngineCards } from '../table/gameEngineCards';

const GUEST_NAME_KEY = 'ptcg_guest_name';

interface AuthState {
  user: UserInfo | null;
  token: string | null;
  cardsInfo: CardsInfo | null;
  serverConfig: ServerConfig | null;
  ready: boolean;
}

interface AuthContextValue extends AuthState {
  isAuthenticated: boolean;
  logout: () => void;
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

function getOrCreateGuestName(): string {
  const existing = sessionStorage.getItem(GUEST_NAME_KEY);
  if (existing?.startsWith('Guest-')) {
    return existing;
  }
  const suffix =
    typeof crypto !== 'undefined' && 'randomUUID' in crypto
      ? crypto.randomUUID().replace(/-/g, '').slice(0, 12)
      : Math.random().toString(36).slice(2, 14);
  const name = `Guest-${suffix}`;
  sessionStorage.setItem(GUEST_NAME_KEY, name);
  return name;
}

async function loadCards(): Promise<CardsInfo> {
  const cardsRes = await getCardsAll();
  return cardsRes.cardsInfo;
}

export function AuthProvider({ children }: { children: ReactNode }) {
  const [state, setState] = useState<AuthState>({
    user: null,
    token: null,
    cardsInfo: null,
    serverConfig: null,
    ready: false,
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
    try {
      const session = t && isRefreshTokenUsable(t)
        ? await refreshTokenRequest()
        : await guestLoginRequest(getOrCreateGuestName());
      applyToken(session.token);
      const cardsInfo = await loadCards();
      applyCardsInfoToGameEngine(cardsInfo);
      setState((s) => ({
        ...s,
        user: session.user,
        cardsInfo,
        serverConfig: session.config ?? s.serverConfig,
        token: session.token,
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

  const value = useMemo<AuthContextValue>(
    () => ({
      ...state,
      isAuthenticated: !!state.token && !!state.user,
      logout,
      refreshSession,
    }),
    [state, logout, refreshSession]
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
