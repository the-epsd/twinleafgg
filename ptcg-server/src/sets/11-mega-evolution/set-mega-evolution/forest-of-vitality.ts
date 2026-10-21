import { GameError, GameMessage, State, StateUtils, StoreLike, pokemonHasCardType } from '../../../game';
import { CardType, TrainerType } from '../../../game/store/card/card-types';
import { TrainerCard } from '../../../game/store/card/trainer-card';
import { CheckPokemonTypeEffect } from '../../../game/store/effects/check-effects';
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

    // Grant same-turn evolve when evolving a Grass Pokémon into a Grass Pokémon
    // (checked when the evolution PlayPokemonEffect is reduced, before the turn check).
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

      effect.target.canEvolveThisTurn = true;
    }

    return state;
  }
}
