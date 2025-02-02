import { PokemonCard } from '../../game/store/card/pokemon-card';
import { Stage, CardType } from '../../game/store/card/card-types';
import { StoreLike, State } from '../../game';
import { Effect } from '../../game/store/effects/effect';
import { AttackEffect } from '../../game/store/effects/game-effects';

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

    if (effect instanceof AttackEffect && effect.attack === this.attacks[0]) {
      const player = effect.player;

      while (player.hand.cards.length < 5) {
        if (player.deck.cards.length === 0) {
          break;
        }
        player.deck.moveTo(player.hand, 1);
      }
    }

    return state;
  }
}