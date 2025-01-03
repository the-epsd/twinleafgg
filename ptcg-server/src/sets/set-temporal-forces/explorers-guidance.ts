import { Effect } from '../../game/store/effects/effect';
import { TrainerCard } from '../../game/store/card/trainer-card';
import { CardTag, TrainerType } from '../../game/store/card/card-types';
import { StoreLike } from '../../game/store/store-like';
import { State } from '../../game/store/state/state';
import { TrainerEffect } from '../../game/store/effects/play-card-effects';
import { GameError, GameMessage, CardList, ChooseCardsPrompt } from '../../game';
import { EndTurnEffect } from '../../game/store/effects/game-phase-effects';


export class ExplorersGuidance extends TrainerCard {

  public trainerType: TrainerType = TrainerType.SUPPORTER;

  public set: string = 'TEF';

  public tags = [CardTag.ANCIENT];

  public cardImage: string = 'assets/cardback.png';

  public setNumber: string = '147';

  public regulationMark = 'H';

  public name: string = 'Explorer\'s Guidance';

  public fullName: string = 'Explorer\'s Guidance TEF';

  public text: string = 'Look at the top 6 cards of your deck and put 2 of them into your hand. Discard the other cards.';

  public reduceEffect(store: StoreLike, state: State, effect: Effect): State {

    if (effect instanceof EndTurnEffect) {
      const player = effect.player;
      player.ancientSupporter = false;
    }

    if (effect instanceof TrainerEffect && effect.trainerCard === this) {
      const player = effect.player;

      const supporterTurn = player.supporterTurn;

      if (supporterTurn > 0) {
        throw new GameError(GameMessage.SUPPORTER_ALREADY_PLAYED);
      }

      player.hand.moveCardTo(effect.trainerCard, player.supporter);
      // We will discard this card after prompt confirmation
      effect.preventDefault = true;

      if (player.deck.cards.length === 0) {
        throw new GameError(GameMessage.CANNOT_PLAY_THIS_CARD);
      }

      const deckTop = new CardList();
      player.deck.moveTo(deckTop, 6);

      const min = player.deck.cards.length > 1 ? Math.min(2, deckTop.cards.length) : 1;

      return store.prompt(state, new ChooseCardsPrompt(
        player,
        GameMessage.CHOOSE_CARD_TO_HAND,
        deckTop,
        {},
        { min, max: 2, allowCancel: false }
      ), selected => {
        player.ancientSupporter = true;
        deckTop.moveCardsTo(selected, player.hand);
        deckTop.moveTo(player.discard);
        player.supporter.moveCardTo(effect.trainerCard, player.discard);

      });
    }
    return state;
  }

}
