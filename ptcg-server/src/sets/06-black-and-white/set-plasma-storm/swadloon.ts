import { PokemonCard } from '../../../game/store/card/pokemon-card';
import { Stage, CardType } from '../../../game/store/card/card-types';
import { StoreLike, State } from '../../../game';
import { Effect } from '../../../game/store/effects/effect';
import { WAS_ATTACK_USED, COIN_FLIP_PROMPT } from '../../../game/store/prefabs/prefabs';

export class Swadloon extends PokemonCard {
  public stage: Stage = Stage.STAGE_1;
  public evolvesFrom: string = 'Sewaddle';
  public cardType: CardType = G;
  public hp: number = 80;
  public weakness = [{ type: R }];
  public retreat = [C, C];

  public attacks = [{
    name: 'Swaddle Guard',
    cost: [G],
    damage: 0,
    text: 'During your opponent\'s next turn, any damage done to this Pokémon by attacks is reduced by 40 (after applying Weakness and Resistance).'
  },
  {
    name: 'Surprise Attack',
    cost: [C, C],
    damage: 40,
    text: 'Flip a coin. If tails, this attack does nothing.'
  }];

  public set: string = 'PLS';
  public setNumber: string = '9';
  public cardImage: string = 'assets/cardback.png';
  public name: string = 'Swadloon';
  public fullName: string = 'Swadloon PLS';

  public reduceEffect(store: StoreLike, state: State, effect: Effect): State {
    // Swaddle Guard
    if (WAS_ATTACK_USED(effect, 0, this)) {
      effect.player.active.damageReductionNextTurn = 40;
    }

    // Surprise Attack
    if (WAS_ATTACK_USED(effect, 1, this)) {
      COIN_FLIP_PROMPT(store, state, effect.player, result => {
        if (!result) {
          effect.damage = 0;
        }
      });
    }

    return state;
  }
}
