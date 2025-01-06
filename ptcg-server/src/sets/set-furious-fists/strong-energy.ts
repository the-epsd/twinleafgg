import { GameError } from '../../game/game-error';
import { GameMessage } from '../../game/game-message';
import { PlayerType } from '../../game/store/actions/play-card-action';
import { CardType, EnergyType } from '../../game/store/card/card-types';
import { EnergyCard } from '../../game/store/card/energy-card';
import { DealDamageEffect } from '../../game/store/effects/attack-effects';
import {
  CheckPokemonTypeEffect,
  CheckProvidedEnergyEffect
} from '../../game/store/effects/check-effects';
import { Effect } from '../../game/store/effects/effect';
import { AttachEnergyEffect, EnergyEffect } from '../../game/store/effects/play-card-effects';
import { StateUtils } from '../../game/store/state-utils';
import { State } from '../../game/store/state/state';
import { StoreLike } from '../../game/store/store-like';

export class StrongEnergy extends EnergyCard {

  public provides: CardType[] = [];

  public energyType = EnergyType.SPECIAL;

  public set: string = 'FFI';

  public name = 'Strong Energy';

  public fullName = 'Strong Energy FFI';

  public cardImage: string = 'assets/cardback.png';

  public setNumber: string = '104';

  public readonly STRONG_ENERGY_MAREKER = 'STRONG_ENERGY_MAREKER';

  public text =
    'This card can only be attached to F Pokemon. This card provides F ' +
    'Energy only while this card is attached to a F Pokemon. The attacks of ' +
    'the F Pokemon this card is attached to do 20 more damage to your ' +
    'opponent\'s Active Pokemon (before applying Weakness and Resistance). ' +
    '(If this card is attached to anything other than a F Pokemon, discard ' +
    'this card.)';

  public reduceEffect(store: StoreLike, state: State, effect: Effect): State {

    // Cannot attach to other than Fighting Pokemon
    if (effect instanceof AttachEnergyEffect && effect.energyCard === this) {
      const player = effect.player;
      const checkPokemonType = new CheckPokemonTypeEffect(effect.target);
      store.reduceEffect(state, checkPokemonType);

      try {
        const energyEffect = new EnergyEffect(player, this);
        store.reduceEffect(state, energyEffect);
      } catch {
        return state;
      }

      if (!checkPokemonType.cardTypes.includes(CardType.FIGHTING)) {
        throw new GameError(GameMessage.CANNOT_PLAY_THIS_CARD);
      }
      return state;
    }

    // Provide energy when attached to Fighting Pokemon
    if (effect instanceof CheckProvidedEnergyEffect && effect.source.cards.includes(this)) {
      const player = effect.player;
      const checkPokemonType = new CheckPokemonTypeEffect(effect.source);
      store.reduceEffect(state, checkPokemonType);

      try {
        const energyEffect = new EnergyEffect(player, this);
        store.reduceEffect(state, energyEffect);
      } catch {
        return state;
      }

      if (checkPokemonType.cardTypes.includes(CardType.FIGHTING)) {
        effect.energyMap.push({ card: this, provides: [CardType.FIGHTING] });
      }
      return state;
    }

    // Discard card when not attached to Fighting Pokemon
    if (effect instanceof AttachEnergyEffect) {
      state.players.forEach(player => {
        player.forEachPokemon(PlayerType.BOTTOM_PLAYER, cardList => {
          if (!cardList.cards.includes(this)) {
            return;
          }

          try {
            const energyEffect = new EnergyEffect(player, this);
            store.reduceEffect(state, energyEffect);
          } catch {
            return state;
          }

          const checkPokemonType = new CheckPokemonTypeEffect(cardList);
          store.reduceEffect(state, checkPokemonType);
          if (!checkPokemonType.cardTypes.includes(CardType.FIGHTING)) {
            cardList.moveCardTo(this, player.discard);
          }
        });
      });
      return state;
    }

    if (effect instanceof DealDamageEffect && effect.source.cards.includes(this)) {
      const player = effect.player;
      const opponent = StateUtils.getOpponent(state, player);

      if (effect.target !== opponent.active) {
        return state;
      }

      try {
        const energyEffect = new EnergyEffect(player, this);
        store.reduceEffect(state, energyEffect);
      } catch {
        return state;
      }

      effect.damage += 20;
    }

    return state;
  }

}
