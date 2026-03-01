import { State, StoreLike } from '../../game';
import { CardType, Stage } from '../../game/store/card/card-types';
import { PokemonCard } from '../../game/store/card/pokemon-card';
import { Effect } from '../../game/store/effects/effect';
import { FLIP_A_COIN_IF_HEADS_DEAL_MORE_DAMAGE, PUT_X_CARDS_FROM_YOUR_DISCARD_PILE_INTO_YOUR_HAND } from '../../game/store/prefabs/attack-effects';
import { WAS_ATTACK_USED } from '../../game/store/prefabs/prefabs';

export class Electrike extends PokemonCard {
  public stage: Stage = Stage.BASIC;
  public cardType: CardType = L;
  public hp: number = 50;
  public weakness = [{ type: F }];
  public resistance = [{ type: M, value: -30 }];
  public retreat = [C];

  public attacks = [{
    name: 'Sniff Out',
    cost: [C],
    damage: 0,
    text: 'Put any 1 card from your discard pile into your hand.'
  },
  {
    name: 'Quick Blow',
    cost: [L],
    damage: 10,
    damageCalculation: '+',
    text: 'Flip a coin. If heads, this attack does 10 damage plus 10 more damage.'
  }];

  public set: string = 'CG';
  public cardImage: string = 'assets/cardback.png';
  public setNumber: string = '52';
  public name: string = 'Electrike';
  public fullName: string = 'Electrike CG';

  public reduceEffect(store: StoreLike, state: State, effect: Effect): State {

    if (WAS_ATTACK_USED(effect, 0, this)) {
      PUT_X_CARDS_FROM_YOUR_DISCARD_PILE_INTO_YOUR_HAND(1, () => true, store, state, effect);
    }

    if (WAS_ATTACK_USED(effect, 1, this)) {
      FLIP_A_COIN_IF_HEADS_DEAL_MORE_DAMAGE(store, state, effect, 10);
    }

    return state;
  }
}