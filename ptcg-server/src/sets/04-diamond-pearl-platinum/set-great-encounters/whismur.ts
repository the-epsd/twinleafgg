import { PokemonCard } from '../../../game/store/card/pokemon-card';
import { CardType, Stage } from '../../../game/store/card/card-types';
import { State, StoreLike } from '../../../game';
import { Effect } from '../../../game/store/effects/effect';
import { COIN_FLIP_PROMPT, THIS_ATTACK_DOES_X_DAMAGE_TO_EACH_OF_YOUR_OPPONENTS_POKEMON, WAS_ATTACK_USED } from '../../../game/store/prefabs/prefabs';

export class Whismur extends PokemonCard {
  public stage: Stage = Stage.BASIC;
  public hp: number = 50;
  public cardType: CardType[] = [C];
  public weakness = [{ type: F, value: +10 }];
  public retreat = [C];

  public attacks = [{
    name: 'Mumble',
    cost: [],
    damage: 10,
    text: ''
  },
  {
    name: 'Uproar',
    cost: [C],
    damage: 0,
    text: 'Flip a coin. If heads, this attack does 10 damage to each of your opponent\'s Pokémon. (Don\'t apply Weakness and Resistance for Benched Pokémon.)'
  }];

  public set: string = 'GE';
  public cardImage: string = 'assets/cardback.png';
  public setNumber: string = '94';
  public name: string = 'Whismur';
  public fullName: string = 'Whismur GE';

  public reduceEffect(store: StoreLike, state: State, effect: Effect): State {
    // Uproar
    if (WAS_ATTACK_USED(effect, 1, this)) {
      COIN_FLIP_PROMPT(store, state, effect.player, result => {
        if (result) {
          THIS_ATTACK_DOES_X_DAMAGE_TO_EACH_OF_YOUR_OPPONENTS_POKEMON(10, effect, store, state);
        }
      });
    }

    return state;
  }
}
