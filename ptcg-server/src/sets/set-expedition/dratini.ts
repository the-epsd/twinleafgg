import { State, StoreLike } from '../../game';
import { CardType, Stage } from '../../game/store/card/card-types';
import { PokemonCard } from '../../game/store/card/pokemon-card';
import { Effect } from '../../game/store/effects/effect';
import { COIN_FLIP_PROMPT, WAS_ATTACK_USED } from '../../game/store/prefabs/prefabs';

export class Dratini extends PokemonCard {
  public stage: Stage = Stage.BASIC;
  public cardType: CardType = C;
  public hp: number = 40;
  public retreat = [C];

  public attacks = [{
    name: 'Dragon Smash',
    cost: [L, W],
    damage: 40,
    text: 'Flip a coin. If tails, this attack does nothing.'
  }];

  public set: string = 'EX';
  public cardImage: string = 'assets/cardback.png';
  public setNumber: string = '107';
  public name: string = 'Dratini';
  public fullName: string = 'Dratini EX';

  public reduceEffect(store: StoreLike, state: State, effect: Effect): State {

    if (WAS_ATTACK_USED(effect, 0, this)) {
      COIN_FLIP_PROMPT(store, state, effect.player, result => {
        if (!result) {
          effect.damage = 0;
        }
      });
    }

    return state;
  }
}