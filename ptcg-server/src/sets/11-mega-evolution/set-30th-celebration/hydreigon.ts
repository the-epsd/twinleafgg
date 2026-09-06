import { PokemonCard } from '../../../game/store/card/pokemon-card';
import { Stage, CardType } from '../../../game/store/card/card-types';
import { StoreLike, State } from '../../../game';
import { Effect } from '../../../game/store/effects/effect';
import { WAS_ATTACK_USED, MULTIPLE_COIN_FLIPS_PROMPT } from '../../../game/store/prefabs/prefabs';
import { DISCARD_AN_ENERGY_FROM_OPPONENTS_ACTIVE_POKEMON } from '../../../game/store/prefabs/attack-effects';

export class Hydreigon extends PokemonCard {
  public stage: Stage = Stage.STAGE_2;
  public evolvesFrom: string = 'Zweilous';
  public hp: number = 170;
  public cardType: CardType[] = [D];
  public weakness = [{ type: G }];
  public retreat = [C, C, C];

  public attacks = [{
    name: 'Tri-Bite',
    cost: [D],
    damage: 0,
    text: 'Toss 3 coins. For each heads, pick an Energy attached to your opponent\'s Active Pokémon and discard it.'
  },
  {
    name: 'Pitch-Black Fangs',
    cost: [D, C],
    damage: 140,
    text: ''
  }];

  public regulationMark: string = 'J';
  public set: string = '30C';
  public cardImage: string = 'assets/cardback.png';
  public setNumber: string = '99';
  public name: string = 'Hydreigon';
  public fullName: string = 'Hydreigon 30C';

  public reduceEffect(store: StoreLike, state: State, effect: Effect): State {
    // Tri-Bite
    if (WAS_ATTACK_USED(effect, 0, this)) {
      MULTIPLE_COIN_FLIPS_PROMPT(store, state, effect.player, 3, results => {
        const heads = results.filter(r => r).length;
        if (heads > 0) {
          DISCARD_AN_ENERGY_FROM_OPPONENTS_ACTIVE_POKEMON(store, state, effect, undefined, heads);
        }
      });
    }

    return state;
  }
}
