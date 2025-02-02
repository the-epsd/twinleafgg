import { Effect } from '../../game/store/effects/effect';
import { GameError } from '../../game/game-error';
import { GameMessage } from '../../game/game-message';
import { TrainerEffect } from '../../game/store/effects/play-card-effects';
import { State } from '../../game/store/state/state';
import { StoreLike } from '../../game/store/store-like';
import { TrainerCard } from '../../game/store/card/trainer-card';
import { SuperType, TrainerType } from '../../game/store/card/card-types';
import { StateUtils, EnergyCard, CardList, ChooseCardsPrompt } from '../../game';

export class TeamStarGrunt extends TrainerCard {

  public trainerType: TrainerType = TrainerType.SUPPORTER;

  public regulationMark = 'G';

  public set: string = 'SVI';

  public cardImage: string = 'assets/cardback.png';

  public setNumber: string = '195';

  public name: string = 'Team Star Grunt';

  public fullName: string = 'Team Star Grunt SVI';

  public text: string =
    'Put an Energy attached to your opponent\'s Active Pokémon on top of their deck.';

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

      if (!opponent.active.cards.some(c => c instanceof EnergyCard)) {
        throw new GameError(GameMessage.CANNOT_PLAY_THIS_CARD);
      }

      const deckTop = new CardList();

      const target = opponent.active;
      state = store.prompt(state, new ChooseCardsPrompt(
        player,
        GameMessage.CHOOSE_CARD_TO_DISCARD,
        target,
        { superType: SuperType.ENERGY },
        { min: 1, max: 1, allowCancel: true }
      ), energy => {
        const cards: CardList[] = (energy || []).map(e => e.cards);

        if (cards.length > 0) {
          target.moveCardsTo(energy, deckTop);
          deckTop.moveToTopOfDestination(opponent.deck);

          player.supporter.moveCardTo(effect.trainerCard, player.discard);

        }
      });


      return state;
    }
    return state;
  }

}


