import { Format } from 'ptcg-server';

/** Match Angular `SettingsService` key strings exactly for cross-client compatibility. */
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
  /** React-only: show active game markers in the card info pane (debug). */
  debugMarkersEnabled: 'debugMarkersEnabled',
  /** @deprecated Replaced by resolution / shadows / textures tiers. Kept for migration. */
  board3dGraphicsQuality: 'board3dGraphicsQuality',
  /** React-only: 3D board resolution (DPR) tier. */
  board3dGraphicsResolution: 'board3dGraphicsResolution',
  /** React-only: 3D board shadow quality tier. */
  board3dGraphicsShadows: 'board3dGraphicsShadows',
  /** React-only: 3D board texture filtering tier. */
  board3dGraphicsTextures: 'board3dGraphicsTextures',
} as const;

/** Per-option 3D graphics quality tier (React-only). */
export type Board3dGraphicsTier = 'lowest' | 'low' | 'medium' | 'high' | 'highest';

export const BOARD3D_GRAPHICS_TIER_OPTIONS: {
  value: Board3dGraphicsTier;
  label: string;
}[] = [
  { value: 'lowest', label: 'Lowest' },
  { value: 'low', label: 'Low' },
  { value: 'medium', label: 'Medium' },
  { value: 'high', label: 'High' },
  { value: 'highest', label: 'Highest' },
];

const BOARD3D_GRAPHICS_TIER_SET = new Set<string>(
  BOARD3D_GRAPHICS_TIER_OPTIONS.map((o) => o.value),
);

/** @deprecated Use {@link Board3dGraphicsTier}. */
export type Board3dGraphicsQuality = Board3dGraphicsTier;

/** @deprecated Use {@link BOARD3D_GRAPHICS_TIER_OPTIONS}. */
export const BOARD3D_GRAPHICS_QUALITY_OPTIONS = BOARD3D_GRAPHICS_TIER_OPTIONS;

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
  debugMarkersEnabled: boolean;
  board3dGraphicsResolution: Board3dGraphicsTier;
  board3dGraphicsShadows: Board3dGraphicsTier;
  board3dGraphicsTextures: Board3dGraphicsTier;
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
  return saved ? JSON.parse(saved) : true;
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

function loadDebugMarkersEnabled(): boolean {
  const saved = localStorage.getItem(SETTINGS_KEYS.debugMarkersEnabled);
  return saved ? JSON.parse(saved) : false;
}

function parseGraphicsTier(raw: string | null): Board3dGraphicsTier | null {
  if (raw && BOARD3D_GRAPHICS_TIER_SET.has(raw)) {
    return raw as Board3dGraphicsTier;
  }
  return null;
}

/**
 * Legacy single-preset value, if present and valid.
 * Used only when the split keys have not been written yet.
 */
function loadLegacyGraphicsQuality(): Board3dGraphicsTier | null {
  return parseGraphicsTier(localStorage.getItem(SETTINGS_KEYS.board3dGraphicsQuality));
}

function loadGraphicsTier(key: string): Board3dGraphicsTier {
  const saved = parseGraphicsTier(localStorage.getItem(key));
  if (saved) {
    return saved;
  }
  const legacy = loadLegacyGraphicsQuality();
  if (legacy) {
    return legacy;
  }
  return 'high';
}

function migrateLegacyGraphicsQualityIfNeeded(): void {
  const hasAnyNew =
    localStorage.getItem(SETTINGS_KEYS.board3dGraphicsResolution) != null ||
    localStorage.getItem(SETTINGS_KEYS.board3dGraphicsShadows) != null ||
    localStorage.getItem(SETTINGS_KEYS.board3dGraphicsTextures) != null;
  if (hasAnyNew) {
    return;
  }
  const legacy = loadLegacyGraphicsQuality();
  if (!legacy) {
    return;
  }
  localStorage.setItem(SETTINGS_KEYS.board3dGraphicsResolution, legacy);
  localStorage.setItem(SETTINGS_KEYS.board3dGraphicsShadows, legacy);
  localStorage.setItem(SETTINGS_KEYS.board3dGraphicsTextures, legacy);
}

export function readClientSettingsSnapshot(): ClientSettingsSnapshot {
  migrateLegacyGraphicsQualityIfNeeded();
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
    debugMarkersEnabled: loadDebugMarkersEnabled(),
    board3dGraphicsResolution: loadGraphicsTier(SETTINGS_KEYS.board3dGraphicsResolution),
    board3dGraphicsShadows: loadGraphicsTier(SETTINGS_KEYS.board3dGraphicsShadows),
    board3dGraphicsTextures: loadGraphicsTier(SETTINGS_KEYS.board3dGraphicsTextures),
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

export function writeUse3dBoardDefault(enabled: boolean): void {
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

export function writeDebugMarkersEnabled(enabled: boolean): void {
  localStorage.setItem(SETTINGS_KEYS.debugMarkersEnabled, JSON.stringify(enabled));
}

export function writeBoard3dGraphicsResolution(tier: Board3dGraphicsTier): void {
  localStorage.setItem(SETTINGS_KEYS.board3dGraphicsResolution, tier);
}

export function writeBoard3dGraphicsShadows(tier: Board3dGraphicsTier): void {
  localStorage.setItem(SETTINGS_KEYS.board3dGraphicsShadows, tier);
}

export function writeBoard3dGraphicsTextures(tier: Board3dGraphicsTier): void {
  localStorage.setItem(SETTINGS_KEYS.board3dGraphicsTextures, tier);
}
