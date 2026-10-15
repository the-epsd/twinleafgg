import { PokemonCard } from '../../../game/store/card/pokemon-card';
import { CardType, Stage } from '../../../game/store/card/card-types';
import { State, StoreLike } from '../../../game';
import { Effect } from '../../../game/store/effects/effect';
import { GUST_OPPONENT_BENCHED_POKEMON, WAS_ATTACK_USED } from '../../../game/store/prefabs/prefabs';

export class Glameow extends PokemonCard {
  public stage: Stage = Stage.BASIC;
  public hp: number = 50;
  public cardType: CardType[] = [C];
  public weakness = [{ type: F, value: +10 }];
  public retreat = [C];

  public attacks = [{
    name: 'Captivate',
    cost: [C],
    damage: 0,
    text: 'Switch 1 of your opponent\'s Benched Pokémon with 1 of the Defending Pokémon.'
  },
{
    name: 'Slash',
    cost: [C, C],
    damage: 20,
    text: ''
  }];

  public set: string = 'GE';
  public cardImage: string = 'assets/cardback.png';
  public setNumber: string = '68';
  public name: string = 'Glameow';
  public fullName: string = 'Glameow GE';

  public reduceEffect(store: StoreLike, state: State, effect: Effect): State {
    // Captivate
    if (WAS_ATTACK_USED(effect, 0, this)) {
      const player = effect.player;
      GUST_OPPONENT_BENCHED_POKEMON(store, state, player);
    }

    return state;
  }
}
