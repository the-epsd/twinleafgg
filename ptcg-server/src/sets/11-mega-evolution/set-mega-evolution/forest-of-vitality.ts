import { GameError, GameMessage, PlayerType, State, StateUtils, StoreLike, pokemonHasCardType } from '../../../game';
import { CardType, TrainerType } from '../../../game/store/card/card-types';
import { TrainerCard } from '../../../game/store/card/trainer-card';
import { CheckPokemonTypeEffect, CheckTableStateEffect } from '../../../game/store/effects/check-effects';
import { Effect } from '../../../game/store/effects/effect';
import { UseStadiumEffect } from '../../../game/store/effects/game-effects';
import { PlayPokemonEffect } from '../../../game/store/effects/play-card-effects';
import { IS_STADIUM_EFFECT_BLOCKED } from '../../../game/store/prefabs/stadium-effect';

export class LushForest extends TrainerCard {
  public cardImage: string = 'assets/cardback.png';
  public setNumber: string = '117';
  protected _trainerType = TrainerType.STADIUM;
  public set = 'MEG';
  public name = 'Forest of Vitality';
  public fullName = 'Forest of Vitality MEG';
  public regulationMark = 'I';
  public text =
    "Each player's [G] Pokémon can evolve into [G] Pokémon during the turn they play those Pokémon, except during their first turn.";

  public reduceEffect(store: StoreLike, state: State, effect: Effect): State {
    // Passive stadium — cannot be "used"
    if (effect instanceof UseStadiumEffect && StateUtils.getStadiumCard(state) === this) {
      throw new GameError(GameMessage.CANNOT_USE_STADIUM);
    }

    // Playability (React playableCardIds) is computed from canEvolveThisTurn *before*
    // an evolution is played. Grant same-turn evolve on CheckTableState so Grass
    // Pokémon just put into play stay legal to evolve — including chain evolves.
    if (effect instanceof CheckTableStateEffect && StateUtils.getStadiumCard(state) === this) {
      if (state.turn <= 2) {
        return state;
      }

      const player = state.players[state.activePlayer];
      player.forEachPokemon(PlayerType.BOTTOM_PLAYER, (cardList) => {
        if (IS_STADIUM_EFFECT_BLOCKED(store, state, player, cardList, this)) {
          return;
        }

        const checkPokemonType = new CheckPokemonTypeEffect(cardList);
        store.reduceEffect(state, checkPokemonType);
        if (checkPokemonType.cardTypes.includes(CardType.GRASS)) {
          player.canEvolve = true;
          cardList.canEvolveThisTurn = true;
        }
      });

      return state;
    }

    // Also grant when the evolution itself is played, so Grass-into-Grass is
    // allowed even if CheckTableState has not run yet this action.
    if (effect instanceof PlayPokemonEffect && StateUtils.getStadiumCard(state) === this) {
      const player = effect.player;

      if (state.turn <= 2) {
        return state;
      }

      // Evolution card must be Grass ("…into [G] Pokémon")
      if (!pokemonHasCardType(effect.pokemonCard, CardType.GRASS)) {
        return state;
      }

      // Must be evolving something already in play (not a Basic onto an empty slot)
      const pokemonInPlay = effect.target.getPokemonCard();
      if (pokemonInPlay === undefined) {
        return state;
      }

      if (IS_STADIUM_EFFECT_BLOCKED(store, state, player, effect.target, this)) {
        return state;
      }

      // Pokémon in play must be Grass ("Each player's [G] Pokémon can evolve…")
      const checkPokemonType = new CheckPokemonTypeEffect(effect.target);
      store.reduceEffect(state, checkPokemonType);
      if (!checkPokemonType.cardTypes.includes(CardType.GRASS)) {
        return state;
      }

      player.canEvolve = true;
      effect.target.canEvolveThisTurn = true;
    }

    return state;
  }
}
