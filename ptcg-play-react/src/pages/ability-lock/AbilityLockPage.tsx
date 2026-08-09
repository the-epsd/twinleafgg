import { useEffect, useMemo, useState } from 'react';
import { Link } from 'react-router-dom';
import type { Card } from 'ptcg-server';
import { getCardsAll } from '../../api/cardsApi';
import { CardFace } from '../../components/cards/CardFace';
import { CheckboxField } from '../../components/ui/CheckboxField';
import { CardInfoPopup } from '../../card-info/CardInfoPopup';
import { useAuth } from '../../context/AuthContext';
import { useDeckCardScanUrl } from '../../context/CardImagesContext';
import { ABILITY_LOCK_CARDS, type AbilityLockCardEntry, type AbilityLockMode } from './abilityLockCards';
import { readFlaggedCards, toggleFlaggedCard } from './abilityLockFlaggedStorage';
import { readTestedCards, toggleTestedCard } from './abilityLockTestedStorage';
import styles from './AbilityLockPage.module.css';

type FilterId = 'all' | AbilityLockMode;

const FILTERS: { id: FilterId; label: string }[] = [
  { id: 'all', label: 'All' },
  { id: 'lock', label: 'Remove (no Abilities)' },
  { id: 'block', label: "Block (can't use)" },
];

function toScanCard(entry: AbilityLockCardEntry): Card {
  return {
    set: entry.set,
    setNumber: entry.setNumber,
    name: entry.name,
    fullName: entry.fullName,
  } as Card;
}

function modeLabel(mode: AbilityLockMode): string {
  if (mode === 'block') return 'block';
  if (mode === 'both') return 'both';
  return 'lock';
}

function resolveCatalogCard(
  entry: AbilityLockCardEntry,
  byFullName: Map<string, Card>,
  bySetId: Map<string, Card>,
): Card {
  return (
    byFullName.get(entry.fullName) ??
    bySetId.get(`${entry.set} ${entry.setNumber}`) ??
    toScanCard(entry)
  );
}

export function AbilityLockPage() {
  const { serverConfig, cardsInfo } = useAuth();
  const getScanUrl = useDeckCardScanUrl(serverConfig?.scansUrl);
  const [filter, setFilter] = useState<FilterId>('all');
  const [catalog, setCatalog] = useState<Card[]>(() => cardsInfo?.cards ?? []);
  const [infoFullName, setInfoFullName] = useState<string | null>(null);
  const [swappedCard, setSwappedCard] = useState<Card | null>(null);
  const [tested, setTested] = useState<Set<string>>(() => readTestedCards());
  const [flagged, setFlagged] = useState<Set<string>>(() => readFlaggedCards());

  const testedCount = useMemo(
    () => ABILITY_LOCK_CARDS.filter((c) => tested.has(c.fullName)).length,
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
    if (filter === 'all') {
      return ABILITY_LOCK_CARDS;
    }
    return ABILITY_LOCK_CARDS.filter((c) => c.mode === filter || c.mode === 'both');
  }, [filter]);

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

  const openEntry = (entry: AbilityLockCardEntry) => {
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
        <h1 className={styles.title}>Ability lock cards</h1>
        <p className={styles.subtitle}>
          Cards on the shared ability-lock prefab. Images use the same JSON map resolution as the
          deck editor (nightly / custom / scansUrl). Click a card for details.
        </p>
        <Link className={styles.backLink} to="/games">
          ← Back to games
        </Link>
      </header>

      <div className={styles.toolbar}>
        {FILTERS.map((tab) => (
          <button
            key={tab.id}
            type="button"
            className={filter === tab.id ? `${styles.tab} ${styles.tabActive}` : styles.tab}
            onClick={() => setFilter(tab.id)}
          >
            {tab.label}
          </button>
        ))}
        <span className={styles.count}>
          {testedCount}/{ABILITY_LOCK_CARDS.length} tested · {cards.length} shown
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
                <CheckboxField
                  plain
                  className={styles.check}
                  checked={isTested}
                  onChange={() => setTested(toggleTestedCard(entry.fullName))}
                />
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
                <span
                  className={`${styles.badge} ${
                    entry.mode === 'block' ? styles.badgeBlock : styles.badgeLock
                  }`}
                >
                  {modeLabel(entry.mode)}
                </span>
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
