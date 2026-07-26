import { useEffect, useMemo, useState } from 'react';
import { Link } from 'react-router-dom';
import type { Card } from 'ptcg-server';
import { getCardsAll } from '../../api/cardsApi';
import { CardFace } from '../../components/cards/CardFace';
import { CardInfoPopup } from '../../card-info/CardInfoPopup';
import { useAuth } from '../../context/AuthContext';
import { useDeckCardScanUrl } from '../../context/CardImagesContext';
import { EFFECTLESS_CARDS, type EffectlessCardEntry } from './effectlessCards';
import { readFlaggedCards, toggleFlaggedCard } from './effectlessFlaggedStorage';
import { readTestedCards, toggleTestedCard } from './effectlessTestedStorage';
import styles from './EffectlessCardsPage.module.css';

function toScanCard(entry: EffectlessCardEntry): Card {
  return {
    set: entry.set,
    setNumber: entry.setNumber,
    name: entry.name,
    fullName: entry.fullName,
  } as Card;
}

function resolveCatalogCard(
  entry: EffectlessCardEntry,
  byFullName: Map<string, Card>,
  bySetId: Map<string, Card>,
): Card {
  return (
    byFullName.get(entry.fullName) ??
    bySetId.get(`${entry.set} ${entry.setNumber}`) ??
    toScanCard(entry)
  );
}

export function EffectlessCardsPage() {
  const { serverConfig, cardsInfo } = useAuth();
  const getScanUrl = useDeckCardScanUrl(serverConfig?.scansUrl);
  const [setFilter, setSetFilter] = useState('all');
  const [query, setQuery] = useState('');
  const [catalog, setCatalog] = useState<Card[]>(() => cardsInfo?.cards ?? []);
  const [infoFullName, setInfoFullName] = useState<string | null>(null);
  const [swappedCard, setSwappedCard] = useState<Card | null>(null);
  const [tested, setTested] = useState<Set<string>>(() => readTestedCards());
  const [flagged, setFlagged] = useState<Set<string>>(() => readFlaggedCards());

  const sets = useMemo(() => {
    const unique = new Set(EFFECTLESS_CARDS.map((c) => c.set));
    return [...unique].sort((a, b) => a.localeCompare(b));
  }, []);

  const testedCount = useMemo(
    () => EFFECTLESS_CARDS.filter((c) => tested.has(c.fullName)).length,
    [tested],
  );

  useEffect(() => {
    if (cardsInfo?.cards?.length) {
      setCatalog(cardsInfo.cards);
      return;
    }

    let cancelled = false;
    void getCardsAll()
      .then((res) => {
        if (!cancelled && res.cardsInfo?.cards) {
          setCatalog(res.cardsInfo.cards);
        }
      })
      .catch(() => {
        /* public page — keep stubs if catalog fetch fails */
      });

    return () => {
      cancelled = true;
    };
  }, [cardsInfo]);

  const { byFullName, bySetId } = useMemo(() => {
    const full = new Map<string, Card>();
    const setId = new Map<string, Card>();
    for (const c of catalog) {
      full.set(c.fullName, c);
      setId.set(`${c.set} ${c.setNumber}`, c);
    }
    return { byFullName: full, bySetId: setId };
  }, [catalog]);

  const cards = useMemo(() => {
    const q = query.trim().toLowerCase();
    return EFFECTLESS_CARDS.filter((c) => {
      if (setFilter !== 'all' && c.set !== setFilter) {
        return false;
      }
      if (!q) {
        return true;
      }
      return (
        c.name.toLowerCase().includes(q) ||
        c.fullName.toLowerCase().includes(q) ||
        `${c.set} ${c.setNumber}`.toLowerCase().includes(q)
      );
    });
  }, [setFilter, query]);

  const infoIndex = infoFullName
    ? cards.findIndex((c) => c.fullName === infoFullName)
    : -1;
  const infoEntry = infoIndex >= 0 ? cards[infoIndex] : undefined;
  const infoCard = infoEntry
    ? (swappedCard ?? resolveCatalogCard(infoEntry, byFullName, bySetId))
    : null;

  useEffect(() => {
    if (infoFullName && infoIndex < 0) {
      setInfoFullName(null);
      setSwappedCard(null);
    }
  }, [infoFullName, infoIndex]);

  const openEntry = (entry: EffectlessCardEntry) => {
    setInfoFullName(entry.fullName);
    setSwappedCard(null);
  };

  const closeInfo = () => {
    setInfoFullName(null);
    setSwappedCard(null);
  };

  const navigateInfo = (delta: number) => {
    if (infoIndex < 0) {
      return;
    }
    const next = infoIndex + delta;
    if (next < 0 || next >= cards.length) {
      return;
    }
    setInfoFullName(cards[next].fullName);
    setSwappedCard(null);
  };

  return (
    <div className={styles.page}>
      <header className={styles.header}>
        <h1 className={styles.title}>Effectless restructure cards</h1>
        <p className={styles.subtitle}>
          Cards touched in commit 16cd523d (Effectless Card Format Restructured). Images use the
          same JSON map resolution as the deck editor. Click a card for details; check off ones
          you&apos;ve verified.
        </p>
        <Link className={styles.backLink} to="/games">
          ← Back to games
        </Link>
      </header>

      <div className={styles.toolbar}>
        <input
          className={styles.search}
          type="search"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="Search name or set…"
          aria-label="Search cards"
        />
        <select
          className={styles.setSelect}
          value={setFilter}
          onChange={(e) => setSetFilter(e.target.value)}
          aria-label="Filter by set"
        >
          <option value="all">All sets ({sets.length})</option>
          {sets.map((set) => (
            <option key={set} value={set}>
              {set}
            </option>
          ))}
        </select>
        <span className={styles.count}>
          {testedCount}/{EFFECTLESS_CARDS.length} tested · {cards.length} shown
        </span>
      </div>

      <div className={styles.grid}>
        {cards.map((entry) => {
          const card = resolveCatalogCard(entry, byFullName, bySetId);
          const isTested = tested.has(entry.fullName);
          const isFlagged = flagged.has(entry.fullName);
          return (
            <article
              key={entry.fullName}
              className={`${styles.card} ${isTested ? styles.cardTested : ''}`}
            >
              <div className={styles.faceWrap}>
                <label
                  className={styles.check}
                  title={isTested ? 'Mark as not tested' : 'Mark as tested & working'}
                >
                  <input
                    type="checkbox"
                    checked={isTested}
                    onChange={() => setTested(toggleTestedCard(entry.fullName))}
                    aria-label={`${entry.name}: tested and working`}
                  />
                </label>
                <button
                  type="button"
                  className={styles.faceBtn}
                  onClick={() => openEntry(entry)}
                  aria-label={`Open ${entry.name} card info`}
                >
                  <CardFace
                    className={styles.face}
                    src={getScanUrl(card)}
                    name={entry.name}
                    card={card}
                  />
                </button>
                {isFlagged && (
                  <div className={styles.flagBadge} aria-hidden>
                    <span>!</span>
                  </div>
                )}
              </div>
              <div className={styles.meta}>
                <p className={styles.name} title={entry.fullName}>
                  {entry.name}
                </p>
                <p className={styles.id}>
                  {entry.set} {entry.setNumber}
                </p>
              </div>
            </article>
          );
        })}
      </div>

      {infoCard && infoEntry && (
        <CardInfoPopup
          card={infoCard}
          catalog={catalog}
          getScanUrl={getScanUrl}
          isInGame={false}
          onClose={closeInfo}
          onCardSwap={({ replacementCard }) => setSwappedCard(replacementCard)}
          onNavigatePrev={infoIndex > 0 ? () => navigateInfo(-1) : undefined}
          onNavigateNext={infoIndex < cards.length - 1 ? () => navigateInfo(1) : undefined}
          tested={tested.has(infoEntry.fullName)}
          onToggleTested={() => setTested(toggleTestedCard(infoEntry.fullName))}
          testedLabel={`${infoEntry.name}: tested and working`}
          flagged={flagged.has(infoEntry.fullName)}
          onToggleFlagged={() => setFlagged(toggleFlaggedCard(infoEntry.fullName))}
          flaggedLabel={`${infoEntry.name}: flag`}
          hideSwapButton
        />
      )}
    </div>
  );
}
