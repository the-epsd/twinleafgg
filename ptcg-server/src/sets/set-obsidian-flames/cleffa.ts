import { PokemonCard } from '../../game/store/card/pokemon-card';
import { Stage, CardType } from '../../game/store/card/card-types';
import { StoreLike, State } from '../../game';
import { AttackEffect } from '../../game/store/effects/game-effects';
import { Effect } from '../../game/store/effects/effect';


export class Cleffa extends PokemonCard {

  public regulationMark = 'G';

  public stage: Stage = Stage.BASIC;

  public cardType: CardType = CardType.PSYCHIC;

  public hp: number = 30;

  public weakness = [{ type: CardType.METAL }];

  public retreat = [  ];

  public attacks = [
    {
      name: 'Grasping Draw',
      cost: [  ],
      damage: 0,
      text: 'Draw cards until you have 7 cards in your hand.'
    }
  ];

  public set: string = 'OBF';

  public set2: string = 'obsidianflames';

  public setNumber: string = '80';

  public name: string = 'Cleffa';

  public fullName: string = 'Cleffa OBF';

  public reduceEffect(store: StoreLike, state: State, effect: Effect): State {

    if (effect instanceof AttackEffect && effect.attack === this.attacks[0]) {
      const player = effect.player;

      const cardsToDraw = 7 - player.hand.cards.length;
      if (cardsToDraw <= 0) {
        return state;
      }

      player.deck.moveTo(player.hand, cardsToDraw);
    }

    return state;
  }
}