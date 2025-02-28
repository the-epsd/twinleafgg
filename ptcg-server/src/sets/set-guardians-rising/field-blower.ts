import { GameError, GameLog, GameMessage, PlayerType, SlotType, StateUtils } from '../../game';
import { TrainerType } from '../../game/store/card/card-types';
import { TrainerCard } from '../../game/store/card/trainer-card';
import { Effect } from '../../game/store/effects/effect';
import { TrainerEffect } from '../../game/store/effects/play-card-effects';
import { CHOOSE_TOOLS_TO_REMOVE_PROMPT, SELECT_PROMPT_WITH_OPTIONS } from '../../game/store/prefabs/prefabs';
import { State } from '../../game/store/state/state';
import { StoreLike } from '../../game/store/store-like';

export class FieldBlower extends TrainerCard {

  public trainerType: TrainerType = TrainerType.ITEM;

  public set: string = 'GRI';

  public name: string = 'Field Blower';

  public fullName: string = 'Field Blower GRI';

  public cardImage: string = 'assets/cardback.png';

  public setNumber: string = '125';

  public text: string =
    'Choose up to 2 in any combination of Pokémon Tool cards and Stadium cards in play (yours or your opponent\'s) and discard them.';

  public reduceEffect(store: StoreLike, state: State, effect: Effect): State {

    if (effect instanceof TrainerEffect && effect.trainerCard === this) {
      const player = effect.player;
      const opponent = StateUtils.getOpponent(state, player);

      const allTools = [];
      player.forEachPokemon(PlayerType.BOTTOM_PLAYER, (cardList, card, target) => {
        allTools.push(...cardList.tools);
      });
      opponent.forEachPokemon(PlayerType.TOP_PLAYER, (cardList, card, target) => {
        allTools.push(...cardList.tools);
      });

      const stadiumCard = StateUtils.getStadiumCard(state);

      if (allTools.length === 0 && stadiumCard == undefined) {
        throw new GameError(GameMessage.CANNOT_PLAY_THIS_CARD);
      }

      // We will discard this card after prompt confirmation
      effect.preventDefault = true;
      player.hand.moveCardTo(effect.trainerCard, player.supporter);

      if (stadiumCard !== undefined) {
        state = SELECT_PROMPT_WITH_OPTIONS(store, state, player, GameMessage.WANT_TO_DISCARD_STADIUM, [
          {
            message: GameMessage.YES,
            action: () => {
              const cardList = StateUtils.findCardList(state, stadiumCard);
              const stadiumPlayer = StateUtils.findOwner(state, cardList);
              cardList.moveTo(stadiumPlayer.discard);
              store.log(state, GameLog.LOG_PLAYER_DISCARDS_WITH_FIELD_BLOWER, { name: player.name, card: stadiumCard.name });

              if (allTools.length > 0) {
                state = CHOOSE_TOOLS_TO_REMOVE_PROMPT(store, state, player, PlayerType.ANY, SlotType.DISCARD, 0, 1);
              }
            }
          },
          {
            message: GameMessage.NO,
            action: () => {
              if (allTools.length > 0) {
                state = CHOOSE_TOOLS_TO_REMOVE_PROMPT(store, state, player, PlayerType.ANY, SlotType.DISCARD, 0, 2);
              }
            }
          }
        ]);
        player.supporter.moveCardTo(this, player.discard);
      } else {
        state = CHOOSE_TOOLS_TO_REMOVE_PROMPT(store, state, player, PlayerType.ANY, SlotType.DISCARD, 0, 2);
      }
      return state;
    }
    return state;
  }

}
