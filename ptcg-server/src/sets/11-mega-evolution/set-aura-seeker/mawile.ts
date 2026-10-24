import { CardType, PokemonCard, Stage, State, StoreLike } from '../../../game';
import { Effect } from '../../../game/store/effects/effect';
import { WAS_ATTACK_USED } from '../../../game/store/prefabs/prefabs';

export class Mawile extends PokemonCard {
  public stage: Stage = Stage.BASIC;
  public hp: number = 90;
  public cardType: CardType[] = [M];
  public weakness = [{ type: R }];
  public resistance = [{ type: G, value: -30 }];
  public retreat = [C];

  public attacks = [{
    name: 'Big Jaw',
    cost: [M, M, M],
    damage: 30,
    damageCalculation: 'x',
    text: 'This attack does 30 damage for each card in your opponent\'s hand.'
  }];

  public regulationMark: string = 'J';
  public set: string = 'M7';
  public cardImage: string = 'assets/cardback.png';
  public setNumber: string = '56';
  public name: string = 'Mawile';
  public fullName: string = 'Mawile FLO';
  public reduceEffect(store: StoreLike, state: State, effect: Effect): State {
    // Big Jaw
    if (WAS_ATTACK_USED(effect, 0, this)) {
      effect.damage = 30 * effect.opponent.hand.cards.length;
    }

    return state;
  }
}
