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
import { SEARCH_DECK_FOR_CARDS_TO_HAND } from '../../../game/store/prefabs/prefabs';
import { WAS_TRAINER_USED } from '../../../game/store/prefabs/trainer-prefabs';

export class Dana extends TrainerCard {
  protected _trainerType: TrainerType = TrainerType.SUPPORTER;
  public set: string = 'TEU';
  public cardImage: string = 'assets/cardback.png';
  public setNumber: string = '137';
  public name: string = 'Dana';
  public fullName: string = 'Dana TEU';
  public text: string =
    "You can play this card only if your opponent's Active Pokémon is a Stage 2 Pokémon. Search your deck for up to 2 cards and put them into your hand. Then, shuffle your deck. You may play only 1 Supporter card during your turn (before your attack).";

  public canPlay(store: StoreLike, state: State, player: Player): boolean {
    if (player.supporterTurn > 0) {
      return false;
    }
    // Opponent's Active Pokémon must be a Stage 2 Pokémon
    const opponent = StateUtils.getOpponent(state, player);
    const opponentActive = opponent.active.getPokemonCard();
    return !!opponentActive && opponentActive.stage === Stage.STAGE_2;
  }

  public reduceEffect(store: StoreLike, state: State, effect: Effect): State {
    if (WAS_TRAINER_USED(effect, this)) {
      const player = effect.player;
      const opponent = StateUtils.getOpponent(state, player);

      // Check if opponent's Active Pokemon is a Stage 2 Pokemon
      const opponentActive = opponent.active.getPokemonCard();
      if (!opponentActive || opponentActive.stage !== Stage.STAGE_2) {
        throw new GameError(GameMessage.CANNOT_PLAY_THIS_CARD);
      }

      SEARCH_DECK_FOR_CARDS_TO_HAND(
        store,
        state,
        player,
        this,
        {},
        { min: 0, max: 2, allowCancel: true },
      );
    }

    return state;
  }
}
