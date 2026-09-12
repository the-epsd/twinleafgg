import { CardType, Player, PlayerType, PokemonCard, Stage, State, StateUtils, StoreLike } from '../../../game';
import { CheckAttackCostEffect } from '../../../game/store/effects/check-effects';
import { DealDamageEffect, PutDamageEffect } from '../../../game/store/effects/attack-effects';
import { Effect } from '../../../game/store/effects/effect';
import { PowerType } from '../../../game/store/card/pokemon-types';
import { IS_ABILITY_BLOCKED, WAS_ATTACK_USED } from '../../../game/store/prefabs/prefabs';
import { GamePhase } from '../../../game/store/state/state';
import { EndTurnEffect } from '../../../game/store/effects/game-phase-effects';


const MONKEY_TRIO_NAMES = ['Simisage', 'Simisear', 'Simipour'];

function hasMonkeyTrioInPlay(player: Player): boolean {
  const found = new Set<string>();
  player.forEachPokemon(PlayerType.BOTTOM_PLAYER, (_cardList, pokemonCard) => {
    if (MONKEY_TRIO_NAMES.includes(pokemonCard.name)) {
      found.add(pokemonCard.name);
    }
  });
  return found.size === MONKEY_TRIO_NAMES.length;
}

export class Simisage extends PokemonCard {
  public stage: Stage = Stage.STAGE_1;
  public evolvesFrom = 'Pansage';
  public hp: number = 100;
  public cardType: CardType[] = [G];
  public weakness = [{ type: R }];
  public resistance = [];
  public retreat = [C];

  public readonly ARM_THRUST_NEEDLE_MARKER = 'SIMISAGE_ARM_THRUST_NEEDLE_MARKER';
  public readonly CLEAR_ARM_THRUST_NEEDLE_MARKER = 'SIMISAGE_ARM_THRUST_NEEDLE_MARKER';

  public powers = [{
    name: 'Monkey Trio',
    powerType: PowerType.ABILITY,
    text: 'If you have Simisage, Simisear, and Simipour in play, ignore all [C] Energy in the costs of attacks used by this Pokémon.',
  }];

  public attacks = [{
    name: 'Arm Thrust Needle',
    cost: [G, C, C],
    damage: 100,
    text: 'During your opponent\'s next turn, prevent all damage done to this Pokémon by attacks from Pokémon that have an Ability, except any Simisage.',
  }];

  public regulationMark: string = 'G';
  public set: string = 'PAR';
  public cardImage: string = 'assets/cardback.png';
  public setNumber: string = '5';
  public name: string = 'Simisage';
  public fullName: string = 'Simisage PAR';

  public reduceEffect(store: StoreLike, state: State, effect: Effect): State {
    // Monkey Trio
    if (effect instanceof CheckAttackCostEffect) {
      if (effect.player.active.getPokemonCard() !== this) {
        return state;
      }
      const player = effect.player;
      if (!StateUtils.isPokemonInPlay(player, this)) {
        return state;
      }
      if (IS_ABILITY_BLOCKED(store, state, player, this)) {
        return state;
      }
      if (!hasMonkeyTrioInPlay(player)) {
        return state;
      }
      effect.cost = effect.cost.filter(c => c !== CardType.COLORLESS);
    }

    // Attack 1: Arm Thrust Needle
    // Ref: set-chaos-rising/deoxys3.ts (Psy Protect)
    if (WAS_ATTACK_USED(effect, 0, this)) {
      const player = effect.player;
      const opponent = StateUtils.getOpponent(state, player)

      player.active.marker.addMarker(this.ARM_THRUST_NEEDLE_MARKER, this, 'attack')
      opponent.marker.addMarker(this.CLEAR_ARM_THRUST_NEEDLE_MARKER, this, 'attack')
    }

    // Prevent damage from Pokemon with Abilities (during opponent's next turn)
    // Ref: set-twilight-masquerade/cornerstone-mask-ogerpon-ex.ts (prevent damage from source with ability)
    if (
      effect instanceof DealDamageEffect &&
      effect.target.cards.includes(this) &&
      effect.target.getPokemonCard() === this
    ) {
      if (state.phase !== GamePhase.ATTACK) {
        return state;
      }
      const defender = StateUtils.findOwner(state, effect.target);
      if (IS_ABILITY_BLOCKED(store, state, defender, this)) {
        return state;
      }
      if (!effect.target.marker.hasMarker(this.ARM_THRUST_NEEDLE_MARKER, this)) {
        return state;
      }
      const sourceCard = effect.source.getPokemonCard();
      if (sourceCard?.name === 'Simisage') {
        return state;
      }
      if (!sourceCard || !sourceCard.powers.some((p) => p.powerType === PowerType.ABILITY)) {
        return state;
      }
      effect.damage = 0;
    }

    if (
      effect instanceof PutDamageEffect &&
      effect.target.cards.includes(this) &&
      effect.target.getPokemonCard() === this
    ) {
      if (state.phase !== GamePhase.ATTACK) {
        return state;
      }
      const defender = StateUtils.findOwner(state, effect.target);
      if (IS_ABILITY_BLOCKED(store, state, defender, this)) {
        return state;
      }
      if (!effect.target.marker.hasMarker(this.ARM_THRUST_NEEDLE_MARKER, this)) {
        return state;
      }
      const sourceCard = effect.source.getPokemonCard();
      if (sourceCard?.name === 'Simisage') {
        return state;
      }
      if (!sourceCard || !sourceCard.powers.some((p) => p.powerType === PowerType.ABILITY)) {
        return state;
      }
      effect.preventDefault = true;
    }

    // Cleanup at end of opponent's turn
    if (
      effect instanceof EndTurnEffect &&
      effect.player.marker.hasMarker(this.CLEAR_ARM_THRUST_NEEDLE_MARKER, this)
    ) {
      effect.player.marker.removeMarker(this.CLEAR_ARM_THRUST_NEEDLE_MARKER, this);
      const opponent = StateUtils.getOpponent(state, effect.player);
      opponent.forEachPokemon(PlayerType.TOP_PLAYER, (cardList) => {
        cardList.marker.removeMarker(this.ARM_THRUST_NEEDLE_MARKER, this);
      });
    }

    return state;
  }
}