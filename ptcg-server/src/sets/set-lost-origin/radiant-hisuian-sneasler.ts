import { PokemonCard } from '../../game/store/card/pokemon-card';
import { CardTag, CardType, SpecialCondition, Stage } from '../../game/store/card/card-types';
import { PlayerType, PowerType, State, StateUtils, StoreLike } from '../../game';
import { Effect } from '../../game/store/effects/effect';
import { AttackEffect, KnockOutEffect, PowerEffect } from '../../game/store/effects/game-effects';
import { AddSpecialConditionsEffect } from '../../game/store/effects/attack-effects';
import { BeginTurnEffect, BetweenTurnsEffect } from '../../game/store/effects/game-phase-effects';

export class RadiantHisuianSneasler extends PokemonCard {

  public stage: Stage = Stage.BASIC;

  public tags = [CardTag.RADIANT];

  public cardType: CardType = CardType.DARK;

  public hp: number = 130;

  public weakness = [{ type: CardType.FIGHTING }];

  public retreat = [CardType.COLORLESS];

  public powers = [{
    name: 'Poison Peak',
    powerType: PowerType.ABILITY,
    text: 'During Pokémon Checkup, put 2 more damage counters on your opponent\'s Poisoned Pokémon.'
  }];

  public attacks = [{
    name: 'Poison Jab',
    cost: [D, C, C],
    damage: 90,
    text: 'Your opponent\'s Active Pokémon is now Poisoned.'
  }];

  public set: string = 'LOR';

  public regulationMark = 'F';

  public cardImage: string = 'assets/cardback.png';

  public setNumber: string = '123';

  public name: string = 'Radiant Hisuian Sneasler';

  public fullName: string = 'Radiant Hisuian Sneasler LOR';

  private POISON_MODIFIER_MARKER = 'POISON_MODIFIER_MARKER';

  public reduceEffect(store: StoreLike, state: State, effect: Effect): State {

    if (effect instanceof BetweenTurnsEffect) {
      const player = effect.player;
      player.forEachPokemon(PlayerType.BOTTOM_PLAYER, (cardList, card) => {
        if (card === this) {

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
            opponent.active.poisonDamage += 20;
            this.marker.addMarker(this.POISON_MODIFIER_MARKER, this);
          }
        }
      });
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

    if (effect instanceof KnockOutEffect && effect.target.getPokemonCard() === this) {
      const player = effect.player;
      const opponent = StateUtils.getOpponent(state, player);
      player.forEachPokemon(PlayerType.BOTTOM_PLAYER, (cardList, card) => {
        if (card === this && this.marker.hasMarker(this.POISON_MODIFIER_MARKER)) {
          this.marker.removeMarker(this.POISON_MODIFIER_MARKER, this);
          opponent.active.poisonDamage -= 20;
        }
      });
    }

    if (effect instanceof AttackEffect && effect.attack === this.attacks[0]) {

      const specialCondition = new AddSpecialConditionsEffect(effect, [SpecialCondition.POISONED]);
      store.reduceEffect(state, specialCondition);

      return state;

    }
    return state;
  }
}


