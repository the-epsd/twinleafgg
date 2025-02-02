import { PokemonCard } from '../../game/store/card/pokemon-card';
import { Stage, CardType, CardTag } from '../../game/store/card/card-types';
import { StoreLike } from '../../game/store/store-like';
import { State } from '../../game/store/state/state';
import { Effect } from '../../game/store/effects/effect';
import { PowerEffect, AttackEffect } from '../../game/store/effects/game-effects';
import { PutDamageEffect } from '../../game/store/effects/attack-effects';
import { PowerType } from '../../game/store/card/pokemon-types';
import { StateUtils } from '../../game/store/state-utils';
import { CheckProvidedEnergyEffect } from '../../game/store/effects/check-effects';

export class RadiantGardevoir extends PokemonCard {

  public stage: Stage = Stage.BASIC;

  public regulationMark = 'F';

  public tags = [CardTag.RADIANT];

  public cardType: CardType = CardType.PSYCHIC;

  public hp: number = 130;

  public weakness = [{ type: CardType.METAL }];

  public retreat = [CardType.COLORLESS, CardType.COLORLESS];

  public powers = [{
    name: 'Loving Veil',
    powerType: PowerType.ABILITY,
    text: 'All of your Pokémon take 20 less damage from attacks from your opponent\'s Pokémon V (after applying Weakness and Resistance).'
  }];

  public attacks = [{
    name: 'Psychic',
    cost: [CardType.PSYCHIC, CardType.COLORLESS, CardType.COLORLESS],
    damage: 70,
    damageCalculation: '+',
    text: 'This attack does 20 more damage for each Energy attached to your opponent\'s Active Pokémon.'
  }];

  public set: string = 'LOR';

  public cardImage: string = 'assets/cardback.png';

  public setNumber: string = '69';

  public name: string = 'Radiant Gardevoir';

  public fullName: string = 'Radiant Gardevoir LOR';

  public reduceEffect(store: StoreLike, state: State, effect: Effect): State {

    if (effect instanceof AttackEffect && effect.attack === this.attacks[0]) {
      const player = effect.player;
      const opponent = StateUtils.getOpponent(state, player);

      const checkProvidedEnergyEffect = new CheckProvidedEnergyEffect(opponent);
      store.reduceEffect(state, checkProvidedEnergyEffect);
      const energyCount = checkProvidedEnergyEffect.energyMap
        .reduce((left, p) => left + p.provides.length, 0);

      effect.damage += energyCount * 20;
    }


    // Reduce damage by 20
    if (effect instanceof PutDamageEffect) {
      const sourceCard = effect.source.getPokemonCard();
      const player = effect.player;
      const targetPlayer = StateUtils.findOwner(state, effect.target);

      // Check if the attack is from a Pokémon V, VSTAR, or VMAX
      if (sourceCard && sourceCard.tags.includes(CardTag.POKEMON_V) || sourceCard && sourceCard.tags.includes(CardTag.POKEMON_VMAX) || sourceCard && sourceCard.tags.includes(CardTag.POKEMON_VSTAR)) {
        // Check if the damage target is owned by this card's owner
        if (targetPlayer === player) {
          // Try to reduce PowerEffect, to check if something is blocking our ability
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

          effect.damage = Math.max(0, effect.damage - 20);
        }
      }
    }
    return state;
  }
}