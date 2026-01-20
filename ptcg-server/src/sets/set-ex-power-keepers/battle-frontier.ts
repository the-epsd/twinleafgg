import { Effect } from '../../game/store/effects/effect';
import { GameError } from '../../game/game-error';
import { GameMessage } from '../../game/game-message';
import { State } from '../../game/store/state/state';
import { StoreLike } from '../../game/store/store-like';
import { TrainerCard } from '../../game/store/card/trainer-card';
import { TrainerType, CardType } from '../../game/store/card/card-types';
import { StateUtils } from '../../game/store/state-utils';
import { UseStadiumEffect, PowerEffect } from '../../game/store/effects/game-effects';
import { CheckPokemonPowersEffect } from '../../game/store/effects/check-effects';
import { PokemonCardList } from '../../game/store/state/pokemon-card-list';
import { PowerType } from '../../game';
import { CheckPokemonTypeEffect } from '../../game/store/effects/check-effects';

export class BattleFrontier extends TrainerCard {

  public trainerType: TrainerType = TrainerType.STADIUM;
  public set: string = 'PK';
  public name: string = 'Battle Frontier';
  public fullName: string = 'Battle Frontier PK';
  public cardImage: string = 'assets/cardback.png';
  public setNumber: string = '71';

  public text: string =
    'Each player\'s [C] Evolved Pokémon, [D] Evolved Pokémon, and [M] Evolved Pokémon can\'t use any Poké-Powers or Poké-Bodies.';

  public reduceEffect(store: StoreLike, state: State, effect: Effect): State {

    if (effect instanceof CheckPokemonPowersEffect && StateUtils.getStadiumCard(state) === this) {
      const targetPokemon = effect.target.getPokemonCard();
      if (!targetPokemon) {
        return state;
      }

      const cardList = effect.target;
      let cardTypes = [targetPokemon.cardType];
      if (cardList instanceof PokemonCardList) {
        const checkPokemonType = new CheckPokemonTypeEffect(cardList);
        store.reduceEffect(state, checkPokemonType);
        cardTypes = checkPokemonType.cardTypes;
      }

      // We are blocking the powers from [C], [D], and [M] Pokemon
      if (cardTypes.includes(CardType.COLORLESS) ||
        cardTypes.includes(CardType.DARK) ||
        cardTypes.includes(CardType.METAL)) {
        const isEvolved = cardList instanceof PokemonCardList && cardList.getPokemons().length > 1;
        if (isEvolved) {
          // Filter out Poké Powers and Poké Bodies
          effect.powers = effect.powers.filter(power =>
            power.powerType !== PowerType.POKEBODY && power.powerType !== PowerType.POKEPOWER
          );
        }
      }
    }

    if (effect instanceof PowerEffect && StateUtils.getStadiumCard(state) === this) {
      const pokemonCard = effect.card;
      const cardList = StateUtils.findCardList(state, pokemonCard);

      let cardTypes = [effect.card.cardType];
      if (cardList instanceof PokemonCardList) {
        const checkPokemonType = new CheckPokemonTypeEffect(cardList);
        store.reduceEffect(state, checkPokemonType);
        cardTypes = checkPokemonType.cardTypes;
      }

      // We are blocking the powers from [C], [D], and [M] Pokemon
      if (!cardTypes.includes(CardType.COLORLESS) &&
        !cardTypes.includes(CardType.DARK) &&
        !cardTypes.includes(CardType.METAL)) {
        return state;
      }

      const isEvolved = cardList instanceof PokemonCardList && cardList.getPokemons().length > 1;
      if (!effect.power.exemptFromAbilityLock) {
        if (isEvolved && (effect.power.powerType === PowerType.POKEBODY || effect.power.powerType === PowerType.POKEPOWER)) {
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
