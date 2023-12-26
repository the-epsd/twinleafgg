import { Effect } from '../../game/store/effects/effect';
import { GameError } from '../../game/game-error';
import { GameMessage } from '../../game/game-message';
import { TrainerEffect } from '../../game/store/effects/play-card-effects';
import { State } from '../../game/store/state/state';
import { StoreLike } from '../../game/store/store-like';
import { TrainerCard } from '../../game/store/card/trainer-card';
import { Stage, SuperType, TrainerType } from '../../game/store/card/card-types';
import { Card, ChooseCardsPrompt, CoinFlipPrompt, ShuffleDeckPrompt } from '../../game';

export class CapturingAroma extends TrainerCard {

  public trainerType: TrainerType = TrainerType.ITEM;

  public set: string = 'SIT';

  public cardImage: string = 'assets/cardback.png';

  public setNumber: string = '153';

  public regulationMark = 'F';

  public name: string = 'Capturing Aroma';

  public fullName: string = 'Capturing Aroma SIT';

  public text: string =
    'Flip a coin. If heads, search your deck for an Evolution Pokémon, reveal it, and put it into your hand. If tails, search your deck for a Basic Pokémon, reveal it, and put it into your hand. Then, shuffle your deck.';

  public reduceEffect(store: StoreLike, state: State, effect: Effect): State {
    if (effect instanceof TrainerEffect && effect.trainerCard === this) {
      const player = effect.player;

      if (player.deck.cards.length === 0) {
        throw new GameError(GameMessage.CANNOT_PLAY_THIS_CARD);
      }

      return store.prompt(state, new CoinFlipPrompt(player.id, GameMessage.COIN_FLIP), flipResult => {
        if (flipResult) {
          let cards: Card[] = [];
          return store.prompt(state, new ChooseCardsPrompt(
            player.id,
            GameMessage.CHOOSE_CARD_TO_HAND,
            player.deck,
            { superType: SuperType.POKEMON, stage: Stage.STAGE_1 || Stage.STAGE_2 || Stage.VSTAR || Stage.VMAX },
            { min: 0, max: 1, allowCancel: true }
          ), selectedCards => {
            cards = selectedCards || [];

            // Operation canceled by the user
            if (cards.length === 0) {
              return state;
            }

            cards.forEach(card => {
              player.deck.moveCardTo(card, player.hand);
            });
            return store.prompt(state, new ShuffleDeckPrompt(player.id), order => {
              player.deck.applyOrder(order);
            });
          });
        }
        if (!flipResult) {
          let cards: Card[] = [];
          return store.prompt(state, new ChooseCardsPrompt(
            player.id,
            GameMessage.CHOOSE_CARD_TO_HAND,
            player.deck,
            { superType: SuperType.POKEMON, stage: Stage.BASIC },
            { min: 0, max: 1, allowCancel: true }
          ), selectedCards => {
            cards = selectedCards || [];

            // Operation canceled by the user
            if (cards.length === 0) {
              return state;
            }

            cards.forEach(card => {
              player.deck.moveCardTo(card, player.hand);
            });
            return store.prompt(state, new ShuffleDeckPrompt(player.id), order => {
              player.deck.applyOrder(order);
            });
          });
        }
        return state;
      });
    }
    return state;
  }
}