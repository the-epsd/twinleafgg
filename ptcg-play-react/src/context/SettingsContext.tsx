import {
  createContext,
  useCallback,
  useContext,
  useMemo,
  useState,
  type ReactNode,
} from 'react';
import {
  readClientSettingsSnapshot,
  writeBoard2dPerspectiveEnabled,
  writeCardSize,
  writeCardTextKerning,
  writeHiddenFormats,
  writeHoloEnabled,
  writeShowCardName,
  writeShowTags,
  writeSfxEnabled,
  writeSfxVolume,
  writeUse3dBoardDefault,
  writeDebugMarkersEnabled,
  type ClientSettingsSnapshot,
} from '../settings/settingsStorage';

export type SettingsDraftCommit = Pick<
  ClientSettingsSnapshot,
  | 'holoEnabled'
  | 'showCardName'
  | 'showTags'
  | 'hiddenFormats'
  | 'use3dBoardDefault'
  | 'board2dPerspectiveEnabled'
  | 'sfxEnabled'
  | 'debugMarkersEnabled'
> & {
  /**0–100 UI percentage, stored0–1 */
  sfxVolumePercent: number;
  cardSize: number;
  cardTextKerning: number;
};

interface SettingsContextValue extends ClientSettingsSnapshot {
  setCardSize: (size: number) => void;
  setCardTextKerning: (value: number) => void;
  setSfxVolume: (volume01: number) => void;
  commitFromSave: (draft: SettingsDraftCommit) => void;
}

const SettingsContext = createContext<SettingsContextValue | null>(null);

export function SettingsProvider({ children }: { children: ReactNode }) {
  const [state, setState] = useState<ClientSettingsSnapshot>(() => readClientSettingsSnapshot());

  const setCardSize = useCallback((size: number) => {
    writeCardSize(size);
    setState((s) => ({ ...s, cardSize: size }));
  }, []);

  const setCardTextKerning = useCallback((value: number) => {
    writeCardTextKerning(value);
    setState((s) => ({ ...s, cardTextKerning: value }));
  }, []);

  const setSfxVolume = useCallback((volume01: number) => {
    writeSfxVolume(volume01);
    setState((s) => ({ ...s, sfxVolume: volume01 }));
  }, []);

  const commitFromSave = useCallback(
    (draft: SettingsDraftCommit) => {
      writeHoloEnabled(draft.holoEnabled);
      writeShowCardName(draft.showCardName);
      writeShowTags(draft.showTags);
      writeCardSize(draft.cardSize);
      writeHiddenFormats(draft.hiddenFormats);
      writeUse3dBoardDefault(draft.use3dBoardDefault);
      writeBoard2dPerspectiveEnabled(draft.board2dPerspectiveEnabled);
      writeCardTextKerning(draft.cardTextKerning);
      writeSfxEnabled(draft.sfxEnabled);
      writeSfxVolume(draft.sfxVolumePercent / 100);
      writeDebugMarkersEnabled(draft.debugMarkersEnabled);

      setState({
        holoEnabled: draft.holoEnabled,
        showCardName: draft.showCardName,
        showTags: draft.showTags,
        cardSize: draft.cardSize,
        hiddenFormats: draft.hiddenFormats,
        use3dBoardDefault: draft.use3dBoardDefault,
        board2dPerspectiveEnabled: draft.board2dPerspectiveEnabled,
        cardTextKerning: draft.cardTextKerning,
        sfxEnabled: draft.sfxEnabled,
        sfxVolume: Math.max(0, Math.min(1, draft.sfxVolumePercent / 100)),
        debugMarkersEnabled: draft.debugMarkersEnabled,
      });
    },
    [],
  );

  const value = useMemo<SettingsContextValue>(
    () => ({
      ...state,
      setCardSize,
      setCardTextKerning,
      setSfxVolume,
      commitFromSave,
    }),
    [state, setCardSize, setCardTextKerning, setSfxVolume, commitFromSave],
  );

  return <SettingsContext.Provider value={value}>{children}</SettingsContext.Provider>;
}

export function useSettings(): SettingsContextValue {
  const ctx = useContext(SettingsContext);
  if (!ctx) {
    throw new Error('useSettings must be used within SettingsProvider');
  }
  return ctx;
}

/** For components that work outside `SettingsProvider` (e.g. dev previews). */
export function useOptionalSettings(): SettingsContextValue | null {
  return useContext(SettingsContext);
}
