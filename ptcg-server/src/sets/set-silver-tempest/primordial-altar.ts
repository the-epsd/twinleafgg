import { TrainerCard } from '../../game/store/card/trainer-card';
import { TrainerType } from '../../game/store/card/card-types';
import { StoreLike } from '../../game/store/store-like';
import { State } from '../../game/store/state/state';
import { Effect } from '../../game/store/effects/effect';
import { CardList } from '../../game/store/state/card-list';
import { GameError } from '../../game/game-error';
import { GameMessage } from '../../game/game-message';
import { ConfirmPrompt, ShowCardsPrompt, StateUtils } from '../..';
import { UseStadiumEffect } from '../../game/store/effects/game-effects';

export class PrimordialAltar extends TrainerCard {
  
  public trainerType = TrainerType.STADIUM;
  
  public regulationMark = 'F';
  
  public set = 'SIT';
  
  public set2: string = 'silvertempest';
  
  public setNumber: string = '161';
  
  public name = 'Primordial Altar';
  
  public fullName = 'Primordial Altar SIT';
  
  public text = 'Once during each player\'s turn, that player may look at the top card of their deck. They may discard that card.';

  reduceEffect(store: StoreLike, state: State, effect: Effect): State {
    if (effect instanceof UseStadiumEffect && StateUtils.getStadiumCard(state) === this) {
      return this.useStadium(store, state, effect);
    }
    return state;
  }
        
  useStadium(store: StoreLike, state: State, effect: UseStadiumEffect): State {
    const player = effect.player;

    if (player.deck.cards.length === 0) {
      throw new GameError(GameMessage.CANNOT_PLAY_THIS_CARD);
    }

    const deckTop = new CardList();
    player.deck.moveTo(deckTop, 1);

    return store.prompt(state, new ShowCardsPrompt(
      player.id,
      GameMessage.CHOOSE_CARD_TO_HAND,
      deckTop.cards // Fix error by changing toArray() to cards
    ), () => {

      return store.prompt(state, new ConfirmPrompt(
        player.id, 
        GameMessage.CHOOSE_CARD_TO_HAND
      ), yes => {
          
        if (yes) {
          // Add card to hand
          deckTop.moveCardsTo(deckTop.cards, player.hand);
        } else {
          // Discard card
          deckTop.moveTo(player.deck);
        }
        return state;
      });
    });
  }
}