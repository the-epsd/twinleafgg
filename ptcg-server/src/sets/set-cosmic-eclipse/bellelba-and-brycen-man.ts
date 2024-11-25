import { CardList, ChooseCardsPrompt, ChoosePokemonPrompt, ConfirmPrompt, GameError, PlayerType, SlotType, StateUtils } from '../../game';
import { GameLog, GameMessage } from '../../game/game-message';
import { CardTag, TrainerType } from '../../game/store/card/card-types';
import { TrainerCard } from '../../game/store/card/trainer-card';
import { Effect } from '../../game/store/effects/effect';
import { TrainerEffect } from '../../game/store/effects/play-card-effects';
import { State } from '../../game/store/state/state';
import { StoreLike } from '../../game/store/store-like';

export class BellelbaAndBrycenMan extends TrainerCard {

  public trainerType: TrainerType = TrainerType.SUPPORTER;

  public set: string = 'CEC';

  public tags = [CardTag.TAG_TEAM];

  public cardImage: string = 'assets/cardback.png';

  public setNumber: string = '186';

  public name: string = 'Bellelba & Brycen-Man';

  public fullName: string = 'Bellelba & Brycen-Man CEC';

  public text: string =
    'Discard 3 cards from the top of each player\'s deck.' +
    '' +
    'When you play this card, you may discard 3 other cards from your hand. If you do, each player discards their Benched Pokémon until they have 3 Benched Pokémon. Your opponent discards first.';


  public reduceEffect(store: StoreLike, state: State, effect: Effect): State {
    if (effect instanceof TrainerEffect && effect.trainerCard === this) {

      const player = effect.player;
      const opponent = StateUtils.getOpponent(state, effect.player);
      
      const supporterTurn = player.supporterTurn;

      if (supporterTurn > 0) {
        throw new GameError(GameMessage.SUPPORTER_ALREADY_PLAYED);
      }
      
      if (player.deck.cards.length === 0 || opponent.deck.cards.length === 0) {
        throw new GameError(GameMessage.CANNOT_PLAY_THIS_CARD);
      }

      const benchedPokemon = player.bench.filter(b => b.cards.length > 0).length;
      const opponentsBenchedPokemon = opponent.bench.filter(b => b.cards.length > 0).length;

      const cannotDiscardFromHand = (benchedPokemon <= 3 && opponentsBenchedPokemon <= 3) || player.hand.cards.length <= 2;

      player.hand.moveCardTo(effect.trainerCard, player.supporter);
      // We will discard this card after prompt confirmation
      effect.preventDefault = true;
      
      // discard player cards
      const cardsToDiscard = Math.min(player.deck.cards.length, 3);
      const deckTop = new CardList();
      player.deck.moveTo(deckTop, cardsToDiscard);
      
      deckTop.cards.forEach((card, index) => {
        store.log(state, GameLog.LOG_PLAYER_DISCARDS_CARD, { name: player.name, card: card.name });
      });
      
      deckTop.moveTo(player.discard, deckTop.cards.length);

      // discard opponent cards
      const opponentCardsToDiscard = Math.min(opponent.deck.cards.length, 3);
      const opponentDeckTop = new CardList();
      opponent.deck.moveTo(opponentDeckTop, opponentCardsToDiscard);
      
      opponentDeckTop.cards.forEach((card, index) => {
        store.log(state, GameLog.LOG_PLAYER_DISCARDS_CARD, { name: opponent.name, card: card.name });
      });
      
      opponentDeckTop.moveTo(opponent.discard, opponentDeckTop.cards.length);
      
      if (cannotDiscardFromHand) {
        player.supporter.moveCardTo(effect.trainerCard, player.discard);
        return state;
      }
      
      state = store.prompt(state, new ConfirmPrompt(
        effect.player.id,
        GameMessage.WANT_TO_DISCARD_CARDS,
      ), wantToUse => {
        if (wantToUse) {
          state = store.prompt(state, new ChooseCardsPrompt(
            player,
            GameMessage.CHOOSE_CARD_TO_DISCARD,
            player.hand,
            {},
            { allowCancel: false, min: 3, max: 3 }
          ), cards => {
            cards = cards || [];

            player.hand.moveCardsTo(cards, player.discard);

            cards.forEach((card, index) => {
              store.log(state, GameLog.LOG_PLAYER_DISCARDS_CARD_FROM_HAND, { name: player.name, card: card.name });
            });
            
            const oppoonentBenchDifference = opponentsBenchedPokemon - 3;
            const benchDifference = benchedPokemon - 3;
            
            if (oppoonentBenchDifference > 0) {
              store.prompt(state, new ChoosePokemonPrompt(
                opponent.id,
                GameMessage.CHOOSE_CARD_TO_DISCARD,
                PlayerType.BOTTOM_PLAYER,
                [SlotType.BENCH],
                {
                  allowCancel: false,
                  min: oppoonentBenchDifference,
                  max: oppoonentBenchDifference
                }
              ), (selected: any[]) => {
                selected.forEach(card => {
                  card.moveTo(opponent.discard);
                });
              
                if (benchDifference > 0) {
                  store.prompt(state, new ChoosePokemonPrompt(
                    player.id,
                    GameMessage.CHOOSE_CARD_TO_DISCARD,
                    PlayerType.BOTTOM_PLAYER,
                    [SlotType.BENCH],
                    {
                      allowCancel: false,
                      min: benchDifference,
                      max: benchDifference
                    }
                  ), (selected: any[]) => {
                    selected.forEach(card => {
                      card.moveTo(player.discard);
                    });
                    
                    return state;
                  });              
                }
                
                return state;
              });
            } else if (benchDifference > 0) {
              store.prompt(state, new ChoosePokemonPrompt(
                player.id,
                GameMessage.CHOOSE_CARD_TO_DISCARD,
                PlayerType.BOTTOM_PLAYER,
                [SlotType.BENCH],
                {
                  allowCancel: false,
                  min: benchDifference,
                  max: benchDifference
                }
              ), (selected: any[]) => {
                selected.forEach(card => {
                  card.moveTo(player.discard);
                });
                
                return state;
              });              
            }
            
            player.supporter.moveCardTo(effect.trainerCard, player.discard);
            
            return state;
          })
        }
      });      
      
      return state;
    }

    return state;
  }
}