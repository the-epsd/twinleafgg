import { PokemonCard } from '../../../game/store/card/pokemon-card';
import { CardType, Stage } from '../../../game/store/card/card-types';
import { PowerType, State, StateUtils, StoreLike } from '../../../game';
import { Effect } from '../../../game/store/effects/effect';
import { AbstractAttackEffect, ApplyWeaknessEffect, DealDamageEffect, PutDamageEffect } from '../../../game/store/effects/attack-effects';
import { OPPONENTS_POKEMON_CANNOT_USE_THAT_ATTACK } from '../../../game/store/prefabs/effect-of-attack-prefabs';
import { IS_POKEBODY_BLOCKED, WAS_ATTACK_USED } from '../../../game/store/prefabs/prefabs';

export class Bibarel extends PokemonCard {
  public stage: Stage = Stage.STAGE_1;
  public evolvesFrom: string = 'Bidoof';
  public hp: number = 100;
  public cardType: CardType[] = [W];
  public weakness = [{ type: F, value: +30 }];
  public retreat = [C, C, C];

  public powers = [{
    name: 'Unaware',
    powerType: PowerType.POKEBODY,
    text: 'Prevent all effects of attacks, excluding damage, done to Bibarel.'
  }];

  public attacks = [{
    name: 'Amnesia',
    cost: [C, C],
    damage: 20,
    text: 'Choose 1 of the Defending Pokémon\'s attacks. That Pokémon can\'t use that attack during your opponent\'s next turn.'
  },
  {
    name: 'Surf',
    cost: [W, W],
    damage: 60,
    text: ''
  }];

  public set: string = 'SF';
  public cardImage: string = 'assets/cardback.png';
  public setNumber: string = '32';
  public name: string = 'Bibarel';
  public fullName: string = 'Bibarel SF';

  public reduceEffect(store: StoreLike, state: State, effect: Effect): State {
    // Unaware
    if (effect instanceof AbstractAttackEffect && effect.target.getPokemonCard() === this) {
      const owner = StateUtils.findOwner(state, effect.target);
      if (effect.player === owner) {
        return state;
      }
      if (IS_POKEBODY_BLOCKED(store, state, owner, this)) {
        return state;
      }
      if (effect instanceof ApplyWeaknessEffect
        || effect instanceof PutDamageEffect
        || effect instanceof DealDamageEffect) {
        return state;
      }
      effect.preventDefault = true;
    }

    // Amnesia
    if (WAS_ATTACK_USED(effect, 0, this)) {
      OPPONENTS_POKEMON_CANNOT_USE_THAT_ATTACK(store, state, effect, this);
    }

    return state;
  }
}
