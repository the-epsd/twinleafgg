import { CardType, EnergyType, Stage } from '../../game/store/card/card-types';
import { EnergyCard } from '../../game/store/card/energy-card';
import { Effect } from '../../game/store/effects/effect';
import { AttachEnergyEffect } from '../../game/store/effects/play-card-effects';
import { GET_PLAYER_BENCH_SLOTS, IS_SPECIAL_ENERGY_BLOCKED, SEARCH_YOUR_DECK_FOR_POKEMON_AND_PUT_ONTO_BENCH } from '../../game/store/prefabs/prefabs';
import { State } from '../../game/store/state/state';
import { StoreLike } from '../../game/store/store-like';
import { CheckPokemonTypeEffect, CheckProvidedEnergyEffect } from '../../game/store/effects/check-effects';
import { PokemonCard } from '../../game/store/card/pokemon-card';

export class TelepathPsychicEnergy extends EnergyCard {
  public provides: CardType[] = [CardType.PSYCHIC];
  public energyType = EnergyType.SPECIAL;
  public regulationMark = 'J';
  public set: string = 'M3';
  public name = 'Telepath Psychic Energy';
  public fullName = 'Telepath [P] Energy M3';
  public cardImage: string = 'assets/cardback.png';
  public setNumber: string = '79';
  public text = 'This card provides [P] Energy while this card is attached to a Pokemon.\n\nWhen you attach this card from your hand to 1 of your [P] Pokemon, you may search your deck for 2 Basic [P] Pokemon and put them onto your Bench. Then, shuffle your deck.';

  public reduceEffect(store: StoreLike, state: State, effect: Effect): State {
    // Provide [P] Energy
    if (effect instanceof CheckProvidedEnergyEffect && effect.source.cards.includes(this)) {
      effect.energyMap.push({ card: this, provides: [CardType.PSYCHIC] });
    }

    // When attached, search for 2 Basic Psychic Pokemon
    if (effect instanceof AttachEnergyEffect && effect.energyCard === this) {
      const player = effect.player;

      if (IS_SPECIAL_ENERGY_BLOCKED(store, state, player, this, effect.target)) {
        return state;
      }

      // Check if target is a Psychic Pokemon
      const checkType = new CheckPokemonTypeEffect(effect.target);
      store.reduceEffect(state, checkType);
      if (!checkType.cardTypes.includes(CardType.PSYCHIC)) {
        return state;
      }

      if (GET_PLAYER_BENCH_SLOTS(player).length === 0) {
        return state;
      }

      // Search for Basic Psychic Pokemon
      const basicPsychicPokemon = player.deck.cards.filter(card =>
        card instanceof PokemonCard &&
        card.stage === Stage.BASIC
      );

      // Filter for Psychic type
      const validPokemon: any[] = [];
      for (const card of basicPsychicPokemon) {
        if (card instanceof PokemonCard && card.cardType === CardType.PSYCHIC) {
          validPokemon.push(card);
        }
      }

      if (validPokemon.length === 0) {
        return state;
      }

      const maxToPut = Math.min(2, validPokemon.length, GET_PLAYER_BENCH_SLOTS(player).length);

      SEARCH_YOUR_DECK_FOR_POKEMON_AND_PUT_ONTO_BENCH(store, state, player, {
        stage: Stage.BASIC,
        cardType: CardType.PSYCHIC
      }, { min: 0, max: maxToPut });
    }

    return state;
  }
}
