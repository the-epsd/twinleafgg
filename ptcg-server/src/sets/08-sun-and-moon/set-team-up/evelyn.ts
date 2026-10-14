import { Stage, TrainerType } from '../../../game/store/card/card-types';
import { Effect } from '../../../game/store/effects/effect';
import {
  State,
  StoreLike,
  TrainerCard,
  StateUtils,
  GameError,
  GameMessage,
  Player,
} from '../../../game';
import { DRAW_CARDS } from '../../../game/store/prefabs/prefabs';
import { WAS_TRAINER_USED } from '../../../game/store/prefabs/trainer-prefabs';

export class Evelyn extends TrainerCard {
  protected _trainerType: TrainerType = TrainerType.SUPPORTER;
  public set: string = 'TEU';
  public cardImage: string = 'assets/cardback.png';
  public setNumber: string = '141';
  public name: string = 'Evelyn';
  public fullName: string = 'Evelyn TEU';
  public text: string =
    "You can play this card only if your opponent's Active Pokémon is a Stage 1 Pokémon. Draw 4 cards. You may play only 1 Supporter card during your turn (before your attack).";

  public canPlay(store: StoreLike, state: State, player: Player): boolean {
    if (player.supporterTurn > 0) {
      return false;
    }
    // Opponent's Active Pokémon must be a Stage 1 Pokémon
    const opponent = StateUtils.getOpponent(state, player);
    const opponentActive = opponent.active.getPokemonCard();
    return !!opponentActive && opponentActive.stage === Stage.STAGE_1;
  }

  public reduceEffect(store: StoreLike, state: State, effect: Effect): State {
    if (WAS_TRAINER_USED(effect, this)) {
      const player = effect.player;
      const opponent = StateUtils.getOpponent(state, player);

      // Check if opponent's Active Pokemon is a Stage 1 Pokemon
      const opponentActive = opponent.active.getPokemonCard();
      if (!opponentActive || opponentActive.stage !== Stage.STAGE_1) {
        throw new GameError(GameMessage.CANNOT_PLAY_THIS_CARD);
      }

      DRAW_CARDS(store, state, player, 4);
    }

    return state;
  }
}
