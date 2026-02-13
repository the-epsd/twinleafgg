import { Store } from '../../game/store/store';
import { State } from '../../game/store/state/state';
import { PokemonCard } from '../../game/store/card/pokemon-card';
import { PokemonCardList } from '../../game/store/state/pokemon-card-list';
import { SpecialCondition } from '../../game/store/card/card-types';
import { AttackAction, PassTurnAction, UseAbilityAction } from '../../game/store/actions/game-actions';
import { PlayCardAction, PlayerType, SlotType, CardTarget } from '../../game/store/actions/play-card-action';
import { Card } from '../../game/store/card/card';
import { AttackEffect } from '../../game/store/effects/game-effects';
import { DealDamageEffect, PutDamageEffect } from '../../game/store/effects/attack-effects';
import { SetupGameResult } from './test-helpers';

// ── Action helpers ──

export function useAttack(store: Store, state: State, playerIndex: number, attackName: string): void {
  const player = state.players[playerIndex];
  store.dispatch(new AttackAction(player.id, attackName));
}

export function useAbility(store: Store, state: State, playerIndex: number, abilityName: string): void {
  const player = state.players[playerIndex];

  // Search active and bench for the card with this ability
  let foundTarget: CardTarget | undefined;

  const pokemonCard = player.active.getPokemonCard();
  if (pokemonCard && pokemonCard.powers.some(p => p.name === abilityName)) {
    foundTarget = { player: PlayerType.BOTTOM_PLAYER, slot: SlotType.ACTIVE, index: 0 };
  }

  if (!foundTarget) {
    for (let i = 0; i < player.bench.length; i++) {
      const benchPokemon = player.bench[i].getPokemonCard();
      if (benchPokemon && benchPokemon.powers.some(p => p.name === abilityName)) {
        foundTarget = { player: PlayerType.BOTTOM_PLAYER, slot: SlotType.BENCH, index: i };
        break;
      }
    }
  }

  if (!foundTarget) {
    throw new Error(`No Pokemon with ability "${abilityName}" found for player ${playerIndex}`);
  }

  store.dispatch(new UseAbilityAction(player.id, abilityName, foundTarget));
}

export function endTurn(store: Store, state: State): void {
  const player = state.players[state.activePlayer];
  store.dispatch(new PassTurnAction(player.id));
}

export function playTrainerCard(store: Store, state: State, playerIndex: number, cardFullName: string): void {
  const player = state.players[playerIndex];
  const handIndex = player.hand.cards.findIndex(c => c.fullName === cardFullName);
  if (handIndex === -1) {
    throw new Error(`Card "${cardFullName}" not found in player ${playerIndex}'s hand`);
  }
  const target: CardTarget = { player: PlayerType.BOTTOM_PLAYER, slot: SlotType.ACTIVE, index: 0 };
  store.dispatch(new PlayCardAction(player.id, handIndex, target));
}

// ── Reusable effect factories ──

export function createDamageEffect(
  game: SetupGameResult,
  attackerIndex: number,
  options?: { benchIndex?: number; damage?: number }
): PutDamageEffect {
  const attacker = game.state.players[attackerIndex];
  const defender = game.state.players[1 - attackerIndex];
  const damage = options?.damage ?? 30;
  const attack = { name: 'Test Attack', cost: [], damage, text: '' };
  const attackEffect = new AttackEffect(attacker, defender, attack);
  const putDamage = new PutDamageEffect(attackEffect, damage);
  if (options?.benchIndex !== undefined) {
    putDamage.target = defender.bench[options.benchIndex];
  }
  return putDamage;
}

export function createActiveDamageEffect(
  game: SetupGameResult,
  attackerIndex: number,
  options?: { damage?: number }
): DealDamageEffect {
  const attacker = game.state.players[attackerIndex];
  const defender = game.state.players[1 - attackerIndex];
  const damage = options?.damage ?? 30;
  const attack = { name: 'Test Attack', cost: [], damage, text: '' };
  const attackEffect = new AttackEffect(attacker, defender, attack);
  return new DealDamageEffect(attackEffect, damage);
}

export function createAttackEffect(
  game: SetupGameResult,
  attackerIndex: number,
  options?: { damage?: number }
): AttackEffect {
  const attacker = game.state.players[attackerIndex];
  const defender = game.state.players[1 - attackerIndex];
  const damage = options?.damage ?? 30;
  const attack = { name: 'Test Attack', cost: [], damage, text: '' };
  return new AttackEffect(attacker, defender, attack);
}

// ── Query helpers ──

function getSlot(state: State, playerIndex: number, slot?: 'active' | number): PokemonCardList {
  const player = state.players[playerIndex];
  if (slot === undefined || slot === 'active') {
    return player.active;
  }
  return player.bench[slot];
}

export function getDamage(state: State, playerIndex: number, slot?: 'active' | number): number {
  return getSlot(state, playerIndex, slot).damage;
}

export function getEnergyCount(state: State, playerIndex: number, slot?: 'active' | number): number {
  return getSlot(state, playerIndex, slot).energies.cards.length;
}

type ZoneName = 'hand' | 'deck' | 'discard' | 'lostzone';

function getZoneCards(state: State, playerIndex: number, zone: ZoneName): Card[] {
  const player = state.players[playerIndex];
  switch (zone) {
    case 'hand': return player.hand.cards;
    case 'deck': return player.deck.cards;
    case 'discard': return player.discard.cards;
    case 'lostzone': return player.lostzone.cards;
  }
}

export function getZoneCount(state: State, playerIndex: number, zone: ZoneName): number {
  return getZoneCards(state, playerIndex, zone).length;
}

export function hasSpecialCondition(state: State, playerIndex: number, slot: 'active' | number | undefined, condition: SpecialCondition): boolean {
  return getSlot(state, playerIndex, slot).specialConditions.includes(condition);
}

export function zoneContains(state: State, playerIndex: number, zone: ZoneName, cardFullName: string): boolean {
  return getZoneCards(state, playerIndex, zone).some(c => c.fullName === cardFullName);
}

export function getActivePokemon(state: State, playerIndex: number): PokemonCard {
  const pokemonCard = state.players[playerIndex].active.getPokemonCard();
  if (!pokemonCard) {
    throw new Error(`No active Pokemon for player ${playerIndex}`);
  }
  return pokemonCard;
}
