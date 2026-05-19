import { useCallback, useState } from 'react';
import type { Board3dLightingSettings } from './board3dLightingConfig';
import {
  BOARD3D_LIGHTING_DEFAULTS,
  BOARD3D_TONE_MAPPING_OPTIONS,
  cloneBoard3dLightingDefaults,
  type Board3dToneMappingKey,
} from './board3dLightingConfig';
import styles from './Board3DCanvas.module.css';

type Board3dLightingPanelProps = {
  settings: Board3dLightingSettings;
  onChange: (next: Board3dLightingSettings) => void;
};

function num(
  value: string,
  fallback: number
): number {
  const n = Number.parseFloat(value);
  return Number.isFinite(n) ? n : fallback;
}

export function Board3dLightingPanel({ settings, onChange }: Board3dLightingPanelProps) {
  const [open, setOpen] = useState(true);
  const [copyHint, setCopyHint] = useState<string | null>(null);

  const set = useCallback(
    (partial: Partial<Board3dLightingSettings>) => {
      onChange({ ...settings, ...partial });
    },
    [onChange, settings]
  );

  const copyJson = useCallback(async () => {
    const payload = {
      note: 'Paste this JSON in chat to update board lighting defaults.',
      defaultsReference: BOARD3D_LIGHTING_DEFAULTS,
      current: settings,
      changedFromDefaults: diffLighting(settings, BOARD3D_LIGHTING_DEFAULTS),
    };
    const text = JSON.stringify(payload, null, 2);
    try {
      await navigator.clipboard.writeText(text);
      setCopyHint('Copied to clipboard');
      window.setTimeout(() => setCopyHint(null), 2000);
    } catch {
      setCopyHint('Copy failed — check permissions');
      window.setTimeout(() => setCopyHint(null), 3000);
    }
  }, [settings]);

  return (
    <div className={styles.lightingPanel}>
      <button type="button" className={styles.lightingPanelToggle} onClick={() => setOpen((o) => !o)}>
        Lighting {open ? '▼' : '▶'}
      </button>
      {open ? (
        <div className={styles.lightingPanelBody}>
          <section className={styles.lightingSection}>
            <div className={styles.lightingSectionTitle}>Ambient</div>
            <label className={styles.lightingRow}>
              Color
              <input
                type="color"
                value={normalizeHexColorInput(settings.ambient.color)}
                onChange={(e) =>
                  set({ ambient: { ...settings.ambient, color: e.target.value } })
                }
              />
            </label>
            <label className={styles.lightingRow}>
              Intensity
              <input
                type="range"
                min={0}
                max={3}
                step={0.01}
                value={settings.ambient.intensity}
                onChange={(e) =>
                  set({ ambient: { ...settings.ambient, intensity: num(e.target.value, 0) } })
                }
              />
              <span className={styles.lightingValue}>{settings.ambient.intensity.toFixed(2)}</span>
            </label>
          </section>

          <section className={styles.lightingSection}>
            <div className={styles.lightingSectionTitle}>Directional</div>
            <label className={styles.lightingRow}>
              Color
              <input
                type="color"
                value={normalizeHexColorInput(settings.directional.color)}
                onChange={(e) =>
                  set({ directional: { ...settings.directional, color: e.target.value } })
                }
              />
            </label>
            <label className={styles.lightingRow}>
              Intensity
              <input
                type="range"
                min={0}
                max={4}
                step={0.01}
                value={settings.directional.intensity}
                onChange={(e) =>
                  set({
                    directional: { ...settings.directional, intensity: num(e.target.value, 0) },
                  })
                }
              />
              <span className={styles.lightingValue}>{settings.directional.intensity.toFixed(2)}</span>
            </label>
            {(['X', 'Y', 'Z'] as const).map((axis, i) => (
              <label key={axis} className={styles.lightingRow}>
                Position {axis}
                <input
                  type="range"
                  min={-60}
                  max={60}
                  step={0.5}
                  value={settings.directional.position[i]}
                  onChange={(e) => {
                    const pos: [number, number, number] = [...settings.directional.position];
                    pos[i] = num(e.target.value, 0);
                    set({ directional: { ...settings.directional, position: pos } });
                  }}
                />
                <span className={styles.lightingValue}>
                  {settings.directional.position[i].toFixed(1)}
                </span>
              </label>
            ))}
            <label className={`${styles.lightingRow} ${styles.lightingCheck}`}>
              <input
                type="checkbox"
                checked={settings.directional.castShadow}
                onChange={(e) =>
                  set({ directional: { ...settings.directional, castShadow: e.target.checked } })
                }
              />
              Cast shadow
            </label>
          </section>

          <section className={styles.lightingSection}>
            <div className={styles.lightingSectionTitle}>Shadow (directional)</div>
            <label className={styles.lightingRow}>
              Map size
              <input
                type="range"
                min={64}
                max={4096}
                step={64}
                value={settings.directional.shadowMapSize}
                onChange={(e) =>
                  set({
                    directional: {
                      ...settings.directional,
                      shadowMapSize: Math.round(num(e.target.value, 128)),
                    },
                  })
                }
              />
              <span className={styles.lightingValue}>{settings.directional.shadowMapSize}</span>
            </label>
            <label className={styles.lightingRow}>
              Bias
              <input
                type="range"
                min={-0.01}
                max={0.01}
                step={0.0001}
                value={settings.directional.shadowBias}
                onChange={(e) =>
                  set({
                    directional: { ...settings.directional, shadowBias: num(e.target.value, 0) },
                  })
                }
              />
              <span className={styles.lightingValue}>{settings.directional.shadowBias.toFixed(4)}</span>
            </label>
            {(
              [
                ['Left', 'left'],
                ['Right', 'right'],
                ['Top', 'top'],
                ['Bottom', 'bottom'],
                ['Near', 'near'],
                ['Far', 'far'],
              ] as const
            ).map(([label, key]) => (
              <label key={key} className={styles.lightingRow}>
                Cam {label}
                <input
                  type="range"
                  min={key === 'near' || key === 'far' ? 0.1 : -80}
                  max={key === 'near' ? 50 : key === 'far' ? 200 : 80}
                  step={key === 'near' || key === 'far' ? 0.1 : 1}
                  value={settings.directional.shadowCamera[key]}
                  onChange={(e) =>
                    set({
                      directional: {
                        ...settings.directional,
                        shadowCamera: {
                          ...settings.directional.shadowCamera,
                          [key]: num(e.target.value, 0),
                        },
                      },
                    })
                  }
                />
                <span className={styles.lightingValue}>
                  {settings.directional.shadowCamera[key].toFixed(1)}
                </span>
              </label>
            ))}
          </section>

          <section className={styles.lightingSection}>
            <div className={styles.lightingSectionTitle}>Renderer</div>
            <label className={styles.lightingRow}>
              Tone mapping
              <select
                className={styles.lightingSelect}
                value={settings.renderer.toneMapping}
                onChange={(e) =>
                  set({
                    renderer: {
                      ...settings.renderer,
                      toneMapping: e.target.value as Board3dToneMappingKey,
                    },
                  })
                }
              >
                {BOARD3D_TONE_MAPPING_OPTIONS.map((o) => (
                  <option key={o.key} value={o.key}>
                    {o.label}
                  </option>
                ))}
              </select>
            </label>
            <label className={styles.lightingRow}>
              Exposure
              <input
                type="range"
                min={0}
                max={3}
                step={0.01}
                value={settings.renderer.toneMappingExposure}
                onChange={(e) =>
                  set({
                    renderer: {
                      ...settings.renderer,
                      toneMappingExposure: num(e.target.value, 1),
                    },
                  })
                }
              />
              <span className={styles.lightingValue}>
                {settings.renderer.toneMappingExposure.toFixed(2)}
              </span>
            </label>
          </section>

          <section className={styles.lightingSection}>
            <div className={styles.lightingSectionTitle}>Bloom (post)</div>
            <label className={styles.lightingRow}>
              Intensity
              <input
                type="range"
                min={0}
                max={2}
                step={0.01}
                value={settings.bloom.intensity}
                onChange={(e) =>
                  set({ bloom: { ...settings.bloom, intensity: num(e.target.value, 0) } })
                }
              />
              <span className={styles.lightingValue}>{settings.bloom.intensity.toFixed(2)}</span>
            </label>
            <label className={styles.lightingRow}>
              Luminance threshold
              <input
                type="range"
                min={0}
                max={2}
                step={0.01}
                value={settings.bloom.luminanceThreshold}
                onChange={(e) =>
                  set({
                    bloom: { ...settings.bloom, luminanceThreshold: num(e.target.value, 1) },
                  })
                }
              />
              <span className={styles.lightingValue}>
                {settings.bloom.luminanceThreshold.toFixed(2)}
              </span>
            </label>
          </section>

          <div className={styles.lightingActions}>
            <button type="button" className={styles.lightingButton} onClick={copyJson}>
              Copy settings (clipboard)
            </button>
            <button
              type="button"
              className={styles.lightingButtonSecondary}
              onClick={() => onChange(cloneBoard3dLightingDefaults())}
            >
              Reset defaults
            </button>
          </div>
          {copyHint ? <div className={styles.lightingHint}>{copyHint}</div> : null}
        </div>
      ) : null}
    </div>
  );
}

function normalizeHexColorInput(c: string): string {
  if (/^#[0-9a-fA-F]{6}$/.test(c)) return c;
  return '#ffffff';
}

function diffLighting(
  a: Board3dLightingSettings,
  b: Board3dLightingSettings
): Record<string, unknown> {
  const out: Record<string, unknown> = {};
  if (a.ambient.color !== b.ambient.color || a.ambient.intensity !== b.ambient.intensity) {
    out.ambient = a.ambient;
  }
  if (JSON.stringify(a.directional) !== JSON.stringify(b.directional)) {
    out.directional = a.directional;
  }
  if (
    a.renderer.toneMapping !== b.renderer.toneMapping ||
    a.renderer.toneMappingExposure !== b.renderer.toneMappingExposure
  ) {
    out.renderer = a.renderer;
  }
  if (a.bloom.intensity !== b.bloom.intensity || a.bloom.luminanceThreshold !== b.bloom.luminanceThreshold) {
    out.bloom = a.bloom;
  }
  return out;
}
