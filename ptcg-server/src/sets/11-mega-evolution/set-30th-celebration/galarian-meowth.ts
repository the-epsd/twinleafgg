import { PokemonCard } from '../../../game/store/card/pokemon-card';
import { Stage, CardType } from '../../../game/store/card/card-types';
import { StoreLike, State } from '../../../game';
import { Effect } from '../../../game/store/effects/effect';
import { DRAW_CARDS, WAS_ATTACK_USED } from '../../../game/store/prefabs/prefabs';

export class GalarianMeowth extends PokemonCard {
  public stage: Stage = Stage.BASIC;
  public hp: number = 70;
  public cardType: CardType[] = [M];
  public weakness = [{ type: R }];
  public resistance = [{ type: G, value: -30 }];
  public retreat = [C];

  public attacks = [{
    name: 'Pay Day',
    cost: [C],
    damage: 10,
    text: 'Draw a card.'
  }, {
    name: 'Treasure Rush',
    cost: [M],
    damage: 10,
    damageCalculation: 'x',
    text: 'This attack does 10 damage for each card in your hand.'
  }];

  public regulationMark: string = 'J';
  public set: string = '30C';
  public cardImage: string = 'assets/cardback.png';
  public setNumber: string = '101';
  public name: string = 'Galarian Meowth';
  public fullName: string = 'Galarian Meowth 30C';

  public reduceEffect(store: StoreLike, state: State, effect: Effect): State {
    // Pay Day
    if (WAS_ATTACK_USED(effect, 0, this)) {
      DRAW_CARDS(store, state, effect.player, 1);
    }

    // Treasure Rush
    if (WAS_ATTACK_USED(effect, 1, this)) {
      effect.damage = 10 * effect.player.hand.cards.length;
    }

    return state;
  }
}
