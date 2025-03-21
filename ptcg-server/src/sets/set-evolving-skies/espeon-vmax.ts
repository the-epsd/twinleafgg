import { PokemonCard } from '../../game/store/card/pokemon-card';
import { Stage, CardType, CardTag } from '../../game/store/card/card-types';
import {
  StoreLike, State, StateUtils, PowerType,
  PlayerType,
  EnergyCard
} from '../../game';
import { AttackEffect, PowerEffect } from '../../game/store/effects/game-effects';
import { Effect } from '../../game/store/effects/effect';
import { CheckProvidedEnergyEffect } from '../../game/store/effects/check-effects';
import { AbstractAttackEffect, ApplyWeaknessEffect, DealDamageEffect, PutDamageEffect } from '../../game/store/effects/attack-effects';

export class EspeonVMAX extends PokemonCard {

  public tags = [CardTag.POKEMON_VMAX];

  public stage: Stage = Stage.VMAX;

  public evolvesFrom = 'Espeon V';

  public cardType: CardType = CardType.PSYCHIC;

  public hp: number = 310;

  public weakness = [{ type: CardType.DARK }];

  public resistance = [{ type: CardType.FIGHTING, value: -30 }];

  public retreat = [CardType.COLORLESS, CardType.COLORLESS];

  public powers = [{
    name: 'Solar Revelation',
    powerType: PowerType.ABILITY,
    text: 'Prevent all effects of attacks from your opponent\'s Pokémon done to all of your Pokémon that have Energy attached. (Existing effects are not removed. Damage is not an effect.)'
  }];

  public attacks = [
    {
      name: 'Max Mindstorm',
      cost: [CardType.PSYCHIC, CardType.COLORLESS, CardType.COLORLESS],
      damage: 60,
      text: 'This attack does 60 damage for each Energy attached to all of your opponent\'s Pokémon.'
    }
  ];

  public set: string = 'EVS';

  public cardImage: string = 'assets/cardback.png';

  public setNumber: string = '65';

  public name: string = 'Espeon VMAX';

  public fullName: string = 'Espeon VMAX EVS';

  public reduceEffect(store: StoreLike, state: State, effect: Effect): State {

    if (effect instanceof AttackEffect && effect.attack === this.attacks[0]) {

      const player = effect.player;
      const opponent = StateUtils.getOpponent(state, player);

      let energies = 0;
      opponent.forEachPokemon(PlayerType.TOP_PLAYER, (cardList, card) => {
        const checkProvidedEnergyEffect = new CheckProvidedEnergyEffect(player, cardList);
        store.reduceEffect(state, checkProvidedEnergyEffect);
        checkProvidedEnergyEffect.energyMap.forEach(energy => {
          energies += energy.provides.length;
        });
      });

      effect.damage = energies * 60;
    }

    if (effect instanceof AbstractAttackEffect) {
      const sourceCard = effect.source.getPokemonCard();
      const player = effect.player;
      const opponent = StateUtils.getOpponent(state, player);

      let isToedscruelInPlay = false;

      player.forEachPokemon(PlayerType.BOTTOM_PLAYER, (cardList, card) => {
        if (card === this) {
          isToedscruelInPlay = true;
        }
      });
      opponent.forEachPokemon(PlayerType.TOP_PLAYER, (cardList, card) => {
        if (card === this) {
          isToedscruelInPlay = true;
        }
      });

      if (!isToedscruelInPlay) {
        return state;
      }

      if (sourceCard && effect.target.cards.some(c => c instanceof EnergyCard)) {

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
    return state;
  }
}
