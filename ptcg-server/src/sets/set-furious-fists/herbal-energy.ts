import { GameError } from '../../game/game-error';
import { GameMessage } from '../../game/game-message';
import { PlayerType } from '../../game/store/actions/play-card-action';
import { CardType, EnergyType } from '../../game/store/card/card-types';
import { EnergyCard } from '../../game/store/card/energy-card';
import {
  CheckPokemonTypeEffect,
  CheckProvidedEnergyEffect,
} from '../../game/store/effects/check-effects';
import { Effect } from '../../game/store/effects/effect';
import { HealEffect } from '../../game/store/effects/game-effects';
import { AttachEnergyEffect, EnergyEffect } from '../../game/store/effects/play-card-effects';
import { State } from '../../game/store/state/state';
import { StoreLike } from '../../game/store/store-like';

export class HerbalEnergy extends EnergyCard {

  public provides: CardType[] = [];

  public energyType = EnergyType.SPECIAL;

  public set: string = 'FFI';

  public name = 'Herbal Energy';

  public fullName = 'Herbal Energy FFI';

  public cardImage: string = 'assets/cardback.png';

  public setNumber: string = '103';

  public text =
    'This card can only be attached to [G] Pokémon. This card provides [G] Energy only while this card is attached to a [G] Pokémon. When you attach this card from your hand to 1 of your [G] Pokémon, heal 30 damage from that Pokémon. (If this card is attached to anything other than a [G] Pokémon, discard this card.)';

  public reduceEffect(store: StoreLike, state: State, effect: Effect): State {

    // Cannot attach to other than GRASS Pokemon
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

      if (!checkPokemonType.cardTypes.includes(CardType.GRASS)) {
        throw new GameError(GameMessage.CANNOT_PLAY_THIS_CARD);
      }

      const healEffect = new HealEffect(player, effect.target, 30);
      store.reduceEffect(state, healEffect);

      return state;
    }

    // Provide energy when attached to GRASS Pokemon
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

      if (checkPokemonType.cardTypes.includes(CardType.GRASS)) {
        effect.energyMap.push({ card: this, provides: [CardType.GRASS] });
      }
      return state;
    }

    // Discard card when not attached to GRASS Pokemon
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
          if (!checkPokemonType.cardTypes.includes(CardType.GRASS)) {
            cardList.moveCardTo(this, player.discard);
          }
        });
      });
      return state;
    }

    return state;
  }

}
