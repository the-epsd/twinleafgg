import { PokemonCard } from '../../game/store/card/pokemon-card';
import { Stage, CardType, SpecialCondition, CardTag } from '../../game/store/card/card-types';
import { PowerType, State, StoreLike } from '../../game';
import { Effect } from '../../game/store/effects/effect';
import { AddSpecialConditionsEffect } from '../../game/store/effects/attack-effects';
import { WAS_ATTACK_USED } from '../../game/store/prefabs/prefabs';
import { DISCARD_X_ENERGY_FROM_THIS_POKEMON } from '../../game/store/prefabs/costs';
import { THIS_ATTACK_DOES_X_DAMAGE_TO_1_OF_YOUR_OPPONENTS_POKEMON } from '../../game/store/prefabs/attack-effects';

export class Steelixex extends PokemonCard {
  public stage: Stage = Stage.STAGE_1;
  public evolvesFrom: string = 'Onix';
  public tags = [CardTag.POKEMON_ex];
  public cardType: CardType = M;
  public hp: number = 150;
  public weakness = [{ type: R }, { type: F }];
  public resistance = [{ type: G, value: -30 }, { type: L, value: -30 }];
  public retreat = [C, C, C, C, C];

  public powers = [{
    name: 'Poison Resistance',
    powerType: PowerType.POKEBODY,
    text: 'Steelix ex can\'t be Poisoned.'
  }];

  public attacks = [{
    name: 'Metal Charge',
    cost: [M, C, C],
    damage: 70,
    text: 'Put 1 damage counter on Steelix ex.'
  },
  {
    name: 'Mudslide',
    cost: [F, F, C, C],
    damage: 0,
    text: 'Discard 2 [F] Energy attached to Steelix ex and choose 1 of your opponent\'s Pokémon. This attack does 100 damage to that Pokémon. (Don\'t apply Weakness and Resistance for Benched Pokémon.)'
  }];

  public set: string = 'UF';
  public cardImage: string = 'assets/cardback.png';
  public setNumber: string = '109';
  public name: string = 'Steelix ex';
  public fullName: string = 'Steelix ex UF';

  public reduceEffect(store: StoreLike, state: State, effect: Effect): State {
    if (effect instanceof AddSpecialConditionsEffect && effect.specialConditions.includes(SpecialCondition.POISONED)) {
      effect.preventDefault = true;
    }

    if (WAS_ATTACK_USED(effect, 0, this)) {
      effect.player.active.damage += 10;
    }

    if (WAS_ATTACK_USED(effect, 1, this)) {
      DISCARD_X_ENERGY_FROM_THIS_POKEMON(store, state, effect, 2, CardType.FIGHTING);
      THIS_ATTACK_DOES_X_DAMAGE_TO_1_OF_YOUR_OPPONENTS_POKEMON(100, effect, store, state);
    }

    return state;
  }
}