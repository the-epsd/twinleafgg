import { Vector3 } from 'three';
import {
  Player,
  PlayerType,
  SlotType,
  Stage,
  SuperType,
  TrainerType,
  TrainerCard,
  type Card,
  type CardTarget,
  type GameSettings,
} from 'ptcg-server';
import { DropZoneType } from './board-3d-drop-zone';
import { ZONE_POSITIONS } from './board-3d-zone-positions';

export function trainerTypeIsSupporter(tt: TrainerType | undefined | null): boolean {
  if (tt === undefined || tt === null) {
    return false;
  }
  if (tt === TrainerType.SUPPORTER) {
    return true;
  }
  if (typeof tt === 'string' && (tt as string).toUpperCase() === 'SUPPORTER') {
    return true;
  }
  return Number(tt) === TrainerType.SUPPORTER;
}

export function cardIsSupporter(card: Card | undefined | null): boolean {
  if (!card || card.superType !== SuperType.TRAINER) {
    return false;
  }
  return trainerTypeIsSupporter((card as TrainerCard).trainerType);
}

/**
 * Item-style Fossils (and similar) are Trainer cards in hand but play as Basic Pokémon onto the bench.
 * Matches server cards that set `power.isFossil` on a power (see e.g. Rare Fossil, Antique Shield Fossil).
 */
export function cardIsFossilLikeTrainer(card: Card | undefined | null): boolean {
  if (!card) {
    return false;
  }
  const powers = (card as TrainerCard).powers;
  if (!Array.isArray(powers)) {
    return false;
  }
  return powers.some(p => p.isFossil === true);
}

/** Subset of {@link GameSettings} needed for 3D hand→bench targeting (sandbox “all Pokémon as Basic”). */
export type HandPlayPokemonZoneGameSettings = Pick<GameSettings, 'sandboxMode' | 'sandboxAllPokemonBasic'> | null | undefined;

/** True when this card should use bench/active drop targets like a Basic Pokémon (includes trainer-printed fossils). */
export function cardPlaysAsBasicPokemonFromHand(
  card: Card | undefined | null,
  gameSettings?: HandPlayPokemonZoneGameSettings,
): boolean {
  if (!card) {
    return false;
  }
  if (
    gameSettings?.sandboxMode &&
    gameSettings.sandboxAllPokemonBasic &&
    card.superType === SuperType.POKEMON
  ) {
    return true;
  }
  if (card.superType === SuperType.POKEMON) {
    const stage = (card as { stage?: Stage }).stage;
    return stage === Stage.BASIC;
  }
  if (!cardIsFossilLikeTrainer(card)) {
    return false;
  }
  const stage = (card as { stage?: Stage }).stage;
  return stage === undefined || stage === Stage.BASIC;
}

/** Trainer cards played from hand onto the large BOARD zone (items, supporters — not stadium/tools). */
export function cardIsTrainerBoardHandPlay(card: Card | undefined | null): boolean {
  if (!card || card.superType !== SuperType.TRAINER) {
    return false;
  }
  if (cardIsFossilLikeTrainer(card)) {
    return false;
  }
  const tt = (card as TrainerCard).trainerType;
  if (tt === TrainerType.STADIUM || tt === TrainerType.TOOL) {
    return false;
  }
  if (typeof tt === 'string') {
    const u = (tt as string).toUpperCase();
    if (u === 'STADIUM' || u === 'TOOL') {
      return false;
    }
  }
  const ttNum = Number(tt);
  if (!Number.isNaN(ttNum) && (ttNum === TrainerType.STADIUM || ttNum === TrainerType.TOOL)) {
    return false;
  }
  return true;
}

/** Top discard mesh id (matches Board3dStackService / syncPlayer). */
export function discardTopMeshIdForPlayTarget(
  zone: CardTarget,
  bottomPlayer: Player,
  topPlayer: Player,
): string {
  const isBottom = zone.player === PlayerType.BOTTOM_PLAYER;
  const player = isBottom ? bottomPlayer : topPlayer;
  const position = isBottom ? 'bottomPlayer' : 'topPlayer';
  const playerPrefix = `${position}_${player.id}`;
  return `${playerPrefix}_discard_top`;
}

/**
 * 3D mesh id used by Board3dStateSyncService for the given play target (must match syncPlayer naming).
 *
 * Supporters can be dropped on the large BOARD zone; game state still uses the supporter slot mesh id.
 */
export function board3dMeshIdForPlayTarget(
  zone: CardTarget,
  dropZoneType: DropZoneType,
  bottomPlayer: Player,
  topPlayer: Player,
  trainerType?: TrainerType,
): string | null {
  const isBottom = zone.player === PlayerType.BOTTOM_PLAYER;
  const player = isBottom ? bottomPlayer : topPlayer;
  const position = isBottom ? 'bottomPlayer' : 'topPlayer';
  const playerPrefix = `${position}_${player.id}`;

  if (zone.slot === SlotType.ACTIVE) {
    return `${playerPrefix}_active`;
  }
  if (zone.slot === SlotType.BENCH) {
    return `${playerPrefix}_bench_${zone.index}`;
  }
  if (zone.slot === SlotType.BOARD) {
    if (dropZoneType === DropZoneType.STADIUM) {
      return 'shared_stadium';
    }
    if (dropZoneType === DropZoneType.SUPPORTER) {
      return `${playerPrefix}_supporter`;
    }
    if (dropZoneType === DropZoneType.BOARD && trainerTypeIsSupporter(trainerType)) {
      return `${playerPrefix}_supporter`;
    }
  }
  return null;
}

/** World landing target for hand-play flight when mesh id is the supporter slot (matches state sync). */
export function worldPositionForSupporterMeshId(meshId: string | null): Vector3 | null {
  if (!meshId || !meshId.endsWith('_supporter')) {
    return null;
  }
  const base =
    meshId.startsWith('bottomPlayer_')
      ? ZONE_POSITIONS.bottomPlayer.supporter
      : meshId.startsWith('topPlayer_')
        ? ZONE_POSITIONS.topPlayer.supporter
        : null;
  if (!base) {
    return null;
  }
  const w = base.clone();
  w.y = Math.max(w.y, 0.08);
  return w;
}
