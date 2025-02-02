import { State, StoreLike } from '../../game';
import { CardType, Stage } from '../../game/store/card/card-types';
import { PokemonCard } from '../../game/store/card/pokemon-card';
import { Effect } from '../../game/store/effects/effect';
import { AttackEffect } from '../../game/store/effects/game-effects';


export class Porygon extends PokemonCard {

  public stage: Stage = Stage.BASIC;

  public cardType: CardType = CardType.COLORLESS;

  public hp: number = 60;

  public weakness = [{ type: CardType.FIGHTING }];

  public retreat = [];

  public attacks = [{
    name: 'Quick Draw',
    cost: [CardType.COLORLESS],
    damage: 0,
    text: 'Draw a card.'
  },
  {
    name: 'Ram',
    cost: [CardType.COLORLESS, CardType.COLORLESS],
    damage: 20,
    text: ''
  }
  ];

  public set: string = 'UNB';

  public cardImage: string = 'assets/cardback.png';

  public setNumber: string = '155';

  public name: string = 'Porygon';

  public fullName: string = 'Porygon UNB';

  public reduceEffect(store: StoreLike, state: State, effect: Effect): State {

    if (effect instanceof AttackEffect && effect.attack === this.attacks[0]) {
      const player = effect.player;

      if (player.deck.cards.length === 0) {
        return state;
      }

      player.deck.moveTo(player.hand, 1);
      return state;
    }
    
    return state;
  }
}