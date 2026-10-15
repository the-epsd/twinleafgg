import { PokemonCard } from '../../../game/store/card/pokemon-card';
import { CardType, Stage } from '../../../game/store/card/card-types';
import { State, StoreLike } from '../../../game';
import { Effect } from '../../../game/store/effects/effect';
import { SWITCH_ACTIVE_WITH_BENCHED, WAS_ATTACK_USED } from '../../../game/store/prefabs/prefabs';

export class Snubbull extends PokemonCard {
  public stage: Stage = Stage.BASIC;
  public hp: number = 60;
  public cardType: CardType[] = [C];
  public weakness = [{ type: F, value: +10 }];
  public retreat = [C];

  public attacks = [{
    name: 'Roar',
    cost: [C],
    damage: 0,
    text: 'Your opponent switches the Defending Pokémon with 1 of his or her Benched Pokémon.'
  },
{
    name: 'Bite',
    cost: [C, C, C],
    damage: 30,
    text: ''
  }];

  public set: string = 'GE';
  public cardImage: string = 'assets/cardback.png';
  public setNumber: string = '84';
  public name: string = 'Snubbull';
  public fullName: string = 'Snubbull GE';

  public reduceEffect(store: StoreLike, state: State, effect: Effect): State {
    // Roar
    if (WAS_ATTACK_USED(effect, 0, this)) {
      SWITCH_ACTIVE_WITH_BENCHED(store, state, effect.opponent);
    }

    return state;
  }
}
