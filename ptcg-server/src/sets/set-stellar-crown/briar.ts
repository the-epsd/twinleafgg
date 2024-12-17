import { TrainerCard, TrainerType, StoreLike, State, StateUtils, GamePhase, GameError, GameMessage } from '../../game';
import { Effect } from '../../game/store/effects/effect';
import { KnockOutEffect } from '../../game/store/effects/game-effects';
import { TrainerEffect } from '../../game/store/effects/play-card-effects';

export class Briar extends TrainerCard {

  public trainerType: TrainerType = TrainerType.SUPPORTER;

  public regulationMark = 'H';

  public set: string = 'SCR';

  public cardImage: string = 'assets/cardback.png';

  public setNumber: string = '132';

  public name: string = 'Briar';

  public fullName: string = 'Briar SV7';

  public extraPrizes = false;

  public text: string =
    'You can use this card only if your opponent has exactly 2 Prize cards remaining.' +
    '' +
    'During this turn, if your opponent\'s Active Pokémon is Knocked Out by damage from an attack used by your Tera Pokémon, take 1 more Prize card.';

  public reduceEffect(store: StoreLike, state: State, effect: Effect): State {

    if (effect instanceof TrainerEffect && effect.trainerCard === this) {
      const player = effect.player;
      const opponent = StateUtils.getOpponent(state, player);
      const supporterTurn = player.supporterTurn;

      if (supporterTurn > 0) {
        throw new GameError(GameMessage.SUPPORTER_ALREADY_PLAYED);
      }

      player.hand.moveCardTo(effect.trainerCard, player.supporter);
      // We will discard this card after prompt confirmation
      effect.preventDefault = true;

      if (opponent.getPrizeLeft() !== 2) {
        throw new GameError(GameMessage.CANNOT_PLAY_THIS_CARD);
      }

      this.extraPrizes = true;
      return state;
    }

    if (effect instanceof KnockOutEffect && effect.target === effect.player.active) {
      const player = effect.player;
      const opponent = StateUtils.getOpponent(state, player);

      // Do not activate between turns, or when it's not opponents turn.
      if (state.phase !== GamePhase.ATTACK || state.players[state.activePlayer] !== opponent) {
        return state;
      }

      // Check if the knocked out Pokémon belongs to the opponent and if extra prize should be taken
      if (effect.target === player.active) {
        const attackingPokemon = opponent.active;
        if (attackingPokemon.isTera() && this.extraPrizes) {
          if (effect.prizeCount > 0) {
            effect.prizeCount += 1;
          }
        }
        this.extraPrizes = false;
      }
      player.supporter.moveCardTo(this, player.discard);
      return state;
    }
    return state;
  }
}