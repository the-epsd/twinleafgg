import { PokemonCard } from '../../../game/store/card/pokemon-card';
import { Stage, CardType } from '../../../game/store/card/card-types';
import { StoreLike, State } from '../../../game';
import { Effect } from '../../../game/store/effects/effect';
import { WAS_ATTACK_USED } from '../../../game/store/prefabs/prefabs';
import { FLIP_A_COIN_IF_HEADS_DEAL_MORE_DAMAGE } from '../../../game/store/prefabs/attack-effects';

export class PikachuLibre extends PokemonCard {
  public stage: Stage = Stage.BASIC;
  public cardType: CardType[] = [L];
  public hp: number = 80;
  public weakness = [{ type: F }];
  public resistance = [{ type: M, value: -20 }];
  public retreat = [C];

  public attacks = [{
    name: 'Quick Attack',
    cost: [C, C],
    damage: 10,
    damageCalculation: '+',
    text: 'Flip a coin. If heads, this attack does 30 more damage.'
  },
  {
    name: 'Flying Elekick',
    cost: [L, C, C],
    damage: 50,
    text: ''
  }];

  public set: string = 'TK9P';
  public setNumber: string = '30';
  public cardImage: string = 'assets/cardback.png';
  public name: string = 'Pikachu Libre';
  public fullName: string = 'Pikachu Libre TK9P';

  public reduceEffect(store: StoreLike, state: State, effect: Effect): State {
    // Quick Attack
    if (WAS_ATTACK_USED(effect, 0, this)) {
      FLIP_A_COIN_IF_HEADS_DEAL_MORE_DAMAGE(store, state, effect, 30);
    }

    return state;
  }
}
