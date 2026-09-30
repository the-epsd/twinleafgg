import { useCallback, useEffect, useMemo, useState } from 'react';
import { Link, useNavigate, useParams } from 'react-router-dom';
import { Canvas } from '@react-three/fiber';
import type { Archetype } from 'ptcg-server';
import { ApiError } from '../../api/apiError';
import { getDeck, saveDeck } from '../../api/deckApi';
import { listCoins, type PlayerCoinItem } from '../../api/coinApi';
import { listDeckBoxes, type PlayerDeckBoxItem } from '../../api/deckBoxApi';
import { listSleeves, type PlayerSleeveItem } from '../../api/sleeveApi';
import { ShellButton } from '../../components/ui/ShellButton';
import { TwinleafCtaButton } from '../../components/ui/TwinleafCtaButton';
import { useAuth } from '../../context/AuthContext';
import { useSnackbar } from '../../context/SnackbarContext';
import { resolveAssetUrl } from '../../utils/assetUrl';
import { publicAssetUrl } from '../../utils/publicAssetUrl';
import {
  CustomizePreviewScene,
  type FocusTarget,
  type PreviewMode,
  type TransformMode,
} from './CustomizePreviewScene';
import {
  DEFAULT_CUSTOMIZE_PREVIEW_LAYOUT,
  layoutToClipboardJson,
  parseLayoutJson,
  type CustomizePreviewLayout,
  type LayoutPropId,
  type PropTransform,
} from './customizePreviewLayout';
import { renderDeckBoxThumbnail } from './renderDeckBoxThumbnail';
import styles from './DeckCustomizePage.module.css';

type CustomizeTab = FocusTarget;
type SortMode = 'default' | 'name_asc' | 'name_desc';

type SortableItem = { name: string; sortOrder: number };

function templateUrl(template: string | undefined, imagePath: string, fallback: string): string {
  const t = template && template.includes('{path}') ? template : fallback;
  return resolveAssetUrl(t.replace('{path}', imagePath));
}

function cycleIndex(length: number, current: number, delta: number): number {
  if (length <= 0) return 0;
  return (current + delta + length) % length;
}

function sortItems<T extends SortableItem>(items: T[], mode: SortMode): T[] {
  const copy = [...items];
  if (mode === 'name_asc') {
    copy.sort((a, b) => a.name.localeCompare(b.name));
  } else if (mode === 'name_desc') {
    copy.sort((a, b) => b.name.localeCompare(a.name));
  } else {
    copy.sort((a, b) => a.sortOrder - b.sortOrder || a.name.localeCompare(b.name));
  }
  return copy;
}

function IconDeckBox({ className }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" aria-hidden="true">
      <path
        fill="currentColor"
        d="M4 7.5 12 4l8 3.5v9L12 20l-8-3.5v-9Zm2 .9v6.7l6 2.6V11L6 8.4Zm8 9.3 6-2.6V8.4L14 11v6.7Z"
      />
    </svg>
  );
}

function IconSleeve({ className }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" aria-hidden="true">
      <path
        fill="currentColor"
        d="M8 3h9a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2H8a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2Zm0 2v14h9V5H8Zm-3 2h1v12H5a2 2 0 0 1-2-2V9a2 2 0 0 1 2-2Z"
      />
    </svg>
  );
}

function IconCoin({ className }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" aria-hidden="true">
      <path
        fill="currentColor"
        d="M12 2a10 10 0 1 1 0 20 10 10 0 0 1 0-20Zm0 2a8 8 0 1 0 0 16 8 8 0 0 0 0-16Zm0 2.5a5.5 5.5 0 1 1 0 11 5.5 5.5 0 0 1 0-11Z"
      />
    </svg>
  );
}

export function DeckCustomizePage() {
  const { deckId: deckIdParam } = useParams();
  const deckId = Number(deckIdParam);
  const navigate = useNavigate();
  const { showSnackbar } = useSnackbar();
  const { serverConfig } = useAuth();

  const [tab, setTab] = useState<CustomizeTab>('deck_boxes');
  const [previewMode, setPreviewMode] = useState<PreviewMode>('all');
  const [sortMode, setSortMode] = useState<SortMode>('default');
  const [editLayout, setEditLayout] = useState(false);
  const [layoutEditorCollapsed, setLayoutEditorCollapsed] = useState(false);
  const [layout, setLayout] = useState<CustomizePreviewLayout>(DEFAULT_CUSTOMIZE_PREVIEW_LAYOUT);
  const [selectedProp, setSelectedProp] = useState<LayoutPropId>('box');
  const [transformMode, setTransformMode] = useState<TransformMode>('translate');
  const [orbitEnabled, setOrbitEnabled] = useState(true);
  const [pasteDraft, setPasteDraft] = useState('');
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [deckName, setDeckName] = useState('');
  const [cards, setCards] = useState<string[]>([]);
  const [manualArchetype1, setManualArchetype1] = useState<Archetype | undefined>();
  const [manualArchetype2, setManualArchetype2] = useState<Archetype | undefined>();
  const [artworks, setArtworks] = useState<{ code: string; artworkId?: number }[] | undefined>();
  const [sleeveIdentifier, setSleeveIdentifier] = useState<string | undefined>();
  const [deckBoxIdentifier, setDeckBoxIdentifier] = useState<string | undefined>();
  const [coinIdentifier, setCoinIdentifier] = useState<string | undefined>();
  const [sleeves, setSleeves] = useState<PlayerSleeveItem[]>([]);
  const [deckBoxes, setDeckBoxes] = useState<PlayerDeckBoxItem[]>([]);
  const [coins, setCoins] = useState<PlayerCoinItem[]>([]);
  const [boxThumbs, setBoxThumbs] = useState<Record<string, string>>({});

  const sleevesUrl =
    (serverConfig as { sleevesUrl?: string } | null)?.sleevesUrl ?? '/sleeves/{path}';
  const deckBoxesUrl =
    (serverConfig as { deckBoxesUrl?: string } | null)?.deckBoxesUrl ?? '/deck-boxes/{path}';
  const coinsUrl = (serverConfig as { coinsUrl?: string } | null)?.coinsUrl ?? '/coins/{path}';

  const load = useCallback(async () => {
    if (!Number.isFinite(deckId)) {
      setError('Invalid deck');
      setLoading(false);
      return;
    }
    setLoading(true);
    setError(null);
    try {
      const [deckRes, sleeveRes, boxRes, coinRes] = await Promise.all([
        getDeck(deckId),
        listSleeves(),
        listDeckBoxes(),
        listCoins(),
      ]);
      const d = deckRes.deck;
      setDeckName(d.name);
      setCards(d.cards ?? []);
      setManualArchetype1((d.manualArchetype1 as Archetype | undefined) || undefined);
      setManualArchetype2((d.manualArchetype2 as Archetype | undefined) || undefined);
      setArtworks(d.artworks);
      setSleeveIdentifier(d.sleeveIdentifier);
      setDeckBoxIdentifier(d.deckBoxIdentifier);
      setCoinIdentifier(d.coinIdentifier);
      setSleeves(sleeveRes.sleeves);
      setDeckBoxes(boxRes.deckBoxes);
      setCoins(coinRes.coins);

      if (!d.deckBoxIdentifier) {
        const def = boxRes.deckBoxes.find((b) => b.isDefault) ?? boxRes.deckBoxes[0];
        if (def) setDeckBoxIdentifier(def.identifier);
      }
      if (!d.coinIdentifier) {
        const def = coinRes.coins.find((c) => c.isDefault) ?? coinRes.coins[0];
        if (def) setCoinIdentifier(def.identifier);
      }
    } catch (e) {
      setError(e instanceof ApiError ? e.message : 'Failed to load deck customization');
    } finally {
      setLoading(false);
    }
  }, [deckId]);

  useEffect(() => {
    void load();
  }, [load]);

  const sortedBoxes = useMemo(() => sortItems(deckBoxes, sortMode), [deckBoxes, sortMode]);
  const sortedSleeves = useMemo(() => sortItems(sleeves, sortMode), [sleeves, sortMode]);
  const sortedCoins = useMemo(() => sortItems(coins, sortMode), [coins, sortMode]);

  const selectedBox = useMemo(
    () => deckBoxes.find((b) => b.identifier === deckBoxIdentifier) ?? deckBoxes[0],
    [deckBoxes, deckBoxIdentifier],
  );

  const selectedSleeve = useMemo(
    () => sleeves.find((s) => s.identifier === sleeveIdentifier),
    [sleeves, sleeveIdentifier],
  );

  const selectedCoin = useMemo(
    () => coins.find((c) => c.identifier === coinIdentifier) ?? coins.find((c) => c.isDefault) ?? coins[0],
    [coins, coinIdentifier],
  );

  const boxTextureUrl = selectedBox
    ? templateUrl(deckBoxesUrl, selectedBox.imagePath, '/deck-boxes/{path}')
    : '';

  const sleevePreviewUrl = selectedSleeve
    ? templateUrl(sleevesUrl, selectedSleeve.imagePath, '/sleeves/{path}')
    : publicAssetUrl('assets/cardback.png');

  const coinPreviewUrl = selectedCoin
    ? templateUrl(coinsUrl, selectedCoin.imagePath, '/coins/{path}')
    : '';

  useEffect(() => {
    if (deckBoxes.length === 0) return;
    let cancelled = false;

    void (async () => {
      const next: Record<string, string> = {};
      for (const box of deckBoxes) {
        const url = templateUrl(deckBoxesUrl, box.imagePath, '/deck-boxes/{path}');
        try {
          const dataUrl = await renderDeckBoxThumbnail(url);
          if (cancelled) return;
          next[box.identifier] = dataUrl;
          setBoxThumbs((prev) => ({ ...prev, [box.identifier]: dataUrl }));
        } catch {
          // Fall back to raw atlas via boxThumbs miss.
        }
      }
      if (!cancelled) setBoxThumbs((prev) => ({ ...prev, ...next }));
    })();

    return () => {
      cancelled = true;
    };
  }, [deckBoxes, deckBoxesUrl]);

  const cycleActive = useCallback(
    (delta: number) => {
      if (tab === 'deck_boxes') {
        if (sortedBoxes.length === 0) return;
        const currentId = deckBoxIdentifier ?? selectedBox?.identifier;
        const idx = Math.max(
          0,
          sortedBoxes.findIndex((b) => b.identifier === currentId),
        );
        const next = sortedBoxes[cycleIndex(sortedBoxes.length, idx, delta)];
        if (next) setDeckBoxIdentifier(next.identifier);
        return;
      }
      if (tab === 'sleeves') {
        const ids: (string | undefined)[] = [undefined, ...sortedSleeves.map((s) => s.identifier)];
        const idx = Math.max(0, ids.findIndex((id) => id === sleeveIdentifier));
        setSleeveIdentifier(ids[cycleIndex(ids.length, idx, delta)]);
        return;
      }
      if (sortedCoins.length === 0) return;
      const currentId = coinIdentifier ?? selectedCoin?.identifier;
      const idx = Math.max(
        0,
        sortedCoins.findIndex((c) => c.identifier === currentId),
      );
      const next = sortedCoins[cycleIndex(sortedCoins.length, idx, delta)];
      if (next) setCoinIdentifier(next.identifier);
    },
    [
      tab,
      sortedBoxes,
      deckBoxIdentifier,
      selectedBox,
      sortedSleeves,
      sleeveIdentifier,
      sortedCoins,
      coinIdentifier,
      selectedCoin,
    ],
  );

  const onPropTransform = useCallback((id: LayoutPropId, next: PropTransform) => {
    setLayout((prev) => ({ ...prev, [id]: next }));
  }, []);

  const onCameraChange = useCallback((camera: CustomizePreviewLayout['camera']) => {
    setLayout((prev) => ({ ...prev, camera }));
  }, []);

  const copyLayout = useCallback(async () => {
    const json = layoutToClipboardJson(layout);
    try {
      await navigator.clipboard.writeText(json);
      showSnackbar('Layout JSON copied — paste it in chat to apply');
    } catch {
      setPasteDraft(json);
      showSnackbar('Could not access clipboard — JSON shown in editor panel', { variant: 'error' });
    }
  }, [layout, showSnackbar]);

  const applyPastedLayout = useCallback(() => {
    const parsed = parseLayoutJson(pasteDraft);
    if (!parsed) {
      showSnackbar('Invalid layout JSON', { variant: 'error' });
      return;
    }
    setLayout(parsed);
    showSnackbar('Layout applied from JSON');
  }, [pasteDraft, showSnackbar]);

  const resetLayout = useCallback(() => {
    setLayout(DEFAULT_CUSTOMIZE_PREVIEW_LAYOUT);
    showSnackbar('Layout reset to defaults');
  }, [showSnackbar]);

  useEffect(() => {
    if (!editLayout) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.target instanceof HTMLTextAreaElement || e.target instanceof HTMLInputElement) return;
      if (e.key === 'w' || e.key === 'W') setTransformMode('translate');
      if (e.key === 'e' || e.key === 'E') setTransformMode('rotate');
      if (e.key === 'r' || e.key === 'R') setTransformMode('scale');
      if (e.key === '1') setSelectedProp('box');
      if (e.key === '2') setSelectedProp('sleeve');
      if (e.key === '3') setSelectedProp('coin');
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [editLayout]);

  async function onSave() {
    setSaving(true);
    try {
      await saveDeck(
        deckId,
        deckName.trim(),
        cards,
        manualArchetype1,
        manualArchetype2,
        artworks,
        sleeveIdentifier,
        deckBoxIdentifier,
        coinIdentifier,
      );
      showSnackbar('Customization saved');
      navigate(`/deck/${deckId}`);
    } catch (e) {
      showSnackbar(e instanceof ApiError ? e.message : 'Save failed', { variant: 'error' });
    } finally {
      setSaving(false);
    }
  }

  if (loading) {
    return (
      <div className={styles.page}>
        <p className={styles.muted}>Loading customization…</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className={styles.page}>
        <p className={styles.error}>{error}</p>
        <ShellButton variant="secondary" onClick={() => navigate(`/deck/${deckId}`)}>
          Back to editor
        </ShellButton>
      </div>
    );
  }

  return (
    <div className={styles.page}>
      <div className={styles.previewPane}>
        <Link to={`/deck/${deckId}`} className={styles.backBtn} aria-label="Back to deck editor">
          ‹
        </Link>

        <div className={styles.modeToggle} role="group" aria-label="Preview mode">
          <button
            type="button"
            className={`${styles.modeBtn}${previewMode === 'all' ? ` ${styles.modeBtnActive}` : ''}`}
            onClick={() => setPreviewMode('all')}
            aria-pressed={previewMode === 'all'}
            disabled={editLayout}
          >
            Preview All
          </button>
          <button
            type="button"
            className={`${styles.modeBtn}${previewMode === 'focused' ? ` ${styles.modeBtnActive}` : ''}`}
            onClick={() => setPreviewMode('focused')}
            aria-pressed={previewMode === 'focused'}
            disabled={editLayout}
          >
            Focused
          </button>
        </div>

        <button
          type="button"
          className={`${styles.editLayoutBtn}${editLayout ? ` ${styles.editLayoutBtnActive}` : ''}`}
          onClick={() => {
            setEditLayout((v) => {
              const next = !v;
              if (next) {
                setPreviewMode('all');
                setOrbitEnabled(true);
                setLayoutEditorCollapsed(false);
              }
              return next;
            });
          }}
          aria-pressed={editLayout}
        >
          {editLayout ? 'Done editing' : 'Edit layout'}
        </button>

        <div className={styles.previewStage}>
          {!editLayout ? (
            <>
              <button
                type="button"
                className={`${styles.cycleBtn} ${styles.cycleBtnLeft}`}
                onClick={() => cycleActive(-1)}
                aria-label="Previous item"
              >
                ‹
              </button>
              <button
                type="button"
                className={`${styles.cycleBtn} ${styles.cycleBtnRight}`}
                onClick={() => cycleActive(1)}
                aria-label="Next item"
              >
                ›
              </button>
            </>
          ) : null}

          {editLayout ? (
            layoutEditorCollapsed ? (
              <button
                type="button"
                className={styles.layoutEditorShow}
                onClick={() => setLayoutEditorCollapsed(false)}
              >
                Show layout controls
              </button>
            ) : (
              <div className={styles.layoutEditor}>
                <div className={styles.layoutEditorTop}>
                  <span className={styles.layoutEditorTitle}>Layout</span>
                  <button
                    type="button"
                    className={styles.layoutEditorHide}
                    onClick={() => setLayoutEditorCollapsed(true)}
                  >
                    Hide
                  </button>
                </div>
                <div className={styles.layoutEditorRow}>
                  <span className={styles.layoutEditorLabel}>Select</span>
                  {(['box', 'sleeve', 'coin'] as LayoutPropId[]).map((id) => (
                    <button
                      key={id}
                      type="button"
                      className={`${styles.layoutChip}${selectedProp === id ? ` ${styles.layoutChipActive}` : ''}`}
                      onClick={() => setSelectedProp(id)}
                    >
                      {id}
                    </button>
                  ))}
                </div>
                <div className={styles.layoutEditorRow}>
                  <span className={styles.layoutEditorLabel}>Gizmo</span>
                  {(
                    [
                      ['translate', 'Move'],
                      ['rotate', 'Rotate'],
                      ['scale', 'Scale'],
                    ] as const
                  ).map(([mode, label]) => (
                    <button
                      key={mode}
                      type="button"
                      className={`${styles.layoutChip}${transformMode === mode ? ` ${styles.layoutChipActive}` : ''}`}
                      onClick={() => setTransformMode(mode)}
                    >
                      {label}
                    </button>
                  ))}
                </div>
                <p className={styles.layoutHint}>
                  Hide this panel to free the view. Keys: W/E/R gizmo, 1/2/3 select. Copy JSON and
                  paste in chat to lock in.
                </p>
                <div className={styles.layoutEditorActions}>
                  <ShellButton onClick={() => void copyLayout()}>Copy JSON</ShellButton>
                  <ShellButton variant="secondary" onClick={resetLayout}>
                    Reset
                  </ShellButton>
                </div>
                <pre className={styles.layoutLive}>{layoutToClipboardJson(layout)}</pre>
                <label className={styles.layoutEditorLabel} htmlFor="layout-paste">
                  Paste JSON to apply
                </label>
                <textarea
                  id="layout-paste"
                  className={styles.layoutPaste}
                  value={pasteDraft}
                  onChange={(e) => setPasteDraft(e.target.value)}
                  placeholder="Paste layout JSON here…"
                  spellCheck={false}
                  aria-label="Paste layout JSON"
                />
                <ShellButton variant="secondary" onClick={applyPastedLayout}>
                  Apply pasted JSON
                </ShellButton>
              </div>
            )
          ) : null}

          {boxTextureUrl || sleevePreviewUrl || coinPreviewUrl ? (
            <Canvas
              className={styles.canvas}
              camera={{
                position: layout.camera.position,
                fov: layout.camera.fov,
                near: 0.1,
                far: 100,
              }}
              gl={{ antialias: true, alpha: true }}
            >
              <color attach="background" args={['#0a1628']} />
              <CustomizePreviewScene
                mode={previewMode}
                focus={tab}
                boxTextureUrl={boxTextureUrl}
                sleeveTextureUrl={sleevePreviewUrl}
                coinTextureUrl={coinPreviewUrl}
                layout={layout}
                editLayout={editLayout}
                selectedProp={selectedProp}
                transformMode={transformMode}
                orbitEnabled={orbitEnabled}
                onOrbitEnabledChange={setOrbitEnabled}
                onSelectProp={setSelectedProp}
                onPropTransform={onPropTransform}
                onCameraChange={onCameraChange}
              />
            </Canvas>
          ) : (
            <p className={styles.muted}>No customization items available.</p>
          )}

          <div className={styles.currentlyShowing}>
            <h2 className={styles.currentlyLabel}>Currently showing</h2>
            <p>Card Sleeves: {selectedSleeve?.name ?? 'Default cardback'}</p>
            <p>Deck Box: {selectedBox?.name ?? 'None'}</p>
            <p>Coin: {selectedCoin?.name ?? 'Twinleaf'}</p>
          </div>
        </div>
      </div>

      <aside className={styles.sidebar}>
        <div className={styles.sidebarHeader}>
          <h2 className={styles.sidebarTitle}>Deck Customization</h2>
          <div className={styles.sortWrap}>
            <select
              className={styles.sortSelect}
              value={sortMode}
              onChange={(e) => setSortMode(e.target.value as SortMode)}
              aria-label="Sort order"
            >
              <option value="default">Sort Order</option>
              <option value="name_asc">Name A–Z</option>
              <option value="name_desc">Name Z–A</option>
            </select>
          </div>
        </div>

        <div className={styles.tabs} role="tablist">
          <button
            type="button"
            role="tab"
            aria-selected={tab === 'deck_boxes'}
            className={`${styles.tab}${tab === 'deck_boxes' ? ` ${styles.tabActive}` : ''}`}
            onClick={() => setTab('deck_boxes')}
          >
            <IconDeckBox className={styles.tabIcon} />
            Deck Boxes
          </button>
          <button
            type="button"
            role="tab"
            aria-selected={tab === 'sleeves'}
            className={`${styles.tab}${tab === 'sleeves' ? ` ${styles.tabActive}` : ''}`}
            onClick={() => setTab('sleeves')}
          >
            <IconSleeve className={styles.tabIcon} />
            Card Sleeves
          </button>
          <button
            type="button"
            role="tab"
            aria-selected={tab === 'coins'}
            className={`${styles.tab}${tab === 'coins' ? ` ${styles.tabActive}` : ''}`}
            onClick={() => setTab('coins')}
          >
            <IconCoin className={styles.tabIcon} />
            Coins
          </button>
        </div>

        {tab === 'deck_boxes' ? (
          <ul className={styles.grid}>
            {sortedBoxes.map((box) => {
              const active = box.identifier === (deckBoxIdentifier ?? selectedBox?.identifier);
              const atlas = templateUrl(deckBoxesUrl, box.imagePath, '/deck-boxes/{path}');
              const thumb = boxThumbs[box.identifier] ?? atlas;
              return (
                <li key={box.identifier}>
                  <button
                    type="button"
                    className={`${styles.gridItem}${active ? ` ${styles.gridItemActive}` : ''}`}
                    onClick={() => setDeckBoxIdentifier(box.identifier)}
                    aria-pressed={active}
                    aria-label={box.name}
                    title={box.name}
                  >
                    <img src={thumb} alt="" className={styles.gridThumb} />
                  </button>
                </li>
              );
            })}
          </ul>
        ) : tab === 'sleeves' ? (
          <ul className={styles.grid}>
            <li>
              <button
                type="button"
                className={`${styles.gridItem}${!sleeveIdentifier ? ` ${styles.gridItemActive}` : ''}`}
                onClick={() => setSleeveIdentifier(undefined)}
                aria-pressed={!sleeveIdentifier}
                aria-label="Default cardback"
                title="Default"
              >
                <img src={publicAssetUrl('assets/cardback.png')} alt="" className={styles.gridThumb} />
              </button>
            </li>
            {sortedSleeves.map((sleeve) => {
              const active = sleeve.identifier === sleeveIdentifier;
              const thumb = templateUrl(sleevesUrl, sleeve.imagePath, '/sleeves/{path}');
              return (
                <li key={sleeve.identifier}>
                  <button
                    type="button"
                    className={`${styles.gridItem}${active ? ` ${styles.gridItemActive}` : ''}`}
                    onClick={() => setSleeveIdentifier(sleeve.identifier)}
                    aria-pressed={active}
                    aria-label={sleeve.name}
                    title={sleeve.name}
                  >
                    <img src={thumb} alt="" className={styles.gridThumb} />
                  </button>
                </li>
              );
            })}
          </ul>
        ) : (
          <ul className={styles.grid}>
            {sortedCoins.map((coin) => {
              const active = coin.identifier === (coinIdentifier ?? selectedCoin?.identifier);
              const thumb = templateUrl(coinsUrl, coin.imagePath, '/coins/{path}');
              return (
                <li key={coin.identifier}>
                  <button
                    type="button"
                    className={`${styles.gridItem}${active ? ` ${styles.gridItemActive}` : ''}`}
                    onClick={() => setCoinIdentifier(coin.identifier)}
                    aria-pressed={active}
                    aria-label={coin.name}
                    title={coin.name}
                  >
                    <img src={thumb} alt="" className={styles.gridThumb} />
                  </button>
                </li>
              );
            })}
          </ul>
        )}

        <div className={styles.sidebarActions}>
          <TwinleafCtaButton fullWidth disabled={saving} onClick={() => void onSave()}>
            {saving ? 'Saving…' : 'Apply'}
          </TwinleafCtaButton>
          <TwinleafCtaButton fullWidth variant="muted" onClick={() => navigate(`/deck/${deckId}`)}>
            Cancel
          </TwinleafCtaButton>
        </div>
      </aside>
    </div>
  );
}
