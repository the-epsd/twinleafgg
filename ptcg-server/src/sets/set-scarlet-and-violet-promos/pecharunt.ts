import { PokemonCard } from '../../game/store/card/pokemon-card';
import { Stage, CardType, SpecialCondition } from '../../game/store/card/card-types';
import { PowerType } from '../../game/store/card/pokemon-types';
import { StoreLike, State, StateUtils } from '../../game';
import { Effect } from '../../game/store/effects/effect';
import { BetweenTurnsEffect } from '../../game/store/effects/game-phase-effects';
import { PowerEffect } from '../../game/store/effects/game-effects';
import { MarkerConstants } from '../../game/store/markers/marker-constants';
import { WAS_ATTACK_USED, BLOCK_RETREAT, BLOCK_RETREAT_IF_MARKER, REMOVE_MARKER_FROM_ACTIVE_AT_END_OF_TURN } from '../../game/store/prefabs/prefabs';
import { YOUR_OPPPONENTS_ACTIVE_POKEMON_IS_NOW_POISIONED } from '../../game/store/prefabs/attack-effects';

export class Pecharunt extends PokemonCard {
  public stage: Stage = Stage.BASIC;
  public cardType: CardType = D;
  public hp: number = 80;
  public weakness = [{ type: F }];
  public retreat = [C];

  public powers = [{
    name: 'Toxic Subjugation',
    powerType: PowerType.ABILITY,
    text: 'As long as this Pokémon is in the Active Spot, put 5 more damage counters on your opponent\'s Poisoned Pokémon during Pokémon Checkup.'
  }];

  public attacks = [{
    name: 'Poison Chain',
    cost: [D, C],
    damage: 10,
    text: 'Your opponent\'s Active Pokémon is now Poisoned. During your opponent\'s next turn, that Pokémon can\'t retreat.'
  }];

  public regulationMark = 'H';
  public set: string = 'SVP';
  public name: string = 'Pecharunt';
  public fullName: string = 'Pecharunt SVP';
  public cardImage: string = 'assets/cardback.png';
  public setNumber: string = '149';

  public reduceEffect(store: StoreLike, state: State, effect: Effect): State {
    // Toxic Subjugation
    if (effect instanceof BetweenTurnsEffect) {
      const currentPlayer = effect.player;
      const opponent = StateUtils.getOpponent(state, currentPlayer);

      let pecharuntOwner = null;
      [currentPlayer, opponent].forEach(player => {
        if (player.active.cards[0] === this) {
          pecharuntOwner = player;
        }
      });

      if (!pecharuntOwner) {
        return state;
      }

      try {
        const stub = new PowerEffect(pecharuntOwner, {
          name: 'test',
          powerType: PowerType.ABILITY,
          text: ''
        }, this);
        store.reduceEffect(state, stub);
      } catch {
        return state;
      }

      const pecharuntOpponent = StateUtils.getOpponent(state, pecharuntOwner);
      if (effect.player === pecharuntOpponent && pecharuntOpponent.active.specialConditions.includes(SpecialCondition.POISONED)) {
        effect.poisonDamage += 50;
      }
    }

    // Poison Chain
    if (WAS_ATTACK_USED(effect, 0, this)) {
      YOUR_OPPPONENTS_ACTIVE_POKEMON_IS_NOW_POISIONED(store, state, effect);
      return BLOCK_RETREAT(store, state, effect, this);
    }

    BLOCK_RETREAT_IF_MARKER(effect, MarkerConstants.DEFENDING_POKEMON_CANNOT_RETREAT_MARKER, this);
    REMOVE_MARKER_FROM_ACTIVE_AT_END_OF_TURN(effect, MarkerConstants.DEFENDING_POKEMON_CANNOT_RETREAT_MARKER, this);

    return state;
  }
}