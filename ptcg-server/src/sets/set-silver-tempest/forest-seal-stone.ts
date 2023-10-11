import { TrainerCard } from '../../game/store/card/trainer-card';
import { TrainerType } from '../../game/store/card/card-types';
import { StoreLike } from '../../game/store/store-like';
import { State } from '../../game/store/state/state';
import { Effect } from '../../game/store/effects/effect';
import { PlayItemEffect } from '../../game/store/effects/play-card-effects';
import { ChooseCardsPrompt, GameError, GameMessage, PowerType, ShuffleDeckPrompt } from '../../game';
import { PowerEffect } from '../../game/store/effects/game-effects';

export class ForestSealStone extends TrainerCard {

  public trainerType: TrainerType = TrainerType.TOOL;

  public set: string = 'SIT';

  public set2: string = 'silvertempest';

  public setNumber: string = '156';

  public regulationMark = 'F';

  public name: string = 'Forest Seal Stone';

  public fullName: string = 'Forest Seal Stone SIT';

  public readonly VSTAR_MARKER = 'VSTAR_MARKER';

  public text: string =
    'The Pokemon V this card is attached to can use the VSTAR Power ' +
    'on this card.';

  public powers = [{
    name: 'Starbirth',
    powerType: PowerType.ABILITY,
    useWhenInPlay: true,
    text: 'During your turn, you may search your deck for a card and put it into ' +
          'your hand. Then, shuffle your deck. (You can\'t use more than 1 VSTAR' +
          'Power in a game.)'
    
  }];

  public reduceEffect(store: StoreLike, state: State, effect: Effect): State {
    if (effect instanceof PlayItemEffect && effect.trainerCard === this) {
      const player = effect.player;
      player.marker.removeMarker(this.VSTAR_MARKER, this);
    }

    if (effect instanceof PowerEffect && effect.power === this.powers[0]) {
      const player = effect.player;
      if (player.marker.hasMarker(this.VSTAR_MARKER)) {
        throw new GameError(GameMessage.POWER_ALREADY_USED);
      }

      player.marker.addMarker(this.VSTAR_MARKER, this);
      state = store.prompt(state, new ChooseCardsPrompt(
        player.id,
        GameMessage.CHOOSE_CARD_TO_HAND,
        player.deck,
        {},
        { min: 1, max: 1, allowCancel: false }
      ), cards => {
        player.deck.moveCardsTo(cards, player.hand);
      
        state = store.prompt(state, new ShuffleDeckPrompt(player.id), order => {
          player.deck.applyOrder(order);
        });
      
        return state;
      });
    }

    return state;
  }

}
