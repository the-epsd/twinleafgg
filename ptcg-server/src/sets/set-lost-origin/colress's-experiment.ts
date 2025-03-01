import { Effect } from '../../game/store/effects/effect';
import { GameMessage } from '../../game/game-message';
import { TrainerEffect } from '../../game/store/effects/play-card-effects';
import { State } from '../../game/store/state/state';
import { StoreLike } from '../../game/store/store-like';
import { TrainerCard } from '../../game/store/card/trainer-card';
import { TrainerType } from '../../game/store/card/card-types';
import { CardList, ChooseCardsPrompt, GameError } from '../../game';

export class ColresssExperiment extends TrainerCard {

  public trainerType: TrainerType = TrainerType.SUPPORTER;

  public set: string = 'LOR';

  public regulationMark = 'F';

  public cardImage: string = 'assets/cardback.png';

  public setNumber: string = '155';

  public name: string = 'Colress\'s Experiment';

  public fullName: string = 'Colress\'s Experiment LOR';

  public text: string =
    'Look at the top 5 cards of your deck and put 3 of them into your hand. Put the other cards in the Lost Zone.';

  public reduceEffect(store: StoreLike, state: State, effect: Effect): State {
    if (effect instanceof TrainerEffect && effect.trainerCard === this) {
      const player = effect.player;

      if (player.deck.cards.length === 0) {
        throw new GameError(GameMessage.CANNOT_PLAY_THIS_CARD);
      }

      const supporterTurn = player.supporterTurn;

      if (supporterTurn > 0) {
        throw new GameError(GameMessage.SUPPORTER_ALREADY_PLAYED);
      }

      player.hand.moveCardTo(effect.trainerCard, player.supporter);
      // We will discard this card after prompt confirmation
      effect.preventDefault = true;

      const deckTop = new CardList();
      player.deck.moveTo(deckTop, 5);
    
      return store.prompt(state, new ChooseCardsPrompt(
        player,
        GameMessage.CHOOSE_CARD_TO_HAND,
        deckTop,
        { },
        { min: 3, max: 3, allowCancel: true }
      ), selected => {
        deckTop.moveCardsTo(selected, player.hand);
        deckTop.moveTo(player.lostzone);
        player.supporter.moveCardTo(effect.trainerCard, player.discard);
        
        return state;

      });
    }

    return state;
  }

}
