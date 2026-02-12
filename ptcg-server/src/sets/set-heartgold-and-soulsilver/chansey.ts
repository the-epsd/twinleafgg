import { State, StoreLike } from '../../game';
import { CardType, Stage } from '../../game/store/card/card-types';
import { PokemonCard } from '../../game/store/card/pokemon-card';
import { Effect } from '../../game/store/effects/effect';
import { COIN_FLIP_PROMPT, HEAL_X_DAMAGE_FROM_THIS_POKEMON, WAS_ATTACK_USED } from '../../game/store/prefabs/prefabs';

export class Chansey extends PokemonCard {
  public stage: Stage = Stage.BASIC;
  public cardType: CardType = C;
  public hp: number = 90;
  public weakness = [{ type: F }];
  public retreat = [C, C];

  public attacks = [{
    name: 'Pound',
    cost: [C, C],
    damage: 20,
    text: ''
  },
  {
    name: 'Happy Punch',
    cost: [C, C, C],
    damage: 30,
    text: 'Flip a coin. If heads, remove 3 damage counters from Chansey.'
  }];

  public set: string = 'HS';
  public cardImage: string = 'assets/cardback.png';
  public setNumber: string = '58';
  public name: string = 'Chansey';
  public fullName: string = 'Chansey HS';

  public reduceEffect(store: StoreLike, state: State, effect: Effect): State {

    if (WAS_ATTACK_USED(effect, 1, this)) {
      COIN_FLIP_PROMPT(store, state, effect.player, result => {
        if (result) {
          HEAL_X_DAMAGE_FROM_THIS_POKEMON(effect, store, state, 30);
        }
      });
    }

    return state;
  }
}