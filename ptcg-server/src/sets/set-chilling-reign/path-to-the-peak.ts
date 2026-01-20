import { StateUtils } from '../../game/store/state-utils';
import { TrainerCard } from '../../game/store/card/trainer-card';
import { CardTag, TrainerType } from '../../game/store/card/card-types';
import { PowerEffect, UseStadiumEffect } from '../../game/store/effects/game-effects';
import { CheckPokemonPowersEffect } from '../../game/store/effects/check-effects';
import { StoreLike } from '../../game/store/store-like';
import { State } from '../../game/store/state/state';
import { Effect } from '../../game/store/effects/effect';
import { GameError, GameMessage, PowerType } from '../../game';

export class PathToThePeak extends TrainerCard {

  public trainerType = TrainerType.STADIUM;

  public set = 'CRE';

  public cardImage: string = 'assets/cardback.png';

  public setNumber: string = '148';

  public regulationMark = 'E';

  public name = 'Path to the Peak';

  public fullName = 'Path to the Peak CRE';

  public text = 'Pokémon with a Rule Box in play (both yours and your opponent\'s) have no Abilities. (Pokémon V, Pokémon-GX, etc. have Rule Boxes.)';

  public reduceEffect(store: StoreLike, state: State, effect: Effect): State {

    if (effect instanceof CheckPokemonPowersEffect && StateUtils.getStadiumCard(state) === this) {
      const targetPokemon = effect.target.getPokemonCard();
      if (!targetPokemon) {
        return state;
      }

      // Check if Pokemon has a Rule Box
      if (targetPokemon.tags.includes(CardTag.POKEMON_V) ||
        targetPokemon.tags.includes(CardTag.POKEMON_VMAX) ||
        targetPokemon.tags.includes(CardTag.POKEMON_VSTAR) ||
        targetPokemon.tags.includes(CardTag.POKEMON_ex) ||
        targetPokemon.tags.includes(CardTag.POKEMON_EX) ||
        targetPokemon.tags.includes(CardTag.BREAK) ||
        targetPokemon.tags.includes(CardTag.POKEMON_GX) ||
        targetPokemon.tags.includes(CardTag.PRISM_STAR) ||
        targetPokemon.tags.includes(CardTag.RADIANT)) {
        // Filter out all abilities
        effect.powers = effect.powers.filter(power =>
          power.powerType !== PowerType.ABILITY
        );
      }
    }

    if (effect instanceof PowerEffect && StateUtils.getStadiumCard(state) === this &&
      !effect.power.exemptFromAbilityLock) {

      const pokemonCard = effect.card;
      if (pokemonCard.tags.includes(CardTag.POKEMON_V) ||
        pokemonCard.tags.includes(CardTag.POKEMON_VMAX) ||
        pokemonCard.tags.includes(CardTag.POKEMON_VSTAR) ||
        pokemonCard.tags.includes(CardTag.POKEMON_ex) ||
        pokemonCard.tags.includes(CardTag.POKEMON_EX) ||
        pokemonCard.tags.includes(CardTag.BREAK) ||
        pokemonCard.tags.includes(CardTag.POKEMON_GX) ||
        pokemonCard.tags.includes(CardTag.PRISM_STAR) ||
        pokemonCard.tags.includes(CardTag.RADIANT)) {
        throw new GameError(GameMessage.CANNOT_USE_POWER);
      }
    }

    if (effect instanceof UseStadiumEffect && StateUtils.getStadiumCard(state) === this) {
      throw new GameError(GameMessage.CANNOT_USE_STADIUM);
    }
    return state;
  }
}
