import { PokemonCard, State, StateUtils, StoreLike } from '../../../game';
import { CardType, Stage } from '../../../game/store/card/card-types';
import { Effect } from '../../../game/store/effects/effect';
import { AFTER_ATTACK, SWITCH_ACTIVE_WITH_BENCHED } from '../../../game/store/prefabs/prefabs';

export class Starly extends PokemonCard {
  public stage: Stage = Stage.BASIC;
  public hp: number = 50;
  public cardType: CardType[] = [C];
  public weakness = [{ type: L, value: +10 }];
  public resistance = [{ type: F, value: -20 }];
  public retreat = [C];

  public attacks = [{
    name: 'Whirlwind',
    cost: [C],
    damage: 10,
    text: 'Your opponent switches the Defending Pokémon with 1 of his or her Benched Pokémon.'
  },
  {
    name: 'Flap',
    cost: [C, C],
    damage: 20,
    text: ''
  }];

  public set: string = 'MD';
  public cardImage: string = 'assets/cardback.png';
  public setNumber: string = '75';
  public name: string = 'Starly';
  public fullName: string = 'Starly MD';

  public reduceEffect(store: StoreLike, state: State, effect: Effect): State {
    // Whirlwind
    if (AFTER_ATTACK(effect, 0, this)) {
      const opponent = StateUtils.getOpponent(state, effect.player);
      SWITCH_ACTIVE_WITH_BENCHED(store, state, opponent);
    }

    return state;
  }
}
