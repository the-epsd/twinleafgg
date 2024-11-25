import { Effect } from '../../game/store/effects/effect';
import { TrainerCard } from '../../game/store/card/trainer-card';
import { CardTag, TrainerType } from '../../game/store/card/card-types';
import { StoreLike } from '../../game/store/store-like';
import { State } from '../../game/store/state/state';
import { TrainerEffect } from '../../game/store/effects/play-card-effects';
import { GameError, GameMessage, CardList, ChooseCardsPrompt } from '../../game';


export class ExplorersGuidance extends TrainerCard {

  public trainerType: TrainerType = TrainerType.SUPPORTER;

  public set: string = 'TEF';

  public tags = [CardTag.ANCIENT];

  public cardImage: string = 'assets/cardback.png';

  public setNumber: string = '147';

  public regulationMark = 'H';

  public name: string = 'Explorer\'s Guidance';

  public fullName: string = 'Explorer\'s Guidance TEF';

  public text: string = 'Heal all damage from 1 of your Pokémon that has 30 HP or less remaining.';

  public reduceEffect(store: StoreLike, state: State, effect: Effect): State {
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
        throw new GameError(GameMessage.CANNOT_USE_POWER);
      }
      
      const deckTop = new CardList();
      player.deck.moveTo(deckTop, 6);
      
      return store.prompt(state, new ChooseCardsPrompt(
        player,
        GameMessage.CHOOSE_CARD_TO_HAND,
        deckTop,
        { },
        { min: 2, max: 2, allowCancel: false }
      ), selected => {
        deckTop.moveCardsTo(selected, player.hand);
        deckTop.moveTo(player.discard);
        player.supporter.moveCardTo(effect.trainerCard, player.discard);
        
    
      });
    }
    return state;
  }

}
