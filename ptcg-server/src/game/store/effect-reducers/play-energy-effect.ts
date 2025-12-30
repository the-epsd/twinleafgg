import { AttachEnergyEffect } from '../effects/play-card-effects';
import { GameError } from '../../game-error';
import { GameMessage, GameLog } from '../../game-message';
import { Effect } from '../effects/effect';
import { State } from '../state/state';
import { StoreLike } from '../store-like';
import { EnergyType } from '../card/card-types';


export function playEnergyReducer(store: StoreLike, state: State, effect: Effect): State {


  /* Play energy card */
  if (effect instanceof AttachEnergyEffect) {
    const pokemonCard = effect.target.getPokemonCard();
    if (pokemonCard === undefined) {
      throw new GameError(GameMessage.INVALID_TARGET);
    }
    if (effect.energyCard.energyType === EnergyType.SPECIAL
      && effect.player.marker.hasMarker(effect.player.ATTACK_EFFECT_SPECIAL_ENERGY_LOCK)) {
      throw new GameError(GameMessage.BLOCKED_BY_EFFECT);
    }

    store.log(state, GameLog.LOG_PLAYER_ATTACHES_CARD, {
      name: effect.player.name,
      card: effect.energyCard.name,
      pokemon: pokemonCard.name
    });
    // Move card to main PokemonCardList first (so it's in the cards array)
    effect.player.hand.moveCardTo(effect.energyCard, effect.target);
    // Then also add it to the energies CardList
    if (!effect.target.energies.cards.includes(effect.energyCard)) {
      effect.target.energies.cards.push(effect.energyCard);
    }
    return state;
  }

  return state;
}

