import { PokemonCard } from '../../game/store/card/pokemon-card';
import { Stage, CardType, SpecialCondition } from '../../game/store/card/card-types';
import { PowerType, State, StoreLike } from '../../game';
import { Effect } from '../../game/store/effects/effect';
import { AddSpecialConditionsEffect } from '../../game/store/effects/attack-effects';
import { WAS_ATTACK_USED } from '../../game/store/prefabs/prefabs';

export class Zangoose extends PokemonCard {
  public stage: Stage = Stage.BASIC;
  public cardType: CardType = C;
  public hp: number = 70;
  public weakness = [{ type: F }];
  public retreat = [C];

  public powers = [{
    name: 'Poison Resistance',
    powerType: PowerType.POKEBODY,
    text: 'Zangoose can\'t be Poisoned.'
  }];

  public attacks = [{
    name: 'Target Slash',
    cost: [C],
    damage: 10,
    damageCalculation: '+',
    text: 'If the Defending Pokémon is Seviper, this attack does 10 damage plus 30 more damage.'
  },
  {
    name: 'Super Slash',
    cost: [C, C, C],
    damage: 30,
    damageCalculation: '+',
    text: 'If the Defending Pokémon is an Evolved Pokémon, this attack does 30 damage plus 30 more damage.'
  }];

  public set: string = 'SS';
  public cardImage: string = 'assets/cardback.png';
  public setNumber: string = '14';
  public name: string = 'Zangoose';
  public fullName: string = 'Zangoose SS';

  public reduceEffect(store: StoreLike, state: State, effect: Effect): State {
    if (effect instanceof AddSpecialConditionsEffect && effect.specialConditions.includes(SpecialCondition.POISONED) && effect.target.getPokemonCard() === this) {
      effect.preventDefault = true;
    }

    if (WAS_ATTACK_USED(effect, 0, this)) {
      if (effect.opponent.active.getPokemonCard()?.name === 'Seviper') {
        effect.damage += 30;
      }
    }

    if (WAS_ATTACK_USED(effect, 1, this)) {
      if (effect.opponent.active.getPokemons().length > 1) {
        effect.damage += 30;
      }
    }

    return state;
  }
}
