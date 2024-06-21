import { ChooseCardsPrompt, ConfirmPrompt, GameError, ShowCardsPrompt, ShuffleDeckPrompt, StateUtils } from '../../game';
import { GameLog, GameMessage } from '../../game/game-message';
import { CardTag, TrainerType } from '../../game/store/card/card-types';
import { TrainerCard } from '../../game/store/card/trainer-card';
import { Effect } from '../../game/store/effects/effect';
import { TrainerEffect } from '../../game/store/effects/play-card-effects';
import { State } from '../../game/store/state/state';
import { StoreLike } from '../../game/store/store-like';

export class GuzmaAndHala extends TrainerCard {

  public trainerType: TrainerType = TrainerType.SUPPORTER;

  public set: string = 'CEC';
  
  public tags = [CardTag.TAG_TEAM];

  public cardImage: string = 'assets/cardback.png';

  public setNumber: string = '193';

  public regulationMark = 'F';

  public name: string = 'Guzma & Hala';

  public fullName: string = 'Guzma & Hala CEC';

  public text: string =
    'Search your deck for a Stadium card, reveal it, and put it into your hand. Then, shuffle your deck.'+
    '' + 
    'When you play this card, you may discard 2 other cards from your hand. If you do, you may also search for a Pokémon Tool card and a Special Energy card in this way.';


  public reduceEffect(store: StoreLike, state: State, effect: Effect): State {
    if (effect instanceof TrainerEffect && effect.trainerCard === this) {

      const player = effect.player;
      const opponent = StateUtils.getOpponent(state, player);

      const supporterTurn = player.supporterTurn;

      if (supporterTurn > 0) {
        throw new GameError(GameMessage.SUPPORTER_ALREADY_PLAYED);
      }
      
      player.hand.moveCardTo(effect.trainerCard, player.supporter);
      // We will discard this card after prompt confirmation
      effect.preventDefault = true;
        
      let maxTools = 0;
      let maxSpecialEnergies = 0;
      
      if (player.hand.cards.length < 2) {
        player.supporterTurn = 1;
      } 
        
      state = store.prompt(state, new ConfirmPrompt(
        effect.player.id,
        GameMessage.WANT_TO_DISCARD_CARDS,
      ), wantToUse => {
        if (wantToUse) {
          maxTools = 1;
          maxSpecialEnergies = 1;
          
          state = store.prompt(state, new ChooseCardsPrompt(
            player.id,
            GameMessage.CHOOSE_CARD_TO_DISCARD,
            player.hand,
            { },
            { allowCancel: false, min: 2, max: 2 }
          ), cards => {
            cards = cards || [];
                          
            player.hand.moveCardsTo(cards, player.discard);
            
            cards.forEach((card, index) => {
              store.log(state, GameLog.LOG_PLAYER_DISCARDS_CARD_FROM_HAND, { name: player.name, card: card.name });
            });            
          });
        }      
        
        state = store.prompt(state, new ChooseCardsPrompt(
          player.id,
          GameMessage.CHOOSE_CARD_TO_HAND,
          player.hand,
          { },
          { allowCancel: false, min: 0, max: 3, maxSpecialEnergies, maxTools, maxStadiums: 1 }
        ), cards => {
          cards = cards || [];
                        
          player.hand.moveCardsTo(cards, player.hand);
          
          state = store.prompt(state, new ShowCardsPrompt(
            opponent.id,
            GameMessage.CARDS_SHOWED_BY_THE_OPPONENT,
            cards), () => state);
        });

        player.supporter.moveCardTo(this, player.discard);

        state = store.prompt(state, new ShuffleDeckPrompt(player.id), order => {
          player.deck.applyOrder(order);
          return state;
        });

        player.supporter.moveCardTo(effect.trainerCard, player.discard);
        player.supporterTurn = 1;
      });
    }
    
    return state;
  }



}