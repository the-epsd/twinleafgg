const DEFAULT_BOARD_TILT = 8;
const DEFAULT_BOARD_PERSPECTIVE = 1250;
const DEFAULT_BOARD_SCALE_Y = 94;
const DEFAULT_BOARD_LIFT = 0;

export type ResolvedTheme = 'light' | 'dark';
export type ThemePreference = ResolvedTheme | 'system';

const THEME_STORAGE_KEY = 'twinleaf.theme';
const THEME_QUERY = '(prefers-color-scheme: dark)';

function isResolvedTheme(theme: string | null): theme is ResolvedTheme {
  return theme === 'light' || theme === 'dark';
}

function normalizeThemePreference(theme: string | null): ThemePreference {
  return theme === 'system' || isResolvedTheme(theme) ? theme : 'system';
}

function readStoredThemePreference(): ThemePreference {
  if (typeof window === 'undefined') {
    return 'system';
  }
  try {
    return normalizeThemePreference(window.localStorage.getItem(THEME_STORAGE_KEY));
  } catch {
    return 'system';
  }
}

function readSystemTheme(): ResolvedTheme {
  if (typeof window === 'undefined' || typeof window.matchMedia !== 'function') {
    return 'light';
  }
  return window.matchMedia(THEME_QUERY).matches ? 'dark' : 'light';
}

class ViewSettingsStore {
  followActive = $state(true);
  autoConfirmPrompts = $state(true);
  debugZones = $state(false);
  showLogs = $state(false);
  viewIndex = $state(0);
  boardTilt = $state(DEFAULT_BOARD_TILT);
  boardPerspective = $state(DEFAULT_BOARD_PERSPECTIVE);
  boardScaleY = $state(DEFAULT_BOARD_SCALE_Y);
  boardLift = $state(DEFAULT_BOARD_LIFT);
  _themePreference = $state<ThemePreference>(readStoredThemePreference());
  systemTheme = $state<ResolvedTheme>(readSystemTheme());

  get themePreference(): ThemePreference {
    return this._themePreference;
  }

  set themePreference(themePreference: ThemePreference) {
    this.setThemePreference(themePreference);
  }

  get theme(): ResolvedTheme {
    return this._themePreference === 'system' ? this.systemTheme : this._themePreference;
  }

  setThemePreference(themePreference: ThemePreference) {
    this._themePreference = themePreference;
    if (typeof window !== 'undefined') {
      try {
        window.localStorage.setItem(THEME_STORAGE_KEY, themePreference);
      } catch {
        // Theme selection still works for the current session when storage is unavailable.
      }
    }
  }

  setTheme(theme: ResolvedTheme) {
    this.setThemePreference(theme);
  }

  toggleTheme() {
    this.setTheme(this.theme === 'dark' ? 'light' : 'dark');
  }

  startThemeSync() {
    if (typeof window === 'undefined') {
      return () => {};
    }

    this.systemTheme = readSystemTheme();
    const media = typeof window.matchMedia === 'function' ? window.matchMedia(THEME_QUERY) : undefined;
    const handleMediaChange = () => {
      this.systemTheme = media?.matches ? 'dark' : 'light';
    };
    const handleStorage = (event: StorageEvent) => {
      if (event.key === THEME_STORAGE_KEY) {
        this._themePreference = normalizeThemePreference(event.newValue);
      }
    };

    media?.addEventListener('change', handleMediaChange);
    window.addEventListener('storage', handleStorage);

    return () => {
      media?.removeEventListener('change', handleMediaChange);
      window.removeEventListener('storage', handleStorage);
    };
  }

  resetPerspective() {
    this.boardTilt = DEFAULT_BOARD_TILT;
    this.boardPerspective = DEFAULT_BOARD_PERSPECTIVE;
    this.boardScaleY = DEFAULT_BOARD_SCALE_Y;
    this.boardLift = DEFAULT_BOARD_LIFT;
  }

  followPlayer(playerIndex: number) {
    this.viewIndex = playerIndex;
  }

  switchToPlayer(playerIndex: number) {
    this.followActive = false;
    this.viewIndex = playerIndex;
  }

  resetView() {
    this.followActive = true;
    this.viewIndex = 0;
  }
}

export const viewSettingsStore = new ViewSettingsStore();
