import { PlayerType } from '../../game/store/actions/play-card-action';
import { TrainerType } from '../../game/store/card/card-types';
import { TrainerCard } from '../../game/store/card/trainer-card';
import { Effect } from '../../game/store/effects/effect';
import { BeginTurnEffect, BetweenTurnsEffect } from '../../game/store/effects/game-phase-effects';
import { IS_TOOL_BLOCKED } from '../../game/store/prefabs/prefabs';
import { StateUtils } from '../../game/store/state-utils';
import { State } from '../../game/store/state/state';
import { StoreLike } from '../../game/store/store-like';

export class OranBerry extends TrainerCard {
  public trainerType: TrainerType = TrainerType.TOOL;
  public set: string = 'RS';
  public name: string = 'Oran Berry';
  public fullName: string = 'Oran Berry RS';
  public cardImage: string = 'assets/cardback.png';
  public setNumber: string = '85';

  public text: string =
    'At any time between turns, if the Pokémon this card is attached to has at least 2 damage counters on it, remove 2 damage counters from it. Then discard Oran Berry.';

  public reduceEffect(store: StoreLike, state: State, effect: Effect): State {

    // Using only between turns does not work; poison applies after sometimes
    if (effect instanceof BetweenTurnsEffect || effect instanceof BeginTurnEffect) {
      const player = effect.player;
      const opponent = StateUtils.getOpponent(state, effect.player);

      if (IS_TOOL_BLOCKED(store, state, effect.player, this)) {
        return state;
      }

      player.forEachPokemon(PlayerType.BOTTOM_PLAYER, (cardList, card, target) => {
        if (cardList.damage >= 20 && cardList.cards.includes(this)) {
          cardList.damage -= 20;
          cardList.moveCardTo(this, player.discard);
          cardList.tool = undefined;
        }
      });

      opponent.forEachPokemon(PlayerType.TOP_PLAYER, (cardList, card, target) => {
        if (cardList.damage >= 20 && cardList.cards.includes(this)) {
          cardList.damage -= 20;
          cardList.moveCardTo(this, opponent.discard);
          cardList.tool = undefined;
        }
      });
    }

    return state;
  }
}
