import { Suspense, useCallback, useEffect, useMemo, useState } from 'react';
import { Link, useNavigate, useParams } from 'react-router-dom';
import { Canvas } from '@react-three/fiber';
import { ContactShadows, Environment, OrbitControls } from '@react-three/drei';
import type { Archetype } from 'ptcg-server';
import { ApiError } from '../../api/apiError';
import { getDeck, saveDeck } from '../../api/deckApi';
import { listDeckBoxes, type PlayerDeckBoxItem } from '../../api/deckBoxApi';
import { listSleeves, type PlayerSleeveItem } from '../../api/sleeveApi';
import { ShellButton } from '../../components/ui/ShellButton';
import { useAuth } from '../../context/AuthContext';
import { useSnackbar } from '../../context/SnackbarContext';
import { DeckBoxModel } from '../deck-box-preview/DeckBoxModel';
import { resolveAssetUrl } from '../../utils/assetUrl';
import { publicAssetUrl } from '../../utils/publicAssetUrl';
import styles from './DeckCustomizePage.module.css';

type CustomizeTab = 'deck_boxes' | 'sleeves';

function templateUrl(template: string | undefined, imagePath: string, fallback: string): string {
  const t = template && template.includes('{path}') ? template : fallback;
  return resolveAssetUrl(t.replace('{path}', imagePath));
}

export function DeckCustomizePage() {
  const { deckId: deckIdParam } = useParams();
  const deckId = Number(deckIdParam);
  const navigate = useNavigate();
  const { showSnackbar } = useSnackbar();
  const { serverConfig } = useAuth();

  const [tab, setTab] = useState<CustomizeTab>('deck_boxes');
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
  const [sleeves, setSleeves] = useState<PlayerSleeveItem[]>([]);
  const [deckBoxes, setDeckBoxes] = useState<PlayerDeckBoxItem[]>([]);

  const sleevesUrl =
    (serverConfig as { sleevesUrl?: string } | null)?.sleevesUrl ?? '/sleeves/{path}';
  const deckBoxesUrl =
    (serverConfig as { deckBoxesUrl?: string } | null)?.deckBoxesUrl ?? '/deck-boxes/{path}';

  const load = useCallback(async () => {
    if (!Number.isFinite(deckId)) {
      setError('Invalid deck');
      setLoading(false);
      return;
    }
    setLoading(true);
    setError(null);
    try {
      const [deckRes, sleeveRes, boxRes] = await Promise.all([
        getDeck(deckId),
        listSleeves(),
        listDeckBoxes(),
      ]);
      const d = deckRes.deck;
      setDeckName(d.name);
      setCards(d.cards ?? []);
      setManualArchetype1((d.manualArchetype1 as Archetype | undefined) || undefined);
      setManualArchetype2((d.manualArchetype2 as Archetype | undefined) || undefined);
      setArtworks(d.artworks);
      setSleeveIdentifier(d.sleeveIdentifier);
      setDeckBoxIdentifier(d.deckBoxIdentifier);
      setSleeves(sleeveRes.sleeves);
      setDeckBoxes(boxRes.deckBoxes);

      if (!d.deckBoxIdentifier) {
        const def = boxRes.deckBoxes.find((b) => b.isDefault) ?? boxRes.deckBoxes[0];
        if (def) setDeckBoxIdentifier(def.identifier);
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

  const selectedBox = useMemo(
    () => deckBoxes.find((b) => b.identifier === deckBoxIdentifier) ?? deckBoxes[0],
    [deckBoxes, deckBoxIdentifier],
  );

  const selectedSleeve = useMemo(
    () => sleeves.find((s) => s.identifier === sleeveIdentifier),
    [sleeves, sleeveIdentifier],
  );

  const boxTextureUrl = selectedBox
    ? templateUrl(deckBoxesUrl, selectedBox.imagePath, '/deck-boxes/{path}')
    : '';

  const sleevePreviewUrl = selectedSleeve
    ? templateUrl(sleevesUrl, selectedSleeve.imagePath, '/sleeves/{path}')
    : publicAssetUrl('assets/cardback.png');

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
        <div className={styles.previewHeader}>
          <ShellButtonLinkBack deckId={deckId} />
          <h1 className={styles.deckTitle}>{deckName || 'Deck'}</h1>
        </div>

        <div className={styles.previewStage}>
          {tab === 'deck_boxes' ? (
            boxTextureUrl ? (
              <Canvas
                className={styles.canvas}
                camera={{ position: [-6.5, 3.5, 5], fov: 35, near: 0.1, far: 100 }}
                gl={{ antialias: true }}
              >
                <color attach="background" args={['#14161c']} />
                <ambientLight intensity={0.55} />
                <directionalLight position={[6, 10, 4]} intensity={1.15} />
                <directionalLight position={[-4, 3, -6]} intensity={0.35} />
                <Suspense fallback={null}>
                  <DeckBoxModel key={boxTextureUrl} textureUrl={boxTextureUrl} scale={1} />
                  <ContactShadows position={[0, -2.02, 0]} opacity={0.4} scale={12} blur={2.5} far={6} />
                  <Environment preset="city" />
                </Suspense>
                <OrbitControls makeDefault enableDamping dampingFactor={0.08} minDistance={3} maxDistance={18} />
              </Canvas>
            ) : (
              <p className={styles.muted}>No deck boxes available.</p>
            )
          ) : (
            <div className={styles.sleevePreviewWrap}>
              <img className={styles.sleevePreview} src={sleevePreviewUrl} alt="" />
            </div>
          )}
        </div>

        <div className={styles.currentlyShowing}>
          <h2 className={styles.currentlyLabel}>Currently showing</h2>
          <p>
            Deck Box: <strong>{selectedBox?.name ?? 'None'}</strong>
          </p>
          <p>
            Card Sleeve: <strong>{selectedSleeve?.name ?? 'Default cardback'}</strong>
          </p>
        </div>
      </div>

      <aside className={styles.sidebar}>
        <h2 className={styles.sidebarTitle}>Deck Customization</h2>
        <div className={styles.tabs} role="tablist">
          <button
            type="button"
            role="tab"
            aria-selected={tab === 'deck_boxes'}
            className={`${styles.tab}${tab === 'deck_boxes' ? ` ${styles.tabActive}` : ''}`}
            onClick={() => setTab('deck_boxes')}
          >
            Deck Boxes
          </button>
          <button
            type="button"
            role="tab"
            aria-selected={tab === 'sleeves'}
            className={`${styles.tab}${tab === 'sleeves' ? ` ${styles.tabActive}` : ''}`}
            onClick={() => setTab('sleeves')}
          >
            Card Sleeves
          </button>
        </div>

        {tab === 'deck_boxes' ? (
          <ul className={styles.grid}>
            {deckBoxes.map((box) => {
              const active = box.identifier === (deckBoxIdentifier ?? selectedBox?.identifier);
              const thumb = templateUrl(deckBoxesUrl, box.imagePath, '/deck-boxes/{path}');
              return (
                <li key={box.identifier}>
                  <button
                    type="button"
                    className={`${styles.gridItem}${active ? ` ${styles.gridItemActive}` : ''}`}
                    onClick={() => setDeckBoxIdentifier(box.identifier)}
                    aria-pressed={active}
                  >
                    <img src={thumb} alt="" className={styles.gridThumb} />
                    <span className={styles.gridLabel}>{box.name}</span>
                  </button>
                </li>
              );
            })}
          </ul>
        ) : (
          <ul className={styles.grid}>
            <li>
              <button
                type="button"
                className={`${styles.gridItem}${!sleeveIdentifier ? ` ${styles.gridItemActive}` : ''}`}
                onClick={() => setSleeveIdentifier(undefined)}
                aria-pressed={!sleeveIdentifier}
              >
                <img src={publicAssetUrl('assets/cardback.png')} alt="" className={styles.gridThumb} />
                <span className={styles.gridLabel}>Default</span>
              </button>
            </li>
            {sleeves.map((sleeve) => {
              const active = sleeve.identifier === sleeveIdentifier;
              const thumb = templateUrl(sleevesUrl, sleeve.imagePath, '/sleeves/{path}');
              return (
                <li key={sleeve.identifier}>
                  <button
                    type="button"
                    className={`${styles.gridItem}${active ? ` ${styles.gridItemActive}` : ''}`}
                    onClick={() => setSleeveIdentifier(sleeve.identifier)}
                    aria-pressed={active}
                  >
                    <img src={thumb} alt="" className={styles.gridThumb} />
                    <span className={styles.gridLabel}>{sleeve.name}</span>
                  </button>
                </li>
              );
            })}
          </ul>
        )}

        <div className={styles.sidebarActions}>
          <ShellButton disabled={saving} onClick={() => void onSave()}>
            {saving ? 'Saving…' : 'Apply'}
          </ShellButton>
          <ShellButton variant="secondary" onClick={() => navigate(`/deck/${deckId}`)}>
            Cancel
          </ShellButton>
        </div>
      </aside>
    </div>
  );
}

function ShellButtonLinkBack({ deckId }: { deckId: number }) {
  return (
    <Link to={`/deck/${deckId}`} className={styles.backLink}>
      ← Back
    </Link>
  );
}
