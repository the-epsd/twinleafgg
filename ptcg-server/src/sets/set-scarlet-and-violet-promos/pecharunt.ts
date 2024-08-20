import { PokemonCard } from '../../game/store/card/pokemon-card';
import { Stage, CardType, SpecialCondition } from '../../game/store/card/card-types';
import { PowerType } from '../../game/store/card/pokemon-types';
import { StoreLike, State, PlayerType, StateUtils, GameError, GameMessage } from '../../game';
import { Effect } from '../../game/store/effects/effect';
import { BeginTurnEffect, BetweenTurnsEffect, EndTurnEffect } from '../../game/store/effects/game-phase-effects';
import { AttackEffect, PowerEffect, RetreatEffect } from '../../game/store/effects/game-effects';

export class Pecharunt extends PokemonCard {
  public stage: Stage = Stage.BASIC;
  public cardType: CardType = CardType.DARK;
  public hp: number = 80;
  public retreat = [CardType.COLORLESS];
  public weakness = [{ type: CardType.FIGHTING }];

  public powers = [{
    name: 'Toxic Subjugation',
    powerType: PowerType.ABILITY,
    text: 'As long as this Pokémon is in the Active Spot, put 5 more damage counters on your opponent\'s'
      + ' Poisoned Pokémon during Pokémon Checkup.'
  }];

  public attacks = [{
    name: 'Poison Chain',
    cost: [CardType.DARK, CardType.COLORLESS],
    damage: 10,
    text: 'Your opponent\'s Active Pokémon is now Poisoned.During your opponent\'s next turn, that Pokémon can\'t retreat.'
  }];

  public regulationMark = 'H';
  public set: string = 'SVP';
  public name: string = 'Pecharunt';
  public fullName: string = 'Pecharunt SVP';
  public cardImage: string = 'assets/cardback.png';
  public setNumber: string = '149';

  public readonly DEFENDING_POKEMON_CANNOT_RETREAT_MARKER = 'DEFENDING_POKEMON_CANNOT_RETREAT_MARKER';

  private POISON_MODIFIER_MARKER = 'POISON_MODIFIER_MARKER';

  public reduceEffect(store: StoreLike, state: State, effect: Effect): State {
    if (effect instanceof BetweenTurnsEffect) {
      const player = effect.player;

      if (player.active.cards[0] !== this) {
        return state; // Not active
      }

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

      if (this.marker.hasMarker(this.POISON_MODIFIER_MARKER)) {
        return state;
      }

      const opponent = StateUtils.getOpponent(state, player);
      if (opponent.active.specialConditions.includes(SpecialCondition.POISONED)) {
        opponent.active.poisonDamage += 50;
        this.marker.addMarker(this.POISON_MODIFIER_MARKER, this);
      }
    }

    if (effect instanceof BeginTurnEffect) {
      const player = effect.player;
      const opponent = StateUtils.getOpponent(state, player);
      player.forEachPokemon(PlayerType.BOTTOM_PLAYER, (cardList, card) => {
        if (card === this && this.marker.hasMarker(this.POISON_MODIFIER_MARKER)) {
          this.marker.removeMarker(this.POISON_MODIFIER_MARKER, this);
          opponent.active.poisonDamage -= 50;
        }
      });
    }

    if (effect instanceof AttackEffect && effect.attack === this.attacks[0]) {
      const player = effect.player;
      const opponent = StateUtils.getOpponent(state, player);
      opponent.active.attackMarker.addMarker(this.DEFENDING_POKEMON_CANNOT_RETREAT_MARKER, this);
    }

    if (effect instanceof RetreatEffect && effect.player.active.attackMarker.hasMarker(this.DEFENDING_POKEMON_CANNOT_RETREAT_MARKER, this)) {
      throw new GameError(GameMessage.BLOCKED_BY_EFFECT);
    }

    if (effect instanceof EndTurnEffect) {
      effect.player.active.attackMarker.removeMarker(this.DEFENDING_POKEMON_CANNOT_RETREAT_MARKER, this);
    }

    return state;
  }
}