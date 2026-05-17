import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
  type ReactNode,
} from 'react';
import type { CardsInfo, ServerConfig, UserInfo } from 'ptcg-server';
import { guestLoginRequest } from '../api/authApi';
import { getCardsAll } from '../api/cardsApi';
import { setAuthInvalidHandler } from '../api/client';
import { clearAuthTokens, setStoredToken } from '../api/storage';
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
}

const AuthContext = createContext<AuthContextValue | null>(null);

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

  useEffect(() => {
    let cancelled = false;
    void (async () => {
      try {
        const session = await guestLoginRequest(getOrCreateGuestName());
        const cardsInfo = await loadCards();
        if (cancelled) {
          return;
        }
        applyToken(session.token);
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
        if (!cancelled) {
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
      }
    })();
    return () => {
      cancelled = true;
    };
  }, [applyToken]);

  const value = useMemo<AuthContextValue>(
    () => ({
      ...state,
      isAuthenticated: !!state.token && !!state.user,
      logout,
    }),
    [state, logout]
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
