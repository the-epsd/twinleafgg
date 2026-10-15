import { PokemonCard } from '../../../game/store/card/pokemon-card';
import { CardType, Stage } from '../../../game/store/card/card-types';
import { State, StoreLike } from '../../../game';
import { Effect } from '../../../game/store/effects/effect';
import { AFTER_ATTACK, SWITCH_ACTIVE_WITH_BENCHED } from '../../../game/store/prefabs/prefabs';

export class Growlithe extends PokemonCard {
  public stage: Stage = Stage.BASIC;
  public hp: number = 70;
  public cardType: CardType[] = [R];
  public weakness = [{ type: W, value: +20 }];
  public retreat = [C, C];

  public attacks = [{
    name: 'Roar',
    cost: [C],
    damage: 0,
    text: 'Your opponent switches the Defending Pokémon with 1 of his or her Benched Pokémon.'
  },
  {
    name: 'Dig Claws',
    cost: [R, C],
    damage: 20,
    text: ''
  }];

  public set: string = 'SW';
  public cardImage: string = 'assets/cardback.png';
  public setNumber: string = '89';
  public name: string = 'Growlithe';
  public fullName: string = 'Growlithe SW';

  public reduceEffect(store: StoreLike, state: State, effect: Effect): State {
    // Roar
    if (AFTER_ATTACK(effect, 0, this)) {
      SWITCH_ACTIVE_WITH_BENCHED(store, state, effect.opponent);
    }

    return state;
  }
}
