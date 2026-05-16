import { Format } from 'ptcg-server';

/** Stable localStorage keys for client settings. */
export const SETTINGS_KEYS = {
  holoEnabled: 'holoEnabled',
  showCardName: 'showCardName',
  showTags: 'showTags',
  cardSize: 'cardSize',
  hiddenFormats: 'hiddenFormats',
  use3dBoardDefault: 'use3dBoardDefault',
  cardTextKerning: 'cardTextKerning',
  sfxEnabled: 'sfxEnabled',
  sfxVolume: 'sfxVolume',
  board2dPerspectiveEnabled: 'board2dPerspectiveEnabled',
} as const;

export interface ClientSettingsSnapshot {
  holoEnabled: boolean;
  showCardName: boolean;
  showTags: boolean;
  cardSize: number;
  hiddenFormats: Format[];
  use3dBoardDefault: boolean;
  board2dPerspectiveEnabled: boolean;
  cardTextKerning: number;
  sfxEnabled: boolean;
  sfxVolume: number;
}

function loadHoloSetting(): boolean {
  const saved = localStorage.getItem(SETTINGS_KEYS.holoEnabled);
  return saved ? JSON.parse(saved) : true;
}

function loadCardNamesSetting(): boolean {
  const saved = localStorage.getItem(SETTINGS_KEYS.showCardName);
  return saved ? JSON.parse(saved) : false;
}

function loadTagsSetting(): boolean {
  const saved = localStorage.getItem(SETTINGS_KEYS.showTags);
  return saved ? JSON.parse(saved) : false;
}

function loadCardSize(): number {
  const saved = localStorage.getItem(SETTINGS_KEYS.cardSize);
  if (saved == null || saved === '') {
    return 100;
  }
  const n = parseInt(saved, 10);
  return Number.isFinite(n) ? n : 100;
}

/** Filter out STANDARD_MAJORS (deprecated); rewrite storage if we stripped any. */
export function loadHiddenFormats(): Format[] {
  const saved = localStorage.getItem(SETTINGS_KEYS.hiddenFormats);
  let formats: Format[] = saved ? JSON.parse(saved) : [];
  const filtered = formats.filter((f) => f !== Format.STANDARD_MAJORS);
  if (filtered.length !== formats.length) {
    formats = filtered;
    localStorage.setItem(SETTINGS_KEYS.hiddenFormats, JSON.stringify(formats));
  }
  return formats;
}

function loadUse3dBoardDefaultSetting(): boolean {
  const saved = localStorage.getItem(SETTINGS_KEYS.use3dBoardDefault);
  return saved ? JSON.parse(saved) : false;
}

function loadCardTextKerning(): number {
  const saved = localStorage.getItem(SETTINGS_KEYS.cardTextKerning);
  return saved ? parseFloat(saved) : 0;
}

function loadSfxSetting(): boolean {
  const saved = localStorage.getItem(SETTINGS_KEYS.sfxEnabled);
  return saved ? JSON.parse(saved) : true;
}

function loadSfxVolume(): number {
  const saved = localStorage.getItem(SETTINGS_KEYS.sfxVolume);
  return saved ? parseFloat(saved) : 0.7;
}

function loadBoard2dPerspectiveSetting(): boolean {
  const saved = localStorage.getItem(SETTINGS_KEYS.board2dPerspectiveEnabled);
  return saved ? JSON.parse(saved) : true;
}

export function readClientSettingsSnapshot(): ClientSettingsSnapshot {
  return {
    holoEnabled: loadHoloSetting(),
    showCardName: loadCardNamesSetting(),
    showTags: loadTagsSetting(),
    cardSize: loadCardSize(),
    hiddenFormats: loadHiddenFormats(),
    use3dBoardDefault: loadUse3dBoardDefaultSetting(),
    board2dPerspectiveEnabled: loadBoard2dPerspectiveSetting(),
    cardTextKerning: loadCardTextKerning(),
    sfxEnabled: loadSfxSetting(),
    sfxVolume: loadSfxVolume(),
  };
}

export function writeHoloEnabled(enabled: boolean): void {
  localStorage.setItem(SETTINGS_KEYS.holoEnabled, JSON.stringify(enabled));
}

export function writeShowCardName(enabled: boolean): void {
  localStorage.setItem(SETTINGS_KEYS.showCardName, JSON.stringify(enabled));
}

export function writeShowTags(enabled: boolean): void {
  localStorage.setItem(SETTINGS_KEYS.showTags, JSON.stringify(enabled));
}

export function writeCardSize(size: number): void {
  localStorage.setItem(SETTINGS_KEYS.cardSize, size.toString());
}

export function writeHiddenFormats(formats: Format[]): void {
  localStorage.setItem(SETTINGS_KEYS.hiddenFormats, JSON.stringify(formats));
}

export function writeUse3dBoardDefault(enabled: boolean, has3dBoardAccess: boolean): void {
  if (!has3dBoardAccess) {
    localStorage.removeItem(SETTINGS_KEYS.use3dBoardDefault);
    return;
  }
  localStorage.setItem(SETTINGS_KEYS.use3dBoardDefault, JSON.stringify(enabled));
}

export function writeBoard2dPerspectiveEnabled(enabled: boolean): void {
  localStorage.setItem(SETTINGS_KEYS.board2dPerspectiveEnabled, JSON.stringify(enabled));
}

export function writeCardTextKerning(value: number): void {
  localStorage.setItem(SETTINGS_KEYS.cardTextKerning, value.toString());
}

export function writeSfxEnabled(enabled: boolean): void {
  localStorage.setItem(SETTINGS_KEYS.sfxEnabled, JSON.stringify(enabled));
}

export function writeSfxVolume(volume: number): void {
  const clamped = Math.max(0, Math.min(1, volume));
  localStorage.setItem(SETTINGS_KEYS.sfxVolume, clamped.toString());
}
