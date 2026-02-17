import { TrainerCard } from '../../game/store/card/trainer-card';
import { TrainerType } from '../../game/store/card/card-types';
import { StoreLike } from '../../game/store/store-like';
import { State } from '../../game/store/state/state';
import { Effect } from '../../game/store/effects/effect';
import { TrainerEffect } from '../../game/store/effects/play-card-effects';
import { ChoosePokemonPrompt } from '../../game/store/prompts/choose-pokemon-prompt';
import { HealEffect } from '../../game/store/effects/game-effects';
import { GameError } from '../../game/game-error';
import { GameMessage } from '../../game/game-message';
import { PlayerType, SlotType } from '../../game/store/actions/play-card-action';

export class AzsTranquility extends TrainerCard {
  public trainerType: TrainerType = TrainerType.SUPPORTER;
  public set: string = 'M4';
  public regulationMark = 'J';
  public name: string = 'AZ\'s Tranquility';
  public fullName: string = 'AZ\'s Tranquility M4';
  public cardImage: string = 'assets/cardback.png';
  public setNumber: string = '75';
  public text: string = 'Switch your Active Pokemon with 1 of your Benched Pokemon. If you moved a Pokemon to your Bench in this way, heal 80 damage from that Pokemon.';

  public reduceEffect(store: StoreLike, state: State, effect: Effect): State {
    if (effect instanceof TrainerEffect && effect.trainerCard === this) {
      const player = effect.player;
      if (player.supporterTurn > 0) {
        throw new GameError(GameMessage.SUPPORTER_ALREADY_PLAYED);
      }
      const hasBench = player.bench.some(b => b.cards.length > 0);
      if (!hasBench) {
        throw new GameError(GameMessage.CANNOT_PLAY_THIS_CARD);
      }
      player.hand.moveCardTo(effect.trainerCard, player.supporter);
      effect.preventDefault = true;
      return store.prompt(state, new ChoosePokemonPrompt(
        player.id,
        GameMessage.CHOOSE_NEW_ACTIVE_POKEMON,
        PlayerType.BOTTOM_PLAYER,
        [SlotType.BENCH],
        { allowCancel: false }
      ), selected => {
        if (!selected || selected.length === 0) return state;
        const previousActive = player.active;
        player.switchPokemon(selected[0], store, state);
        player.supporter.moveCardTo(effect.trainerCard, player.discard);
        const healEffect = new HealEffect(player, previousActive, 80);
        return store.reduceEffect(state, healEffect);
      });
    }
    return state;
  }
}
