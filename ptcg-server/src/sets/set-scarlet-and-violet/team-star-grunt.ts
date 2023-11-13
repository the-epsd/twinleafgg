import { Effect } from '../../game/store/effects/effect';
import { GameError } from '../../game/game-error';
import { GameMessage } from '../../game/game-message';
import { TrainerEffect } from '../../game/store/effects/play-card-effects';
import { State } from '../../game/store/state/state';
import { StoreLike } from '../../game/store/store-like';
import { TrainerCard } from '../../game/store/card/trainer-card';
import { CardType, TrainerType } from '../../game/store/card/card-types';
import { StateUtils, EnergyCard, CardList, Card, ChooseEnergyPrompt } from '../../game';
import { CheckProvidedEnergyEffect } from '../../game/store/effects/check-effects';

export class TeamStarGrunt extends TrainerCard {

  public trainerType: TrainerType = TrainerType.SUPPORTER;

  public regulationMark = 'F';

  public set: string = 'SVI';

  public set2: string = 'scarletviolet';

  public setNumber: string = '195';

  public name: string = 'Team Star Grunt';

  public fullName: string = 'Team Star Grunt SVI';

  public text: string =
    'Put an Energy attached to your opponent\'s Active Pokémon on top of their deck.';

  public reduceEffect(store: StoreLike, state: State, effect: Effect): State {
    if (effect instanceof TrainerEffect && effect.trainerCard === this) {

      const player = effect.player;
      const opponent = StateUtils.getOpponent(state, player);

      if (!opponent.active.cards.some(c => c instanceof EnergyCard)) {
        throw new GameError(GameMessage.CANNOT_PLAY_THIS_CARD);
      }

      const deckTop = new CardList();

      const checkProvidedEnergy = new CheckProvidedEnergyEffect(opponent);
      state = store.reduceEffect(state, checkProvidedEnergy);

      state = store.prompt(state, new ChooseEnergyPrompt(
        player.id,
        GameMessage.CHOOSE_ENERGIES_TO_DISCARD,
        checkProvidedEnergy.energyMap,
        [CardType.COLORLESS],
        { allowCancel: false }
      ), (energy) => {
        const cards: Card[] = (energy || []).map(e => e.card);

        // Fix error by looping through cards and moving individually
        cards.forEach(card => {
          deckTop.moveCardTo(card, opponent.deck);
        });

      });

      return state;
    }
    return state;
  }



}

    
    