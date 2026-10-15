import { PokemonCard } from '../../../game/store/card/pokemon-card';
import { CardType, Stage } from '../../../game/store/card/card-types';
import { PowerType, State, StateUtils, StoreLike } from '../../../game';
import { Effect } from '../../../game/store/effects/effect';
import { CheckPokemonTypeEffect } from '../../../game/store/effects/check-effects';
import { GET_PLAYER_PRIZES, IS_ABILITY_BLOCKED, WAS_ATTACK_USED } from '../../../game/store/prefabs/prefabs';

export class Carbink extends PokemonCard {
  public stage: Stage = Stage.BASIC;
  public hp: number = 90;
  public cardType: CardType[] = [F];
  public weakness = [{ type: G }];
  public retreat = [C];

  public powers = [{
    name: 'Double Type',
    powerType: PowerType.ABILITY,
    text: 'As long as this Pokémon is in play, it is Fighting and Psychic type.'
  }];

  public attacks = [{
    name: 'Counter Jewel',
    cost: [F, F, C],
    damage: 70,
    damageCalculation: '+',
    text: 'If your opponent has 2 or fewer Prize cards remaining, this attack does 100 more damage.'
  }];

  public regulationMark = 'J';
  public set: string = 'ASC';
  public cardImage: string = 'assets/cardback.png';
  public setNumber: string = '117';
  public name: string = 'Carbink';
  public fullName: string = 'Carbink ASC';

  public reduceEffect(store: StoreLike, state: State, effect: Effect): State {
    // Double Type
    if (effect instanceof CheckPokemonTypeEffect && effect.target.getPokemonCard() === this) {
      const player = StateUtils.findOwner(state, effect.target);
      if (!IS_ABILITY_BLOCKED(store, state, player, this)) {
        effect.cardTypes = [F, P];
      }
      return state;
    }

    // Counter Jewel
    if (WAS_ATTACK_USED(effect, 0, this)) {
      const opponent = StateUtils.getOpponent(state, effect.player);
      if (GET_PLAYER_PRIZES(opponent).length <= 2) {
        effect.damage += 100;
      }
    }

    return state;
  }
}
