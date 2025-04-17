import { socketService } from './socket.service';
import { ApiError } from './api.error';
import { ApiErrorEnum } from './api.error.enum';

interface LoginResponse {
  ok: boolean;
  token: string;
  user: {
    id: number;
    name: string;
    roleId: number;
  };
  config: {
    apiVersion: number;
    defaultPageSize: number;
    scansUrl: string;
    avatarsUrl: string;
    avatarFileSize: number;
    avatarMinSize: number;
    avatarMaxSize: number;
    replayFileSize: number;
  };
}

export class AuthService {
  private static instance: AuthService;
  private token: string | null = null;
  private currentUser: LoginResponse['user'] | null = null;

  private constructor() {
    this.token = localStorage.getItem('authToken') || sessionStorage.getItem('authToken');
    if (this.token) {
      socketService.connect(this.token);
    }
  }

  public static getInstance(): AuthService {
    if (!AuthService.instance) {
      AuthService.instance = new AuthService();
    }
    return AuthService.instance;
  }

  public async login(username: string, password: string, rememberMe: boolean = false): Promise<LoginResponse['user']> {
    try {
      const response = await fetch(`${process.env.REACT_APP_API_URL}/v1/login`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Origin': window.location.origin
        },
        credentials: 'include',
        body: JSON.stringify({ name: username, password }),
      });

      if (!response.ok) {
        const error = await response.json();
        throw new ApiError(ApiErrorEnum.AUTH_ERROR, error.error || 'Login failed');
      }

      const data = await response.json();

      this.token = data.token;
      this.currentUser = data.user;

      if (rememberMe) {
        localStorage.setItem('authToken', data.token);
      } else {
        sessionStorage.setItem('authToken', data.token);
      }

      socketService.connect(data.token);
      return data.user;
    } catch (error) {
      if (error instanceof ApiError) {
        throw error;
      }
      throw new ApiError(ApiErrorEnum.API_ERROR, 'Login failed');
    }
  }

  public logout(): void {
    this.token = null;
    this.currentUser = null;
    localStorage.removeItem('authToken');
    sessionStorage.removeItem('authToken');
    socketService.disconnect();
  }

  public isAuthenticated(): boolean {
    return !!this.token;
  }

  public getToken(): string | null {
    return this.token;
  }

  public getUser(): LoginResponse['user'] | null {
    return this.currentUser;
  }
}

export const authService = AuthService.getInstance(); 