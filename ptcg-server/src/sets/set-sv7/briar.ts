import { TrainerCard, TrainerType, StoreLike, State, StateUtils, GamePhase, GameError, GameMessage, CardTag } from '../../game';
import { Effect } from '../../game/store/effects/effect';
import { KnockOutEffect } from '../../game/store/effects/game-effects';
import { TrainerEffect } from '../../game/store/effects/play-card-effects';

export class Briar extends TrainerCard {

  public trainerType: TrainerType = TrainerType.SUPPORTER;

  public regulationMark = 'H';

  public set: string = 'SV7';

  public cardImage: string = 'assets/cardback.png';

  public setNumber: string = '100';

  public name: string = 'Briar';

  public fullName: string = 'Briar SV7';

  public text: string =
    'Search your deck for a Stadium card and an Energy card, reveal them, and put them into your hand. Then, shuffle your deck.';

  public reduceEffect(store: StoreLike, state: State, effect: Effect): State {

    if (effect instanceof TrainerEffect && effect.trainerCard === this) {
      const player = effect.player;
      const opponent = StateUtils.getOpponent(state, player);

      if (opponent.prizes.length !== 6) {
        throw new GameError(GameMessage.CANNOT_PLAY_THIS_CARD);
      }
    }

    if (effect instanceof KnockOutEffect && effect.target === effect.player.active) {
      const player = effect.player;
      const opponent = StateUtils.getOpponent(state, player);

      // Do not activate between turns, or when it's not opponents turn.
      if (state.phase !== GamePhase.ATTACK || state.players[state.activePlayer] !== opponent) {
        return state;
      }

      // Articuno wasn't attacking
      const pokemonCard = opponent.active.getPokemonCard();
      if (pokemonCard !== player.active.getPokemonCard()) {
        return state;
      }

      const playerActive = player.active.getPokemonCard();

      if (playerActive && playerActive.tags.includes(CardTag.POKEMON_TERA)) {
        effect.prizeCount += 1;
        return state;
      }

      return state;
    }
    return state;
  }

}