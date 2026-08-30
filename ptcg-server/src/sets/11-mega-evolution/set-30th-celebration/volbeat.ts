import { PokemonCard } from '../../../game/store/card/pokemon-card';
import { Stage, CardType } from '../../../game/store/card/card-types';
import { StoreLike, State } from '../../../game';
import { Effect } from '../../../game/store/effects/effect';
import { AFTER_ATTACK, SWITCH_IN_OPPONENT_BENCHED_POKEMON } from '../../../game/store/prefabs/prefabs';

export class Volbeat extends PokemonCard {
  public stage: Stage = Stage.BASIC;
  public hp: number = 80;
  public cardType: CardType[] = [G];
  public weakness = [{ type: R }];
  public retreat = [C];

  public attacks = [{
    name: 'Luring Glow',
    cost: [G],
    damage: 0,
    text: 'Switch in 1 of your opponent\'s Benched Pokémon to the Active Spot.'
  },
  {
    name: 'Bug Buzz',
    cost: [C, C, C],
    damage: 90,
    text: ''
  }];

  public regulationMark: string = 'J';
  public set: string = '30C';
  public cardImage: string = 'assets/cardback.png';
  public setNumber: string = '3';
  public name: string = 'Volbeat';
  public fullName: string = 'Volbeat 30C';

  public reduceEffect(store: StoreLike, state: State, effect: Effect): State {
    // Luring Glow
    if (AFTER_ATTACK(effect, 0, this)) {
      return SWITCH_IN_OPPONENT_BENCHED_POKEMON(store, state, effect.player, {
        allowCancel: false,
        sourceEffect: effect,
      });
    }

    return state;
  }
}
