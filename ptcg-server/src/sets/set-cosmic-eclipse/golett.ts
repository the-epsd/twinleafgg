import { PokemonCard } from '../../game/store/card/pokemon-card';
import { Stage, CardType } from '../../game/store/card/card-types';
import { StoreLike, State } from '../../game';
import { Effect } from '../../game/store/effects/effect';
import { AFTER_ATTACK, DRAW_CARDS_UNTIL_CARDS_IN_HAND } from '../../game/store/prefabs/prefabs';

export class Golett extends PokemonCard {

  public stage: Stage = Stage.BASIC;
  public cardType: CardType = CardType.PSYCHIC;
  public hp: number = 90;
  public weakness = [{ type: CardType.DARK }];
  public resistance = [{ type: CardType.FIGHTING, value: -20 }];
  public retreat = [CardType.COLORLESS, CardType.COLORLESS, CardType.COLORLESS];

  public attacks = [{
    name: 'Return',
    cost: [CardType.PSYCHIC],
    damage: 10,
    text: 'You may draw cards until you have 5 cards in your hand.'
  }];

  public set: string = 'CEC';
  public name: string = 'Golett';
  public fullName: string = 'Golett CEC';
  public setNumber: string = '89';
  public cardImage: string = 'assets/cardback.png';

  public reduceEffect(store: StoreLike, state: State, effect: Effect): State {

    if (AFTER_ATTACK(effect, 0, this)) {
      const player = effect.player;
      DRAW_CARDS_UNTIL_CARDS_IN_HAND(player, 5);
    }

    return state;
  }
}