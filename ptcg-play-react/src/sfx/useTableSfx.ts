import { useEffect, useRef } from 'react';
import {
  GameLog,
  GamePhase,
  GameWinner,
  SpecialCondition,
  type Player,
  type PokemonCardList,
  type StateLog,
} from 'ptcg-server';
import { useSettings } from '../context/SettingsContext';
import type { LocalGameState } from '../table/types/localGameState';
import { computeMatchSplashState } from '../table/end-game/computeGameOverPresentation';
import { configureSfx, playSfx } from './playSfx';
import type { SfxId } from './sfxAssets';

function maxLogId(logs: StateLog[]): number {
  let max = 0;
  for (const log of logs) {
    if (log.id > max) {
      max = log.id;
    }
  }
  return max;
}

function pokemonSlots(player: Player): PokemonCardList[] {
  return [player.active, ...player.bench];
}

function totalDamage(players: Player[]): number {
  let sum = 0;
  for (const player of players) {
    for (const slot of pokemonSlots(player)) {
      if (slot.cards.length > 0) {
        sum += slot.damage ?? 0;
      }
    }
  }
  return sum;
}

type ConditionSnapshot = Map<string, Set<SpecialCondition>>;

function slotKey(playerId: number, zone: string, index: number): string {
  return `${playerId}:${zone}:${index}`;
}

function snapshotConditions(players: Player[]): ConditionSnapshot {
  const map: ConditionSnapshot = new Map();
  for (const player of players) {
    const active = player.active;
    if (active.cards.length > 0) {
      map.set(slotKey(player.id, 'active', 0), new Set(active.specialConditions ?? []));
    }
    player.bench.forEach((bench, index) => {
      if (bench.cards.length > 0) {
        map.set(slotKey(player.id, 'bench', index), new Set(bench.specialConditions ?? []));
      }
    });
  }
  return map;
}

function specialConditionSfx(condition: SpecialCondition): SfxId | null {
  switch (condition) {
    case SpecialCondition.ASLEEP:
      return 'specialAsleep';
    case SpecialCondition.BURNED:
      return 'specialBurn';
    case SpecialCondition.CONFUSED:
      return 'specialConfused';
    case SpecialCondition.PARALYZED:
      return 'specialParalyze';
    case SpecialCondition.POISONED:
      return 'specialPoison';
    default:
      return null;
  }
}

function isLocalPlayerLog(log: StateLog, localPlayer: Player | undefined): boolean {
  if (!localPlayer) {
    return false;
  }
  const name = log.params?.name;
  return typeof name === 'string' && name === localPlayer.name;
}

function playLogSfx(
  log: StateLog,
  localGame: LocalGameState,
  clientId: number,
): { playedHeal: boolean } {
  let playedHeal = false;
  const localPlayer = localGame.state.players.find((p) => p.id === clientId);
  const isLocal = isLocalPlayerLog(log, localPlayer);

  switch (log.message) {
    case GameLog.LOG_PLAYER_DRAWS_CARD:
      playSfx('carddraw');
      break;
    case GameLog.LOG_PLAYER_DEALS_DAMAGE:
    case GameLog.LOG_PLAYER_PLACES_DAMAGE_COUNTERS:
      playSfx('damagetoken');
      break;
    case GameLog.LOG_PLAYER_HEALS_POKEMON:
      playSfx('heal');
      playedHeal = true;
      break;
    case GameLog.LOG_POKEMON_KO:
      playSfx(localGame.state.phase === GamePhase.ATTACK ? 'knockoutinattack' : 'knockout');
      break;
    case GameLog.LOG_PLAYER_PLAYS_ITEM:
    case GameLog.LOG_PLAYER_PLAYS_SUPPORTER:
    case GameLog.LOG_PLAYER_PLAYS_STADIUM:
    case GameLog.LOG_PLAYER_PLAYS_TOOL:
      playSfx('playtrainer');
      break;
    case GameLog.LOG_PLAYER_ENDS_TURN:
      playSfx(isLocal ? 'playerturnend' : 'opponentturnend');
      break;
    case GameLog.LOG_TURN: {
      const active = localGame.state.players[localGame.state.activePlayer];
      if (active) {
        playSfx(active.id === clientId ? 'playerturnbegin' : 'opponentturnbegin');
      }
      break;
    }
    case GameLog.LOG_PLAYER_SWITCHES_POKEMON_TO_ACTIVE:
    case GameLog.LOG_PLAYER_RETREATS:
    case GameLog.LOG_PLAYER_GUSTS_POKEMON_TO_ACTIVE:
      playSfx('newactivepokemon');
      break;
    default:
      break;
  }

  return { playedHeal };
}

export type UseTableSfxOptions = {
  localGame: LocalGameState | null;
  clientId: number;
};

/**
 * Plays table SFX from newly appended game logs and board state diffs.
 * Skips the initial snapshot (join / replay load) and resets when the local game id changes.
 */
export function useTableSfx({ localGame, clientId }: UseTableSfxOptions): void {
  const { sfxEnabled, sfxVolume } = useSettings();
  const lastLogIdRef = useRef(0);
  const primedRef = useRef(false);
  const gameKeyRef = useRef<number | null>(null);
  const conditionsRef = useRef<ConditionSnapshot>(new Map());
  const damageTotalRef = useRef(0);
  const winLosePlayedRef = useRef(false);

  useEffect(() => {
    configureSfx({ enabled: sfxEnabled, volume: sfxVolume });
  }, [sfxEnabled, sfxVolume]);

  useEffect(() => {
    if (!localGame) {
      primedRef.current = false;
      gameKeyRef.current = null;
      lastLogIdRef.current = 0;
      conditionsRef.current = new Map();
      damageTotalRef.current = 0;
      winLosePlayedRef.current = false;
      return;
    }

    if (gameKeyRef.current !== localGame.localId) {
      gameKeyRef.current = localGame.localId;
      primedRef.current = false;
      lastLogIdRef.current = maxLogId(localGame.logs);
      conditionsRef.current = snapshotConditions(localGame.state.players);
      damageTotalRef.current = totalDamage(localGame.state.players);
      winLosePlayedRef.current = false;
      primedRef.current = true;
      return;
    }

    if (!primedRef.current) {
      lastLogIdRef.current = maxLogId(localGame.logs);
      conditionsRef.current = snapshotConditions(localGame.state.players);
      damageTotalRef.current = totalDamage(localGame.state.players);
      primedRef.current = true;
      return;
    }

    // Replay scrub: large backward jump — re-prime without playing.
    const nextMax = maxLogId(localGame.logs);
    if (nextMax < lastLogIdRef.current) {
      lastLogIdRef.current = nextMax;
      conditionsRef.current = snapshotConditions(localGame.state.players);
      damageTotalRef.current = totalDamage(localGame.state.players);
      return;
    }

    let playedHeal = false;
    for (const log of localGame.logs) {
      if (log.id <= lastLogIdRef.current) {
        continue;
      }
      const result = playLogSfx(log, localGame, clientId);
      if (result.playedHeal) {
        playedHeal = true;
      }
    }
    lastLogIdRef.current = nextMax;

    const nextConditions = snapshotConditions(localGame.state.players);
    for (const [key, conditions] of nextConditions) {
      const prev = conditionsRef.current.get(key);
      for (const condition of conditions) {
        if (!prev?.has(condition)) {
          const id = specialConditionSfx(condition);
          if (id) {
            playSfx(id);
          }
        }
      }
    }
    conditionsRef.current = nextConditions;

    const nextDamage = totalDamage(localGame.state.players);
    if (nextDamage < damageTotalRef.current && !playedHeal) {
      playSfx('damagetokenremoved');
    }
    damageTotalRef.current = nextDamage;

    if (
      localGame.state.phase === GamePhase.FINISHED &&
      !winLosePlayedRef.current &&
      localGame.state.winner !== GameWinner.NONE
    ) {
      winLosePlayedRef.current = true;
      if (localGame.state.winner === GameWinner.DRAW) {
        return;
      }
      const { isWinner } = computeMatchSplashState(localGame, clientId);
      playSfx(isWinner ? 'gamewin' : 'gamelose');
    }
  }, [localGame, clientId]);
}
