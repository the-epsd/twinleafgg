import { CardType, Stage } from '../../game/store/card/card-types';
import { StoreLike } from '../../game/store/store-like';
import { State } from '../../game/store/state/state';
import { Effect } from '../../game/store/effects/effect';
import { GameMessage, PokemonCard, ShowCardsPrompt, StateUtils } from '../../game';
import { AttackEffect } from '../../game/store/effects/game-effects';

export class Shinx extends PokemonCard {
  
  public stage: Stage = Stage.BASIC;

  public regulationMark = 'H';
  
  public cardType: CardType = CardType.LIGHTNING;
  
  public weakness = [{ type: CardType.FIRE }];

  public resistance = [{ type: CardType.FIRE, value: -30 }];

  public hp: number = 70;
  
  public retreat = [ CardType.COLORLESS, CardType.COLORLESS ];
  
  public attacks = [
    {
      name: 'Curiosity',
      cost: [ CardType.COLORLESS ],
      damage: 0,
      text: 'Your opponent reveals their hand.'
    },
    {
      name: 'Static Shock',
      cost: [ CardType.LIGHTNING, CardType.LIGHTNING ],
      damage: 30,
      text: ''
    }
  ];
  
  public set: string = 'TWM';

  public cardImage: string = 'assets/cardback.png';

  public setNumber: string = '66';
  
  public name: string = 'Shinx';
  
  public fullName: string = 'Shinx TWM';

  public reduceEffect(store: StoreLike, state: State, effect: Effect): State {

    if (effect instanceof AttackEffect && effect.attack === this.attacks[0]) {

      const player = effect.player;
      const opponent = StateUtils.getOpponent(state, player);

      return store.prompt(state, new ShowCardsPrompt(
        player.id,
        GameMessage.CARDS_SHOWED_BY_THE_OPPONENT,
        opponent.hand.cards
      ), () => state);
    }
    return state;
  }
    
}