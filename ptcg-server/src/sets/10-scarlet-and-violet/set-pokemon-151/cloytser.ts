import { CardType, Stage } from '../../../game/store/card/card-types';
import { PokemonCard } from '../../../game/store/card/pokemon-card';
import { Effect } from '../../../game/store/effects/effect';

import { State } from '../../../game/store/state/state';
import { StoreLike } from '../../../game/store/store-like';
import { WAS_ATTACK_USED } from '../../../game/store/prefabs/prefabs';

export class Cloyster extends PokemonCard {
  public regulationMark = 'G';
  public stage: Stage = Stage.STAGE_1;
  public evolvesFrom = 'Shellder';
  public cardType: CardType = CardType.WATER;
  public hp: number = 130;
  public weakness = [{ type: CardType.LIGHTNING }];
  public retreat = [CardType.COLORLESS, CardType.COLORLESS, CardType.COLORLESS];

  public attacks = [{
    name: 'Protect Charge',
    cost: [CardType.WATER, CardType.WATER],
    damage: 80,
    text: 'During your opponent\'s next turn, this Pokémon takes 80 less damage from attacks (after applying Weakness and Resistance).'
  }];

  public set: string = 'MEW';
  public cardImage: string = 'assets/cardback.png';
  public setNumber: string = '91';
  public name: string = 'Cloyster';
  public fullName: string = 'Cloyster MEW';
  public reduceEffect(store: StoreLike, state: State, effect: Effect): State {
    if (WAS_ATTACK_USED(effect, 0, this)) {
      effect.player.active.damageReductionNextTurn = 80;
    }

    return state;
  }
}