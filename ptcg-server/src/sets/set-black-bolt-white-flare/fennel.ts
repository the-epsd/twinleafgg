import { Effect, HealEffect } from '../../game/store/effects/game-effects';
import { TrainerCard } from '../../game/store/card/trainer-card';
import { TrainerType } from '../../game/store/card/card-types';
import { StoreLike } from '../../game/store/store-like';
import { State } from '../../game/store/state/state';
import { PlayerType } from '../../game/store/actions/play-card-action';
import { TrainerEffect } from '../../game/store/effects/play-card-effects';
import { GameError, GameMessage } from '../../game';
import { CLEAN_UP_SUPPORTER } from '../../game/store/prefabs/prefabs';

export class Fennel extends TrainerCard {
  public trainerType: TrainerType = TrainerType.SUPPORTER;
  public regulationMark = 'I';
  public set: string = 'BLK';
  public cardImage: string = 'assets/cardback.png';
  public setNumber: string = '82';
  public name: string = 'Fennel';
  public fullName: string = 'Fennel SV11B';
  public text: string = 'Heal 40 damage from each of your Pokémon.';

  public reduceEffect(store: StoreLike, state: State, effect: Effect): State {

    if (effect instanceof TrainerEffect && effect.trainerCard === this) {
      const player = effect.player;
      const supporterTurn = player.supporterTurn;

      if (supporterTurn > 0) {
        throw new GameError(GameMessage.SUPPORTER_ALREADY_PLAYED);
      }

      player.hand.moveCardTo(effect.trainerCard, player.supporter);
      // We will discard this card after prompt confirmation
      effect.preventDefault = true;

      player.forEachPokemon(PlayerType.BOTTOM_PLAYER, (cardList) => {
        const healEffect = new HealEffect(player, cardList, 40);
        state = store.reduceEffect(state, healEffect);
      });
      CLEAN_UP_SUPPORTER(effect, player);
      return state;
    }
    return state;
  }
}