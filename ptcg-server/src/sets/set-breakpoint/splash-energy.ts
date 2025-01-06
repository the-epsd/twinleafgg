import { Card, GameError, GameMessage, PlayerType, StateUtils } from '../../game';
import { CardType, EnergyType } from '../../game/store/card/card-types';
import { EnergyCard } from '../../game/store/card/energy-card';
import { DealDamageEffect, PutDamageEffect } from '../../game/store/effects/attack-effects';
import { CheckPokemonTypeEffect, CheckProvidedEnergyEffect } from '../../game/store/effects/check-effects';
import { Effect } from '../../game/store/effects/effect';
import { AttackEffect, KnockOutEffect } from '../../game/store/effects/game-effects';
import { BetweenTurnsEffect, EndTurnEffect } from '../../game/store/effects/game-phase-effects';
import { AttachEnergyEffect, EnergyEffect } from '../../game/store/effects/play-card-effects';
import { GamePhase, State } from '../../game/store/state/state';
import { StoreLike } from '../../game/store/store-like';

export class SplashEnergy extends EnergyCard {

  public provides: CardType[] = [CardType.COLORLESS];

  public energyType = EnergyType.SPECIAL;

  public set: string = 'BKP';

  public cardImage: string = 'assets/cardback.png';

  public setNumber: string = '113';

  public name = 'Splash Energy';

  public fullName = 'Splash Energy BKP';

  public text =
    'This card can only be attached to [W] Pokémon. This card provides [W] Energy only while this card is attached to a [W] Pokémon.' +
    '' +
    'If the [W] Pokémon this card is attached to is Knocked Out by damage from an opponent\'s attack, put that Pokémon into your hand. (Discard all cards attached to it.)' +
    '' +
    '(If this card is attached to anything other than a [W] Pokémon, discard this card.)';

  public damageDealt = false;

  public SPLASH_ENERGY_MARKER = 'SPLASH_ENERGY_MARKER';

  public reduceEffect(store: StoreLike, state: State, effect: Effect): State {

    if (effect instanceof AttachEnergyEffect && effect.energyCard === this) {
      const checkPokemonType = new CheckPokemonTypeEffect(effect.target);
      store.reduceEffect(state, checkPokemonType);

      if (!checkPokemonType.cardTypes.includes(CardType.WATER)) {
        throw new GameError(GameMessage.CANNOT_PLAY_THIS_CARD);
      }
    }

    if (effect instanceof AttackEffect && effect.target?.cards?.includes(this)) {
      this.damageDealt = false;
    }

    if ((effect instanceof DealDamageEffect || effect instanceof PutDamageEffect) &&
      effect.target.cards.includes(this)) {
      this.damageDealt = true;
    }

    if (effect instanceof EndTurnEffect && effect.player === StateUtils.getOpponent(state, effect.player)) {
      const cardList = StateUtils.findCardList(state, this);
      const owner = StateUtils.findOwner(state, cardList);

      if (owner === effect.player) {
        this.damageDealt = false;
      }
    }

    // Discard card when not attached to Water Pokemon
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

          const pokemon = cardList;
          if (pokemon.getPokemonCard()?.cardType !== CardType.WATER) {
            cardList.moveCardTo(this, player.discard);
          }
        });
      });
      return state;
    }

    if (effect instanceof CheckProvidedEnergyEffect && effect.source.cards.includes(this)) {
      const player = effect.player;

      try {
        const energyEffect = new EnergyEffect(player, this);
        store.reduceEffect(state, energyEffect);
      } catch {
        return state;
      }

      effect.energyMap.push({ card: this, provides: [CardType.WATER] });

      return state;
    }

    if (effect instanceof KnockOutEffect && effect.target.cards.includes(this) && this.damageDealt) {
      const player = effect.player;

      // Do not activate between turns, or when it's not opponents turn.
      if (state.phase !== GamePhase.ATTACK) {
        return state;
      }

      try {
        const energyEffect = new EnergyEffect(player, this);
        store.reduceEffect(state, energyEffect);
      } catch {
        return state;
      }

      const target = effect.target;
      const cards = target.getPokemons();
      cards.forEach(card => {
        player.marker.addMarker(this.SPLASH_ENERGY_MARKER, card);
      });
    }

    if (effect instanceof BetweenTurnsEffect) {
      state.players.forEach(player => {

        if (!player.marker.hasMarker(this.SPLASH_ENERGY_MARKER)) {
          return;
        }

        try {
          const energyEffect = new EnergyEffect(player, this);
          store.reduceEffect(state, energyEffect);
        } catch {
          return state;
        }

        const rescued: Card[] = player.marker.markers
          .filter(m => m.name === this.SPLASH_ENERGY_MARKER)
          .map(m => m.source)
          .filter((card): card is Card => !!card);

        player.discard.moveCardsTo(rescued, player.hand);
        player.marker.removeMarker(this.SPLASH_ENERGY_MARKER);
      });
    }

    return state;
  }

}
