import { PokemonCard } from '../../game/store/card/pokemon-card';
import { Stage, CardType, EnergyType } from '../../game/store/card/card-types';
import { PowerType } from '../../game/store/card/pokemon-types';
import { StoreLike } from '../../game/store/store-like';
import { GamePhase, State } from '../../game/store/state/state';
import { Effect } from '../../game/store/effects/effect';
import { PutDamageEffect } from '../../game/store/effects/attack-effects';
import { StateUtils } from '../../game/store/state-utils';
import { EnergyCard } from '../../game/store/card/energy-card';
import { IS_ABILITY_BLOCKED, WAS_ATTACK_USED } from '../../game/store/prefabs/prefabs';

export class Wailord extends PokemonCard {
  public regulationMark = 'F';
  public stage: Stage = Stage.STAGE_1;
  public evolvesFrom = 'Wailmer';
  public cardType: CardType = CardType.WATER;
  public hp: number = 200;
  public weakness = [{ type: CardType.LIGHTNING }];
  public retreat = [CardType.COLORLESS, CardType.COLORLESS, CardType.COLORLESS, CardType.COLORLESS];

  public powers = [{
    name: 'Jumbo Sized',
    powerType: PowerType.ABILITY,
    text: 'This Pokemon takes 30 less damage from attacks (after applying Weakness and Resistance).'
  }];

  public attacks = [{
    name: 'Special Wave',
    cost: [CardType.WATER, CardType.WATER, CardType.WATER, CardType.COLORLESS],
    damage: 120,
    damageCalculation: '+',
    text: 'If this Pokemon has any Special Energy attached, this attack does 120 more damage.'
  }];

  public set: string = 'SIT';
  public cardImage: string = 'assets/cardback.png';
  public setNumber: string = '38';
  public name: string = 'Wailord';
  public fullName: string = 'Wailord SIT';
  public reduceEffect(store: StoreLike, state: State, effect: Effect): State {

    if (effect instanceof PutDamageEffect && effect.target.cards.includes(this)) {
      const pokemonCard = effect.target.getPokemonCard();

      // It's not this pokemon card
      if (pokemonCard !== this) {
        return state;
      }

      // It's not an attack
      if (state.phase !== GamePhase.ATTACK) {
        return state;
      }

      const player = StateUtils.findOwner(state, effect.target);

      // Try to reduce PowerEffect, to check if something is blocking our ability
      if (IS_ABILITY_BLOCKED(store, state, player, this)) {
        return state;
      }

      effect.damage = Math.max(0, effect.damage - 30);
    }

    if (WAS_ATTACK_USED(effect, 0, this)) {
      const player = effect.player;
      const pokemon = player.active;

      let specialEnergyCount = 0;

      pokemon.cards.forEach(c => {
        if (c instanceof EnergyCard) {
          if (c.energyType === EnergyType.SPECIAL) {
            specialEnergyCount++;
          }
        }
      });

      if (specialEnergyCount > 0) {
        effect.damage += 120;
      }
    }


    return state;
  }
}