import { PokemonCard } from '../../../game/store/card/pokemon-card';
import { CardType, Stage } from '../../../game/store/card/card-types';
import { State, StoreLike } from '../../../game';
import { Effect } from '../../../game/store/effects/effect';
import { COIN_FLIP_PROMPT, THIS_POKEMON_DOES_DAMAGE_TO_ITSELF, WAS_ATTACK_USED } from '../../../game/store/prefabs/prefabs';
import { FLIP_COIN_FOR_FLY } from '../../../game/store/prefabs/effect-of-attack-prefabs';

export class Staraptor extends PokemonCard {
  public stage: Stage = Stage.STAGE_2;
  public evolvesFrom: string = 'Staravia';
  public hp: number = 100;
  public cardType: CardType[] = [C];
  public weakness = [{ type: L, value: 30 }];
  public resistance = [{ type: F, value: -20 }];
  public retreat = [];

  public attacks = [{
    name: 'Accelerative Dive',
    cost: [C],
    damage: 30,
    text: 'Flip a coin. If tails, this attack does nothing. If heads, prevent all damage done to Staraptor by attacks (both yours and your opponent\'s) until the end of your next turn.'
  },
  {
    name: 'Brave Heart',
    cost: [C, C, C, C],
    damage: 100,
    text: 'Flip a coin. If tails, Staraptor does 100 damage to itself.'
  }];

  public set: string = 'DP';
  public cardImage: string = 'assets/cardback.png';
  public setNumber: string = '16';
  public name: string = 'Staraptor';
  public fullName: string = 'Staraptor DP';

  public reduceEffect(store: StoreLike, state: State, effect: Effect): State {
    // Accelerative Dive
    if (WAS_ATTACK_USED(effect, 0, this)) {
      return FLIP_COIN_FOR_FLY(store, state, effect, this);
    }

    // Brave Heart
    if (WAS_ATTACK_USED(effect, 1, this)) {
      COIN_FLIP_PROMPT(store, state, effect.player, (result) => {
        if (!result) {
          THIS_POKEMON_DOES_DAMAGE_TO_ITSELF(store, state, effect, 100);
        }
      });
    }

    return state;
  }
}
