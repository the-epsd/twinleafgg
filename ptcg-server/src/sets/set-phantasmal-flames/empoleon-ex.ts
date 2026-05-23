import { PowerType, State, StateUtils, StoreLike } from '../../game';
import { CardTag, CardType, Stage } from '../../game/store/card/card-types';
import { PokemonCard } from '../../game/store/card/pokemon-card';
import { AbstractAttackEffect, ApplyWeaknessEffect, DealDamageEffect, PutDamageEffect } from '../../game/store/effects/attack-effects';
import { Effect } from '../../game/store/effects/effect';
import { IS_ABILITY_BLOCKED, WAS_ATTACK_USED } from '../../game/store/prefabs/prefabs';

export class Empoleonex extends PokemonCard {
  public stage: Stage = Stage.STAGE_2;
  public evolvesFrom: string = 'Prinplup';
  public tags = [CardTag.POKEMON_ex];
  public cardType: CardType = M;
  public hp: number = 320;
  public weakness = [{ type: R }];
  public resistance = [{ type: G, value: -30 }];
  public retreat = [C, C];

  public powers = [{
    name: 'Emperor\'s Stance',
    powerType: PowerType.ABILITY,
    text: 'Prevent all effects of attacks used by your opponent\'s Pokémon done to this Pokémon. (Damage is not an effect.)'
  }];

  public attacks = [{
    name: 'Iron Feathers',
    cost: [M, M, C],
    damage: 210,
    text: 'During your opponent\'s next turn, this Pokémon takes 60 less damage from attacks (after applying Weakness and Resistance).'
  }];

  public set: string = 'PFL';
  public regulationMark: string = 'I';
  public cardImage: string = 'assets/cardback.png';
  public setNumber: string = '70';
  public name: string = 'Empoleon ex';
  public fullName: string = 'Empoleon ex PFL';

  public reduceEffect(store: StoreLike, state: State, effect: Effect): State {
    if (WAS_ATTACK_USED(effect, 0, this)) {
      effect.player.active.damageReductionNextTurn = 60;
    }

    if (effect instanceof AbstractAttackEffect && effect.target.cards.includes(this) && !IS_ABILITY_BLOCKED(store, state, effect.player, this)) {
      const sourceCard = effect.source.getPokemonCard();

      if (StateUtils.findOwner(state, effect.source) === StateUtils.findOwner(state, effect.target)) {
        return state;
      }

      if (sourceCard) {
        // Allow Weakness & Resistance
        if (effect instanceof ApplyWeaknessEffect) {
          return state;
        }
        // Allow damage
        if (effect instanceof PutDamageEffect) {
          return state;
        }
        if (effect instanceof DealDamageEffect) {
          return state;
        }
        effect.preventDefault = true;
      }
    }

    return state;
  }
}