import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { useTranslation } from 'react-i18next';
import type { Player, State } from 'ptcg-server';
import { GamePhase } from 'ptcg-server';
import { getSocketManager } from '../../socket/socketManager';
import { ApiError, formatUnknownError } from '../../api/apiError';
import { useSnackbar } from '../../context/SnackbarContext';
import { translateGameSocketError } from '../../i18n/translateGameSocketError';
import styles from './SandboxControlPanel.module.css';

const ZONES = [
  { value: 'hand', label: 'Hand' },
  { value: 'deck', label: 'Deck' },
  { value: 'discard', label: 'Discard' },
  { value: 'lostzone', label: 'Lost Zone' },
  { value: 'prizes', label: 'Prizes' },
  { value: 'stadium', label: 'Stadium' },
  { value: 'supporter', label: 'Supporter' },
] as const;

const ENERGY_TYPES = [
  'Fire Energy SVE 2',
  'Water Energy SVE 3',
  'Grass Energy SVE 1',
  'Lightning Energy SVE 4',
  'Psychic Energy SVE 5',
  'Fighting Energy SVE 6',
  'Darkness Energy SVE 7',
  'Metal Energy SVE 8',
  'Fairy Energy XY 140',
];

const GAME_PHASES: { value: GamePhase; label: string }[] = [
  { value: GamePhase.WAITING_FOR_PLAYERS, label: 'WAITING_FOR_PLAYERS' },
  { value: GamePhase.SETUP, label: 'SETUP' },
  { value: GamePhase.PLAYER_TURN, label: 'PLAYER_TURN' },
  { value: GamePhase.ATTACK, label: 'ATTACK' },
  { value: GamePhase.AFTER_ATTACK, label: 'AFTER_ATTACK' },
  { value: GamePhase.CHOOSE_PRIZES, label: 'CHOOSE_PRIZES' },
  { value: GamePhase.BETWEEN_TURNS, label: 'BETWEEN_TURNS' },
  { value: GamePhase.FINISHED, label: 'FINISHED' },
];

function getCardsFromZone(player: Player | undefined, zone: string): string[] {
  if (!player) {
    return [];
  }
  const z = zone.trim();
  switch (z) {
    case 'hand':
      return player.hand.cards.map((c) => c.fullName);
    case 'deck':
      return player.deck.cards.map((c) => c.fullName);
    case 'discard':
      return player.discard.cards.map((c) => c.fullName);
    case 'lostzone':
      return player.lostzone.cards.map((c) => c.fullName);
    case 'stadium':
      return player.stadium.cards.map((c) => c.fullName);
    case 'supporter':
      return player.supporter.cards.map((c) => c.fullName);
    case 'prizes': {
      const prizeCards: string[] = [];
      for (const prize of player.prizes) {
        prizeCards.push(...prize.cards.map((c) => c.fullName));
      }
      return prizeCards;
    }
    default:
      return [];
  }
}

function getTargetPlayer(
  gameState: State | undefined,
  selectedPlayerIndex: number,
  players: Player[],
): Player | undefined {
  if (gameState?.players?.length) {
    const byIndex = gameState.players[selectedPlayerIndex];
    if (byIndex) {
      return byIndex;
    }
    const id = players[selectedPlayerIndex]?.id;
    if (id != null) {
      return gameState.players.find((p) => p.id === id);
    }
  }
  return players[selectedPlayerIndex];
}

export interface SandboxControlPanelProps {
  gameId: number;
  gameState: State;
  players: Player[];
  clientId: number;
}

type TabId = 'player' | 'gameState' | 'cards' | 'pokemon';

export function SandboxControlPanel({ gameId, gameState, players }: SandboxControlPanelProps) {
  const { t } = useTranslation();
  const { showSnackbar } = useSnackbar();
  const [collapsed, setCollapsed] = useState(false);
  const [tab, setTab] = useState<TabId>('player');

  const onSocketErr = useCallback(
    (e: unknown) => {
      const raw = e instanceof ApiError ? e.message : formatUnknownError(e);
      showSnackbar(translateGameSocketError(t, raw), { variant: 'error' });
    },
    [showSnackbar, t],
  );

  const ok = useCallback(
    (key: string) => {
      showSnackbar(t(key));
    },
    [showSnackbar, t],
  );

  const [selectedPlayerIndex, setSelectedPlayerIndex] = useState(0);
  const [selectedBenchIndex, setSelectedBenchIndex] = useState(0);
  const [cardName, setCardName] = useState('');
  const [selectedCardIndex, setSelectedCardIndex] = useState<number | null>(null);
  const [selectedCardIndices, setSelectedCardIndices] = useState<Set<number>>(() => new Set());
  const [fromZone, setFromZone] = useState<(typeof ZONES)[number]['value']>('hand');
  const [toZone, setToZone] = useState<(typeof ZONES)[number]['value']>('hand');
  const [selectedEnergyType, setSelectedEnergyType] = useState('');

  const [playerMods, setPlayerMods] = useState({
    prizes: null as number | null,
    handSize: null as number | null,
    deckSize: null as number | null,
    discardSize: null as number | null,
    lostzoneSize: null as number | null,
    supporterTurn: null as number | null,
    retreatedTurn: null as number | null,
    energyPlayedTurn: null as number | null,
    stadiumPlayedTurn: null as number | null,
    stadiumUsedTurn: null as number | null,
    usedVSTAR: false,
    usedGX: false,
    ancientSupporter: false,
    rocketSupporter: false,
  });

  const [gameStateMods, setGameStateMods] = useState({
    turn: null as number | null,
    phase: null as GamePhase | null,
    activePlayer: null as number | null,
    skipOpponentTurn: false,
    isSuddenDeath: false,
    rules: {
      firstTurnDrawCard: true,
      firstTurnUseSupporter: true,
      attackFirstTurn: false,
      unlimitedEnergyAttachments: false,
      alternativeSetup: false,
    },
  });

  const [pokemonMods, setPokemonMods] = useState({
    damage: null as number | null,
    hp: null as number | null,
    energyCount: null as number | null,
    conditions: {
      burned: false,
      poisoned: false,
      asleep: false,
      paralyzed: false,
      confused: false,
    },
  });

  const [pokemonLocation, setPokemonLocation] = useState<'active' | 'bench'>('active');

  const prevGameIdRef = useRef<number | undefined>(undefined);
  useEffect(() => {
    if (!gameState) {
      return;
    }
    if (prevGameIdRef.current !== gameId) {
      prevGameIdRef.current = gameId;
      setGameStateMods({
        turn: gameState.turn,
        phase: gameState.phase,
        activePlayer: gameState.activePlayer,
        skipOpponentTurn: gameState.skipOpponentTurn,
        isSuddenDeath: gameState.isSuddenDeath || false,
        rules: gameState.rules
          ? { ...gameState.rules }
          : {
              firstTurnDrawCard: true,
              firstTurnUseSupporter: true,
              attackFirstTurn: false,
              unlimitedEnergyAttachments: false,
              alternativeSetup: false,
            },
      });
    }
  }, [gameId, gameState]);

  const selectedPlayer = useMemo(
    () => getTargetPlayer(gameState, selectedPlayerIndex, players),
    [gameState, players, selectedPlayerIndex],
  );

  const targetPlayerForZones = getTargetPlayer(gameState, selectedPlayerIndex, players);
  const availableCards = getCardsFromZone(targetPlayerForZones, fromZone);

  const selectedPlayerIndexRef = useRef(selectedPlayerIndex);
  selectedPlayerIndexRef.current = selectedPlayerIndex;
  const fromZoneRef = useRef(fromZone);
  fromZoneRef.current = fromZone;

  const prevAvailableRef = useRef<string[]>([]);

  const playersRef = useRef(players);
  playersRef.current = players;

  useEffect(() => {
    const t = window.setTimeout(() => {
      const nextCards = getCardsFromZone(
        getTargetPlayer(gameState, selectedPlayerIndexRef.current, playersRef.current),
        fromZoneRef.current,
      );
      const oldCards = prevAvailableRef.current;
      prevAvailableRef.current = nextCards;

      setSelectedCardIndices((prev) => {
        if (prev.size === 0) {
          return prev;
        }
        const next = new Set<number>();
        prev.forEach((oldIndex) => {
          if (oldIndex < oldCards.length) {
            const oldCardName = oldCards[oldIndex];
            const newIndex = nextCards.findIndex((c) => c === oldCardName);
            if (newIndex !== -1) {
              next.add(newIndex);
            }
          }
        });
        return next;
      });
      setSelectedCardIndex((si) => {
        if (si === null) {
          return null;
        }
        if (si >= nextCards.length) {
          setCardName('');
          return null;
        }
        const nameAt = nextCards[si];
        if (nameAt !== undefined) {
          setCardName(nameAt);
        }
        return si;
      });
    }, 50);
    return () => window.clearTimeout(t);
  }, [gameState]);

  const refreshAfterMutation = useCallback(() => {
    window.setTimeout(() => {
      setSelectedCardIndex(null);
      setSelectedCardIndices(new Set());
      setCardName('');
    }, 200);
  }, []);

  const playerRow = gameState.players.length > 0 ? gameState.players : players;

  const applyPlayerModifications = async () => {
    if (!selectedPlayer) {
      return;
    }
    const mods: Record<string, unknown> = {};
    if (playerMods.prizes !== null) {
      mods.prizes = playerMods.prizes;
    }
    if (playerMods.handSize !== null) {
      mods.handSize = playerMods.handSize;
    }
    if (playerMods.deckSize !== null) {
      mods.deckSize = playerMods.deckSize;
    }
    if (playerMods.discardSize !== null) {
      mods.discardSize = playerMods.discardSize;
    }
    if (playerMods.lostzoneSize !== null) {
      mods.lostzoneSize = playerMods.lostzoneSize;
    }
    if (playerMods.supporterTurn !== null) {
      mods.supporterTurn = playerMods.supporterTurn;
    }
    if (playerMods.retreatedTurn !== null) {
      mods.retreatedTurn = playerMods.retreatedTurn;
    }
    if (playerMods.energyPlayedTurn !== null) {
      mods.energyPlayedTurn = playerMods.energyPlayedTurn;
    }
    if (playerMods.stadiumPlayedTurn !== null) {
      mods.stadiumPlayedTurn = playerMods.stadiumPlayedTurn;
    }
    if (playerMods.stadiumUsedTurn !== null) {
      mods.stadiumUsedTurn = playerMods.stadiumUsedTurn;
    }
    mods.usedVSTAR = playerMods.usedVSTAR;
    mods.usedGX = playerMods.usedGX;
    mods.ancientSupporter = playerMods.ancientSupporter;
    mods.rocketSupporter = playerMods.rocketSupporter;
    try {
      await getSocketManager().emit('game:sandbox:modifyPlayer', {
        gameId,
        targetPlayerId: selectedPlayer.id,
        modifications: mods,
      });
      ok('SANDBOX_PLAYER_MODIFIED');
    } catch (e) {
      onSocketErr(e);
    }
  };

  const applyGameStateModifications = async () => {
    const mods: Record<string, unknown> = {};
    if (gameStateMods.turn !== null) {
      mods.turn = gameStateMods.turn;
    }
    if (gameStateMods.phase !== null) {
      mods.phase = gameStateMods.phase;
    }
    if (gameStateMods.activePlayer !== null) {
      mods.activePlayer = gameStateMods.activePlayer;
    }
    mods.skipOpponentTurn = gameStateMods.skipOpponentTurn;
    mods.isSuddenDeath = gameStateMods.isSuddenDeath;
    mods.rules = gameStateMods.rules;
    try {
      await getSocketManager().emit('game:sandbox:modifyGameState', { gameId, modifications: mods });
      ok('SANDBOX_GAME_STATE_MODIFIED');
    } catch (e) {
      onSocketErr(e);
    }
  };

  const addCard = async () => {
    if (!selectedPlayer || !cardName.trim()) {
      return;
    }
    try {
      await getSocketManager().emit('game:sandbox:modifyCard', {
        gameId,
        targetPlayerId: selectedPlayer.id,
        action: 'add',
        cardName: cardName.trim(),
        toZone,
      });
      ok('SANDBOX_CARD_ADDED');
      setCardName('');
      setSelectedCardIndex(null);
      refreshAfterMutation();
    } catch (e) {
      onSocketErr(e);
    }
  };

  const removeCard = async () => {
    if (!selectedPlayer) {
      return;
    }
    const runRemove = async (names: string[]) => {
      for (const name of names) {
        await getSocketManager().emit('game:sandbox:modifyCard', {
          gameId,
          targetPlayerId: selectedPlayer.id,
          action: 'remove',
          cardName: name,
          fromZone,
        });
      }
      ok('SANDBOX_CARD_REMOVED');
      setSelectedCardIndices(new Set());
      setSelectedCardIndex(null);
      setCardName('');
      refreshAfterMutation();
    };
    try {
      if (selectedCardIndices.size > 0) {
        const cardsToRemove: string[] = [];
        selectedCardIndices.forEach((index) => {
          if (availableCards[index]) {
            cardsToRemove.push(availableCards[index]!);
          }
        });
        if (cardsToRemove.length === 0) {
          return;
        }
        await runRemove(cardsToRemove);
      } else if (cardName.trim()) {
        await runRemove([cardName.trim()]);
      }
    } catch (e) {
      onSocketErr(e);
    }
  };

  const moveCard = async () => {
    if (!selectedPlayer) {
      return;
    }
    const runMove = async (names: string[]) => {
      for (const name of names) {
        await getSocketManager().emit('game:sandbox:modifyCard', {
          gameId,
          targetPlayerId: selectedPlayer.id,
          action: 'move',
          cardName: name,
          fromZone,
          toZone,
        });
      }
      ok('SANDBOX_CARD_MOVED');
      setSelectedCardIndices(new Set());
      setSelectedCardIndex(null);
      setCardName('');
      refreshAfterMutation();
    };
    try {
      if (selectedCardIndices.size > 0) {
        const cardsToMove: string[] = [];
        selectedCardIndices.forEach((index) => {
          if (availableCards[index]) {
            cardsToMove.push(availableCards[index]!);
          }
        });
        if (cardsToMove.length === 0) {
          return;
        }
        await runMove(cardsToMove);
      } else if (cardName.trim()) {
        await runMove([cardName.trim()]);
      }
    } catch (e) {
      onSocketErr(e);
    }
  };

  const applyPokemonModifications = async () => {
    if (!selectedPlayer) {
      return;
    }
    const mods: Record<string, unknown> = {};
    if (pokemonMods.damage !== null) {
      mods.damage = pokemonMods.damage;
    }
    if (pokemonMods.hp !== null) {
      mods.hp = pokemonMods.hp;
    }
    if (pokemonMods.energyCount !== null && pokemonMods.energyCount > 0) {
      mods.energyCount = pokemonMods.energyCount;
      if (selectedEnergyType) {
        mods.energyTypes = [selectedEnergyType];
      }
    }
    mods.conditions = pokemonMods.conditions;
    try {
      await getSocketManager().emit('game:sandbox:modifyPokemon', {
        gameId,
        targetPlayerId: selectedPlayer.id,
        location: pokemonLocation,
        modifications: mods,
        benchIndex: pokemonLocation === 'bench' ? selectedBenchIndex : undefined,
      });
      ok('SANDBOX_POKEMON_MODIFIED');
    } catch (e) {
      onSocketErr(e);
    }
  };

  const onCardSelected = (index: number | null) => {
    setSelectedCardIndex(index);
    if (index !== null && availableCards[index]) {
      setCardName(availableCards[index]!);
    } else {
      setCardName('');
    }
  };

  const railClass = collapsed ? styles.railCollapsed : styles.railExpanded;

  return (
    <div className={`${styles.rail} ${railClass}`}>
      <button
        type="button"
        className={styles.toggle}
        aria-expanded={!collapsed}
        onClick={() => setCollapsed((c) => !c)}
        title={collapsed ? t('SANDBOX_EXPAND') : t('SANDBOX_COLLAPSE')}
      >
        {collapsed ? '›' : '‹'}
      </button>
      {!collapsed ? (
        <div className={styles.panel}>
          <div className={styles.panelHeader}>
            <h3>{t('SANDBOX_CONTROLS_TITLE')}</h3>
          </div>
          <div className={styles.tabBar}>
            {(
              [
                ['player', 'SANDBOX_TAB_PLAYER'],
                ['gameState', 'SANDBOX_TAB_GAME_STATE'],
                ['cards', 'SANDBOX_TAB_CARDS'],
                ['pokemon', 'SANDBOX_TAB_POKEMON'],
              ] as const
            ).map(([id, labelKey]) => (
              <button
                key={id}
                type="button"
                className={`${styles.tab} ${tab === id ? styles.tabActive : ''}`}
                onClick={() => setTab(id)}
              >
                {t(labelKey)}
              </button>
            ))}
          </div>
          <div className={styles.scroll}>
            {tab === 'player' ? (
              <div className={styles.tabContent}>
                <div className={styles.formGroup}>
                  <label>{t('SANDBOX_SELECT_PLAYER')}</label>
                  <select
                    className={styles.select}
                    value={selectedPlayerIndex}
                    onChange={(e) => {
                      prevAvailableRef.current = [];
                      setSelectedPlayerIndex(Number(e.target.value));
                    }}
                  >
                    {playerRow.map((p, i) => (
                      <option key={p.id} value={i}>
                        {p.name} (ID: {p.id})
                      </option>
                    ))}
                  </select>
                </div>
                {(
                  [
                    ['prizes', 'SANDBOX_PRIZES', playerMods.prizes],
                    ['handSize', 'SANDBOX_HAND_SIZE', playerMods.handSize],
                    ['deckSize', 'SANDBOX_DECK_SIZE', playerMods.deckSize],
                    ['discardSize', 'SANDBOX_DISCARD_SIZE', playerMods.discardSize],
                    ['lostzoneSize', 'SANDBOX_LOST_ZONE_SIZE', playerMods.lostzoneSize],
                  ] as const
                ).map(([key, labelKey, val]) => (
                  <div key={key} className={styles.formGroup}>
                    <label>{t(labelKey)}</label>
                    <input
                      className={styles.input}
                      type="number"
                      value={val ?? ''}
                      placeholder={t('SANDBOX_LEAVE_EMPTY')}
                      onChange={(e) => {
                        const v = e.target.value === '' ? null : Number(e.target.value);
                        setPlayerMods((m) => ({ ...m, [key]: Number.isFinite(v as number) ? v : null }));
                      }}
                    />
                  </div>
                ))}
                <div className={styles.formGroup}>
                  <label>
                    <input
                      type="checkbox"
                      checked={playerMods.usedVSTAR}
                      onChange={(e) => setPlayerMods((m) => ({ ...m, usedVSTAR: e.target.checked }))}
                    />{' '}
                    {t('SANDBOX_USED_VSTAR')}
                  </label>
                </div>
                <div className={styles.formGroup}>
                  <label>
                    <input
                      type="checkbox"
                      checked={playerMods.usedGX}
                      onChange={(e) => setPlayerMods((m) => ({ ...m, usedGX: e.target.checked }))}
                    />{' '}
                    {t('SANDBOX_USED_GX')}
                  </label>
                </div>
                <button type="button" className={styles.btn} onClick={() => void applyPlayerModifications()}>
                  {t('SANDBOX_APPLY_PLAYER')}
                </button>
              </div>
            ) : null}

            {tab === 'gameState' ? (
              <div className={styles.tabContent}>
                <div className={styles.formGroup}>
                  <label>{t('SANDBOX_TURN')}</label>
                  <input
                    className={styles.input}
                    type="number"
                    value={gameStateMods.turn ?? ''}
                    placeholder={t('SANDBOX_LEAVE_EMPTY')}
                    onChange={(e) => {
                      const v = e.target.value === '' ? null : Number(e.target.value);
                      setGameStateMods((m) => ({
                        ...m,
                        turn: Number.isFinite(v as number) ? v : null,
                      }));
                    }}
                  />
                </div>
                <div className={styles.formGroup}>
                  <label>{t('SANDBOX_PHASE')}</label>
                  <select
                    className={styles.select}
                    value={gameStateMods.phase == null ? '' : String(gameStateMods.phase)}
                    onChange={(e) => {
                      const v = e.target.value === '' ? null : (Number(e.target.value) as GamePhase);
                      setGameStateMods((m) => ({ ...m, phase: v }));
                    }}
                  >
                    <option value="">{t('SANDBOX_PHASE_SKIP')}</option>
                    {GAME_PHASES.map((ph) => (
                      <option key={ph.value} value={String(ph.value)}>
                        {t(ph.label)}
                      </option>
                    ))}
                  </select>
                </div>
                <div className={styles.formGroup}>
                  <label>{t('SANDBOX_ACTIVE_PLAYER_INDEX')}</label>
                  <input
                    className={styles.input}
                    type="number"
                    value={gameStateMods.activePlayer ?? ''}
                    placeholder={t('SANDBOX_LEAVE_EMPTY')}
                    onChange={(e) => {
                      const v = e.target.value === '' ? null : Number(e.target.value);
                      setGameStateMods((m) => ({
                        ...m,
                        activePlayer: Number.isFinite(v as number) ? v : null,
                      }));
                    }}
                  />
                </div>
                <div className={styles.formGroup}>
                  <label>
                    <input
                      type="checkbox"
                      checked={gameStateMods.skipOpponentTurn}
                      onChange={(e) =>
                        setGameStateMods((m) => ({ ...m, skipOpponentTurn: e.target.checked }))
                      }
                    />{' '}
                    {t('SANDBOX_SKIP_OPPONENT_TURN')}
                  </label>
                </div>
                <div className={styles.formGroup}>
                  <label>
                    <input
                      type="checkbox"
                      checked={gameStateMods.isSuddenDeath}
                      onChange={(e) => setGameStateMods((m) => ({ ...m, isSuddenDeath: e.target.checked }))}
                    />{' '}
                    {t('SANDBOX_SUDDEN_DEATH')}
                  </label>
                </div>
                <div className={styles.section}>
                  <h4>{t('SANDBOX_RULES')}</h4>
                  {(
                    [
                      ['firstTurnDrawCard', 'GAMES_DRAW_CARD_FIRST_TURN'],
                      ['firstTurnUseSupporter', 'GAMES_PLAY_SUPPORTER_FIRST_TURN'],
                      ['attackFirstTurn', 'SANDBOX_ATTACK_FIRST_TURN'],
                      ['unlimitedEnergyAttachments', 'GAMES_UNLIMITED_ENERGY'],
                      ['alternativeSetup', 'GAMES_ALTERNATIVE_SETUP'],
                    ] as const
                  ).map(([ruleKey, labelKey]) => (
                    <div key={ruleKey} className={styles.formGroup}>
                      <label>
                        <input
                          type="checkbox"
                          checked={gameStateMods.rules[ruleKey]}
                          onChange={(e) =>
                            setGameStateMods((m) => ({
                              ...m,
                              rules: { ...m.rules, [ruleKey]: e.target.checked },
                            }))
                          }
                        />{' '}
                        {t(labelKey)}
                      </label>
                    </div>
                  ))}
                </div>
                <button type="button" className={styles.btn} onClick={() => void applyGameStateModifications()}>
                  {t('SANDBOX_APPLY_GAME_STATE')}
                </button>
              </div>
            ) : null}

            {tab === 'cards' ? (
              <div className={styles.tabContent}>
                <div className={styles.formGroup}>
                  <label>{t('SANDBOX_SELECT_PLAYER')}</label>
                  <select
                    className={styles.select}
                    value={selectedPlayerIndex}
                    onChange={(e) => {
                      prevAvailableRef.current = [];
                      setSelectedPlayerIndex(Number(e.target.value));
                      setSelectedCardIndex(null);
                      setCardName('');
                      setSelectedCardIndices(new Set());
                    }}
                  >
                    {playerRow.map((p, i) => (
                      <option key={p.id} value={i}>
                        {p.name} (ID: {p.id})
                      </option>
                    ))}
                  </select>
                </div>
                <div className={styles.formGroup}>
                  <label>{t('SANDBOX_FROM_ZONE')}</label>
                  <select
                    className={styles.select}
                    value={fromZone}
                    onChange={(e) => {
                      prevAvailableRef.current = [];
                      setFromZone(e.target.value as (typeof ZONES)[number]['value']);
                      setSelectedCardIndex(null);
                      setCardName('');
                      setSelectedCardIndices(new Set());
                    }}
                  >
                    {ZONES.map((z) => (
                      <option key={z.value} value={z.value}>
                        {z.label}
                      </option>
                    ))}
                  </select>
                </div>
                <div className={styles.formGroup}>
                  <label>{t('SANDBOX_CARD')}</label>
                  <select
                    key={`sandbox-card-pick-${fromZone}-${selectedPlayerIndex}`}
                    className={styles.select}
                    value={selectedCardIndex === null ? '' : String(selectedCardIndex)}
                    disabled={availableCards.length === 0}
                    onChange={(e) => {
                      const v = e.target.value;
                      if (v === '') {
                        onCardSelected(null);
                      } else {
                        onCardSelected(Number(v));
                      }
                    }}
                  >
                    <option value="">{t('SANDBOX_SELECT_CARD_PLACEHOLDER')}</option>
                    {availableCards.map((c, i) => (
                      <option key={`${c}-${i}`} value={i}>
                        {c}
                      </option>
                    ))}
                  </select>
                  {availableCards.length === 0 ? (
                    <span className={styles.hint}>{t('SANDBOX_NO_CARDS_IN_ZONE', { zone: fromZone })}</span>
                  ) : null}
                </div>
                {availableCards.length > 0 ? (
                  <div className={styles.formGroup}>
                    <label>{t('SANDBOX_MULTI_SELECT')}</label>
                    <div
                      key={`sandbox-card-check-${fromZone}-${selectedPlayerIndex}`}
                      className={styles.cardCheckboxList}
                    >
                      {availableCards.map((c, i) => (
                        <div key={`${c}-${i}`} className={styles.cardCheckboxItem}>
                          <label>
                            <input
                              type="checkbox"
                              checked={selectedCardIndices.has(i)}
                              onChange={(e) => {
                                setSelectedCardIndices((prev) => {
                                  const next = new Set(prev);
                                  if (e.target.checked) {
                                    next.add(i);
                                  } else {
                                    next.delete(i);
                                  }
                                  return next;
                                });
                              }}
                            />
                            {c}
                          </label>
                        </div>
                      ))}
                    </div>
                  </div>
                ) : null}
                <div className={styles.formGroup}>
                  <label>{t('SANDBOX_TO_ZONE')}</label>
                  <select
                    className={styles.select}
                    value={toZone}
                    onChange={(e) => setToZone(e.target.value as (typeof ZONES)[number]['value'])}
                  >
                    {ZONES.map((z) => (
                      <option key={z.value} value={z.value}>
                        {z.label}
                      </option>
                    ))}
                  </select>
                </div>
                <div className={styles.buttonRow}>
                  <button type="button" className={styles.btn} onClick={() => void addCard()}>
                    {t('SANDBOX_ADD_CARD')}
                  </button>
                  <button type="button" className={`${styles.btn} ${styles.btnWarn}`} onClick={() => void removeCard()}>
                    {t('SANDBOX_REMOVE_CARD')}
                  </button>
                  <button type="button" className={`${styles.btn} ${styles.btnAccent}`} onClick={() => void moveCard()}>
                    {t('SANDBOX_MOVE_CARD')}
                  </button>
                </div>
              </div>
            ) : null}

            {tab === 'pokemon' ? (
              <div className={styles.tabContent}>
                <div className={styles.formGroup}>
                  <label>{t('SANDBOX_SELECT_PLAYER')}</label>
                  <select
                    className={styles.select}
                    value={selectedPlayerIndex}
                    onChange={(e) => {
                      prevAvailableRef.current = [];
                      setSelectedPlayerIndex(Number(e.target.value));
                    }}
                  >
                    {playerRow.map((p, i) => (
                      <option key={p.id} value={i}>
                        {p.name} (ID: {p.id})
                      </option>
                    ))}
                  </select>
                </div>
                <div className={styles.formGroup}>
                  <label>{t('SANDBOX_LOCATION')}</label>
                  <select
                    className={styles.select}
                    value={pokemonLocation}
                    onChange={(e) => setPokemonLocation(e.target.value as 'active' | 'bench')}
                  >
                    <option value="active">{t('SANDBOX_ACTIVE')}</option>
                    <option value="bench">{t('SANDBOX_BENCH')}</option>
                  </select>
                </div>
                {pokemonLocation === 'bench' ? (
                  <div className={styles.formGroup}>
                    <label>{t('SANDBOX_BENCH_INDEX')}</label>
                    <input
                      className={styles.input}
                      type="number"
                      min={0}
                      max={4}
                      value={selectedBenchIndex}
                      onChange={(e) => setSelectedBenchIndex(Number(e.target.value))}
                    />
                  </div>
                ) : null}
                <div className={styles.formGroup}>
                  <label>{t('SANDBOX_DAMAGE')}</label>
                  <input
                    className={styles.input}
                    type="number"
                    value={pokemonMods.damage ?? ''}
                    placeholder={t('SANDBOX_LEAVE_EMPTY')}
                    onChange={(e) => {
                      const v = e.target.value === '' ? null : Number(e.target.value);
                      setPokemonMods((m) => ({
                        ...m,
                        damage: Number.isFinite(v as number) ? v : null,
                      }));
                    }}
                  />
                </div>
                <div className={styles.formGroup}>
                  <label>{t('SANDBOX_HP')}</label>
                  <input
                    className={styles.input}
                    type="number"
                    value={pokemonMods.hp ?? ''}
                    placeholder={t('SANDBOX_LEAVE_EMPTY')}
                    onChange={(e) => {
                      const v = e.target.value === '' ? null : Number(e.target.value);
                      setPokemonMods((m) => ({
                        ...m,
                        hp: Number.isFinite(v as number) ? v : null,
                      }));
                    }}
                  />
                </div>
                <div className={styles.formGroup}>
                  <label>{t('SANDBOX_ENERGY_COUNT')}</label>
                  <input
                    className={styles.input}
                    type="number"
                    min={0}
                    value={pokemonMods.energyCount ?? ''}
                    placeholder={t('SANDBOX_LEAVE_EMPTY')}
                    onChange={(e) => {
                      const v = e.target.value === '' ? null : Number(e.target.value);
                      setPokemonMods((m) => ({
                        ...m,
                        energyCount: Number.isFinite(v as number) ? v : null,
                      }));
                    }}
                  />
                </div>
                {pokemonMods.energyCount !== null && pokemonMods.energyCount > 0 ? (
                  <div className={styles.formGroup}>
                    <label>{t('SANDBOX_ENERGY_TYPE')}</label>
                    <select
                      className={styles.select}
                      value={selectedEnergyType}
                      onChange={(e) => setSelectedEnergyType(e.target.value)}
                    >
                      <option value="">{t('SANDBOX_SELECT_ENERGY')}</option>
                      {ENERGY_TYPES.map((en) => (
                        <option key={en} value={en}>
                          {en}
                        </option>
                      ))}
                    </select>
                  </div>
                ) : null}
                <div className={styles.section}>
                  <h4>{t('SANDBOX_CONDITIONS')}</h4>
                  {(
                    [
                      ['burned', 'SANDBOX_BURNED'],
                      ['poisoned', 'SANDBOX_POISONED'],
                      ['asleep', 'SANDBOX_ASLEEP'],
                      ['paralyzed', 'SANDBOX_PARALYZED'],
                      ['confused', 'SANDBOX_CONFUSED'],
                    ] as const
                  ).map(([key, labelKey]) => (
                    <div key={key} className={styles.formGroup}>
                      <label>
                        <input
                          type="checkbox"
                          checked={pokemonMods.conditions[key]}
                          onChange={(e) =>
                            setPokemonMods((m) => ({
                              ...m,
                              conditions: { ...m.conditions, [key]: e.target.checked },
                            }))
                          }
                        />{' '}
                        {t(labelKey)}
                      </label>
                    </div>
                  ))}
                </div>
                <button type="button" className={styles.btn} onClick={() => void applyPokemonModifications()}>
                  {t('SANDBOX_APPLY_POKEMON')}
                </button>
              </div>
            ) : null}
          </div>
        </div>
      ) : null}
    </div>
  );
}
