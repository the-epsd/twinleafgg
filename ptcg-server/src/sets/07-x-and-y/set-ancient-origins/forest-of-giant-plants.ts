import { TrainerCard, TrainerType, StoreLike, State, StateUtils, GameError, GameMessage, PlayerType, CardType } from "../../../game";
import { CheckTableStateEffect, CheckPokemonTypeEffect } from "../../../game/store/effects/check-effects";
import { Effect } from "../../../game/store/effects/effect";
import { UseStadiumEffect } from "../../../game/store/effects/game-effects";
import { PlayPokemonEffect } from "../../../game/store/effects/play-card-effects";
import { IS_STADIUM_EFFECT_BLOCKED } from "../../../game/store/prefabs/stadium-effect";

export class ForestOfGiantPlants extends TrainerCard {
  protected _trainerType: TrainerType = TrainerType.STADIUM;
  public set: string = 'AOR';
  public setNumber: string = '74';
  public cardImage: string = 'assets/cardback.png';
  public name: string = 'Forest of Giant Plants';
  public fullName: string = 'Forest of Giant Plants AOR';
  public text: string =
    "Each player's Grass Pokémon can evolve during his or her first turn or the turn he or she plays those Pokémon.";

  public reduceEffect(store: StoreLike, state: State, effect: Effect): State {
    if (effect instanceof UseStadiumEffect && StateUtils.getStadiumCard(state) === this) {
      throw new GameError(GameMessage.CANNOT_USE_STADIUM);
    }

    // First turn: continuously allow each player's Grass Pokémon to evolve
    if (effect instanceof CheckTableStateEffect && StateUtils.getStadiumCard(state) === this) {
      if (state.turn > 2) {
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

    // Same-turn evolve when evolving a Grass Pokémon already in play
    if (effect instanceof PlayPokemonEffect && StateUtils.getStadiumCard(state) === this) {
      const player = effect.player;
      const pokemonInPlay = effect.target.getPokemonCard();
      if (pokemonInPlay === undefined) {
        return state;
      }

      if (IS_STADIUM_EFFECT_BLOCKED(store, state, player, effect.target, this)) {
        return state;
      }

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
