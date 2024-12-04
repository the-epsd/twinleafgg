import { PokemonCard } from '../../game/store/card/pokemon-card';
import { Stage, CardType, BoardEffect } from '../../game/store/card/card-types';
import { GameError, GameMessage, PlayerType, PowerType, State, StateUtils, StoreLike } from '../../game';
import { Effect } from '../../game/store/effects/effect';
import { AttackEffect, PowerEffect } from '../../game/store/effects/game-effects';
import { AbstractAttackEffect, ApplyWeaknessEffect, PutDamageEffect, DealDamageEffect } from '../../game/store/effects/attack-effects';
import { EndTurnEffect } from '../../game/store/effects/game-phase-effects';

export class Slurpuff extends PokemonCard {
  public stage: Stage = Stage.STAGE_1;
  public cardType: CardType = Y;
  public hp: number = 90;
  public weakness = [{ type: M }];
  public resistance = [{ type: D, value: -20 }]
  public retreat = [C];
  public evolvesFrom = 'Swirlix';

  public powers = [{
    name: 'Tasting',
    useWhenInPlay: true,
    powerType: PowerType.ABILITY,
    text: 'Once during your turn (before your attack), you may draw a card. If this Pokémon is your Active Pokémon, draw 1 more card.'
  }];

  public attacks = [{
    name: 'Light Pulse',
    cost: [Y, C, C],
    damage: 60,
    text: 'Prevent all effects of your opponent\'s attacks, except damage, done to this Pokémon during your opponent\'s next turn.'
  }];

  public set: string = 'PHF';
  public name: string = 'Slurpuff';
  public fullName: string = 'Slurpuff PHF';
  public cardImage: string = 'assets/cardback.png';
  public setNumber: string = '69';

  public readonly TASTING_MARKER = 'TASTING_MARKER';

  public readonly LIGHT_PULSE_MARKER = 'LIGHT_PULSE_MARKER';
  public readonly CLEAR_LIGHT_PULSE_MARKER = 'CLEAR_LIGHT_PULSE_MARKER';

  public reduceEffect(store: StoreLike, state: State, effect: Effect): State {

    if (effect instanceof AttackEffect && effect.attack === this.attacks[0]) {
      const player = effect.player;
      const opponent = StateUtils.getOpponent(state, player);

      player.active.attackMarker.addMarker(this.LIGHT_PULSE_MARKER, this);
      opponent.attackMarker.addMarker(this.CLEAR_LIGHT_PULSE_MARKER, this);
    }

    // Prevent effects of attacks
    if (effect instanceof AbstractAttackEffect && effect.target.attackMarker.hasMarker(this.LIGHT_PULSE_MARKER)) {

      const pokemonCard = effect.target.getPokemonCard();
      const sourceCard = effect.source.getPokemonCard();

      if (pokemonCard !== this) {
        return state;
      }

      if (sourceCard) {
        // if (effect instanceof AbstractAttackEffect && effect.target.cards.includes(this)) {

        // Try to reduce PowerEffect, to check if something is blocking our ability
        try {
          const player = StateUtils.findOwner(state, effect.target);
          const stub = new PowerEffect(player, {
            name: 'test',
            powerType: PowerType.ABILITY,
            text: ''
          }, this);
          store.reduceEffect(state, stub);
        } catch {
          return state;
        }
        // Allow Weakness & Resistance
        if (effect instanceof ApplyWeaknessEffect) {
          return state;
        }
        // Allow damage
        if (effect instanceof PutDamageEffect) {
          return state;
        }
        // Allow damage
        if (effect instanceof DealDamageEffect) {
          return state;
        }

        effect.preventDefault = true;
      }
    }

    if (effect instanceof EndTurnEffect
      && effect.player.attackMarker.hasMarker(this.CLEAR_LIGHT_PULSE_MARKER, this)) {

      effect.player.attackMarker.removeMarker(this.CLEAR_LIGHT_PULSE_MARKER, this);

      const opponent = StateUtils.getOpponent(state, effect.player);
      opponent.forEachPokemon(PlayerType.TOP_PLAYER, (cardList) => {
        cardList.attackMarker.removeMarker(this.LIGHT_PULSE_MARKER, this);
      });
    }

    if (effect instanceof PowerEffect && effect.power === this.powers[0]) {
      const player = effect.player;

      // Check to see if anything is blocking our Ability
      try {
        const stub = new PowerEffect(player, {
          name: 'test',
          powerType: PowerType.ABILITY,
          text: ''
        }, this);
        store.reduceEffect(state, stub);
      } catch {
        return state;
      }


      if (player.marker.hasMarker(this.TASTING_MARKER, this)) {
        throw new GameError(GameMessage.POWER_ALREADY_USED);
      }

      const isActive = player.active.getPokemonCard() === this;

      if (isActive) {
        player.deck.moveTo(player.hand, 2);
      } else {
        player.deck.moveTo(player.hand, 1);
      }

      player.marker.addMarker(this.TASTING_MARKER, this);

      player.forEachPokemon(PlayerType.BOTTOM_PLAYER, cardList => {
        if (cardList.getPokemonCard() === this) {
          cardList.addBoardEffect(BoardEffect.ABILITY_USED);
        }
      });
    }

    if (effect instanceof EndTurnEffect) {
      const player = effect.player;
      player.marker.removeMarker(this.TASTING_MARKER);
      return state;
    }

    return state;
  }
}