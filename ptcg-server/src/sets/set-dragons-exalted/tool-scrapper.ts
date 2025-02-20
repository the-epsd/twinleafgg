import { TrainerCard } from '../../game/store/card/trainer-card';
import { TrainerType } from '../../game/store/card/card-types';
import { StoreLike } from '../../game/store/store-like';
import { State } from '../../game/store/state/state';
import { Effect } from '../../game/store/effects/effect';
import { TrainerEffect } from '../../game/store/effects/play-card-effects';
import {
  PlayerType, StateUtils, GameError, GameMessage} from '../../game';
import { DISCARD_TOOLS_FROM_ALL_POKEMON } from '../../game/store/prefabs/prefabs';

export class ToolScrapper extends TrainerCard {

  public trainerType: TrainerType = TrainerType.ITEM;

  public set: string = 'DRX';

  public name: string = 'Tool Scrapper';

  public fullName: string = 'Tool Scrapper DRX';

  public cardImage: string = 'assets/cardback.png';

  public setNumber: string = '116';

  public text: string =
    'Choose up to 2 Pokemon Tool cards attached to Pokemon in play (yours or ' +
    'your opponent\'s) and discard them.';

  public reduceEffect(store: StoreLike, state: State, effect: Effect): State {
    if (effect instanceof TrainerEffect && effect.trainerCard === this) {
      const player = effect.player;
      const opponent = StateUtils.getOpponent(state, player);

      let allTools = [];
      player.forEachPokemon(PlayerType.BOTTOM_PLAYER, (cardList) => {
        allTools.push(cardList.tools);
      });
      opponent.forEachPokemon(PlayerType.TOP_PLAYER, (cardList) => {
        allTools.push(cardList.tools);
      });

      if (allTools.length === 0) {
        throw new GameError(GameMessage.CANNOT_PLAY_THIS_CARD);
      }

      // We will discard this card after prompt confirmation
      effect.preventDefault = true;
      player.hand.moveCardTo(effect.trainerCard, player.supporter);
      state = DISCARD_TOOLS_FROM_ALL_POKEMON(store, state, player, 0, 2);
      player.supporter.moveCardTo(this, player.discard);

      return state;
    }
    return state;
  }

}
