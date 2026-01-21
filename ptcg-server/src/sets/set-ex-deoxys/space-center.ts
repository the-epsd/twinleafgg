import { Effect } from '../../game/store/effects/effect';
import { GameError } from '../../game/game-error';
import { GameMessage } from '../../game/game-message';
import { State } from '../../game/store/state/state';
import { StoreLike } from '../../game/store/store-like';
import { TrainerCard } from '../../game/store/card/trainer-card';
import { TrainerType, CardTag } from '../../game/store/card/card-types';
import { StateUtils } from '../../game/store/state-utils';
import { UseStadiumEffect, PowerEffect } from '../../game/store/effects/game-effects';
import { CheckPokemonPowersEffect } from '../../game/store/effects/check-effects';
import { PokemonCardList } from '../../game/store/state/pokemon-card-list';
import { PowerType } from '../../game';

export class SpaceCenter extends TrainerCard {
  public trainerType: TrainerType = TrainerType.STADIUM;
  public set: string = 'DX';
  public name: string = 'Space Center';
  public fullName: string = 'Space Center DX';
  public cardImage: string = 'assets/cardback.png';
  public setNumber: string = '91';

  public text: string =
    'Ignore Poké-Bodies for all Basic Pokémon in play (both yours and your opponent\'s) (excluding Pokémon-ex and Pokémon that has an owner in its name).';

  public reduceEffect(store: StoreLike, state: State, effect: Effect): State {

    if (effect instanceof CheckPokemonPowersEffect && StateUtils.getStadiumCard(state) === this) {
      const targetPokemon = effect.target;
      if (!targetPokemon) {
        return state;
      }

      const cardList = effect.target;
      // ex era ruling is that this should mean unevolved
      const isBasic = cardList instanceof PokemonCardList && (cardList.getPokemons().length === 1 || targetPokemon.tags.includes(CardTag.LEGEND));

      // Also should not block owner pokemon, but thats a future me problem
      if (isBasic && !targetPokemon.tags.includes(CardTag.POKEMON_ex)) {
        // Filter out Poké Bodies
        effect.powers = effect.powers.filter(power =>
          power.powerType !== PowerType.POKEBODY
        );
      }
    }

    if (effect instanceof PowerEffect && StateUtils.getStadiumCard(state) === this) {
      const pokemonCard = effect.card;
      const cardList = StateUtils.findCardList(state, pokemonCard) as PokemonCardList;

      // ex era ruling is that this should mean unevolved
      const isBasic = cardList.getPokemons().length === 1 || pokemonCard.tags.includes(CardTag.LEGEND);

      // Also should not block owner pokemon, but thats a future me problem
      if (!effect.power.exemptFromAbilityLock) {
        if (isBasic && !effect.card.tags.includes(CardTag.POKEMON_ex) && pokemonCard.powers.some(power => power.powerType === PowerType.POKEBODY)) {
          throw new GameError(GameMessage.BLOCKED_BY_EFFECT);
        }
      }
    }

    if (effect instanceof UseStadiumEffect && StateUtils.getStadiumCard(state) === this) {
      throw new GameError(GameMessage.CANNOT_USE_STADIUM);
    }

    return state;
  }

}
