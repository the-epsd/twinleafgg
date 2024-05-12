import { Effect } from '../../game/store/effects/effect';
import { GameError } from '../../game/game-error';
import { GameMessage } from '../../game/game-message';
import { TrainerEffect } from '../../game/store/effects/play-card-effects';
import { State } from '../../game/store/state/state';
import { StoreLike } from '../../game/store/store-like';
import { TrainerCard } from '../../game/store/card/trainer-card';
import { CardType, TrainerType } from '../../game/store/card/card-types';
import { StateUtils, EnergyCard, Card, ChooseEnergyPrompt } from '../../game';
import { CheckProvidedEnergyEffect } from '../../game/store/effects/check-effects';

export class TeamStarGrunt extends TrainerCard {

  public trainerType: TrainerType = TrainerType.SUPPORTER;

  public regulationMark = 'F';

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

      const checkProvidedEnergy = new CheckProvidedEnergyEffect(opponent);
      state = store.reduceEffect(state, checkProvidedEnergy);

      state = store.prompt(state, new ChooseEnergyPrompt(
        player.id,
        GameMessage.CHOOSE_ENERGIES_TO_DISCARD,
        checkProvidedEnergy.energyMap,
        [CardType.COLORLESS],
        { allowCancel: false }
      ), energy => {
        const cards: Card[] = (energy || []).map(e => e.card);

        // Fix error by looping through cards and moving individually
        cards.forEach(c => {
          opponent.deck.cards.unshift(c);
        });
        player.supporter.moveCardTo(effect.trainerCard, player.discard);
        player.supporterTurn = 1;
      });

      return state;
    }
    return state;
  }



}

    
    