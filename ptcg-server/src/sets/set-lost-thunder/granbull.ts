import { PokemonCard } from '../../game/store/card/pokemon-card';
import { Stage, CardType } from '../../game/store/card/card-types';
import {
  StoreLike, State
} from '../../game';
import { Effect } from '../../game/store/effects/effect';
import { AttackEffect } from '../../game/store/effects/game-effects';

// LOT Granbull 138 (https://limitlesstcg.com/cards/LOT/138)
export class Granbull extends PokemonCard {

  public tags = [];

  public stage: Stage = Stage.STAGE_1;

  public evolvesFrom = 'Snubbull';

  public cardType: CardType = CardType.FAIRY;

  public hp: number = 130;

  public weakness = [{ type: CardType.METAL }];

  public resistance = [{ type: CardType.DARK, value: -20 }];

  public retreat = [CardType.COLORLESS, CardType.COLORLESS, CardType.COLORLESS];

  public attacks = [
    {
      name: 'All Out',
      cost: [CardType.FAIRY],
      damage: 30,
      text: 'If you have no cards in your hand, this attack does 130 more damage.'
    },

    {
      name: 'Giant Fangs',
      cost: [CardType.FAIRY, CardType.FAIRY, CardType.FAIRY],
      damage: 110,
      text: ''
    }
  ];

  public set: string = 'LOT';

  public name: string = 'Granbull';

  public fullName: string = 'Granbull LOT';

  public setNumber: string = '138';

  public cardImage: string = 'assets/cardback.png';

  public reduceEffect(store: StoreLike, state: State, effect: Effect): State {
    // All Out
    if (effect instanceof AttackEffect && effect.attack === this.attacks[0]) {
      const player = effect.player;

      if (player.hand.cards.length === 0) {
        effect.damage += 130;
      }
    }
    return state;
  }
}