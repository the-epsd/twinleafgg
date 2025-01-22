import { Effect } from '../../game/store/effects/effect';
import { GameError } from '../../game/game-error';
import { GameMessage } from '../../game/game-message';
import { State } from '../../game/store/state/state';
import { StoreLike } from '../../game/store/store-like';
import { TrainerCard } from '../../game/store/card/trainer-card';
import { CardType, EnergyType, SuperType, TrainerType } from '../../game/store/card/card-types';
import { StateUtils } from '../../game/store/state-utils';
import { UseStadiumEffect } from '../../game/store/effects/game-effects';
import { ChooseCardsPrompt } from '../../game/store/prompts/choose-cards-prompt';
import { EnergyCard } from '../../game';

export class Levincia extends TrainerCard {

  public trainerType: TrainerType = TrainerType.STADIUM;

  public set: string = 'SV9';

  public name: string = 'Levincia';

  public fullName: string = 'Levincia SV9';

  public regulationMark = 'I';

  public cardImage: string = 'assets/cardback.png';

  public setNumber = '98';

  public text: string =
    'Once during each player’s turn, that player may put up to 2 Basic [L] Energy cards from their discard pile into their hand.';

  public reduceEffect(store: StoreLike, state: State, effect: Effect): State {
    if (effect instanceof UseStadiumEffect && StateUtils.getStadiumCard(state) === this) {
      const player = effect.player;

      let hasCardsInDiscard = false;
      player.discard.cards.forEach((c) => {
        if (c instanceof EnergyCard && c.energyType === EnergyType.BASIC && c.provides.includes(CardType.LIGHTNING)) {
          hasCardsInDiscard = true;
        }
      });

      if (hasCardsInDiscard === false) {
        throw new GameError(GameMessage.CANNOT_USE_POWER);
      }

      return store.prompt(state, new ChooseCardsPrompt(
        player,
        GameMessage.CHOOSE_CARD_TO_HAND,
        player.discard,
        { superType: SuperType.ENERGY, energyType: EnergyType.BASIC, name: 'Lightning Energy' },
        { allowCancel: false, min: 0, max: 2 }
      ), selected => {
        selected = selected || [];
        player.discard.moveCardsTo(selected, player.hand);
      });
    }

    return state;
  }
}