import { PowerType, State, StoreLike } from '../../game';
import { CardType, SpecialCondition, Stage } from '../../game/store/card/card-types';
import { PokemonCard } from '../../game/store/card/pokemon-card';
import { AddSpecialConditionsEffect } from '../../game/store/effects/attack-effects';
import { Effect } from '../../game/store/effects/effect';
import { HEAL_X_DAMAGE_FROM_THIS_POKEMON, WAS_ATTACK_USED } from '../../game/store/prefabs/prefabs';

export class Golbat extends PokemonCard {
  public stage: Stage = Stage.STAGE_1;
  public evolvesFrom: string = 'Zubat';
  public cardType: CardType = G;
  public hp: number = 70;
  public weakness = [{ type: P }];
  public retreat = [];

  public powers = [{
    name: 'Self-control',
    powerType: PowerType.POKEBODY,
    text: 'Golbat can\'t be Paralyzed.'
  }];

  public attacks = [{
    name: 'Spiral Drain',
    cost: [G, C],
    damage: 20,
    text: 'Remove 1 damage counter from Golbat.'
  }];

  public set: string = 'DX';
  public cardImage: string = 'assets/cardback.png';
  public setNumber: string = '31';
  public name: string = 'Golbat';
  public fullName: string = 'Golbat DX';

  public reduceEffect(store: StoreLike, state: State, effect: Effect): State {

    if (effect instanceof AddSpecialConditionsEffect && effect.specialConditions.includes(SpecialCondition.PARALYZED) && effect.target.getPokemonCard() === this) {
      effect.preventDefault = true;
    }

    if (WAS_ATTACK_USED(effect, 0, this)) {
      HEAL_X_DAMAGE_FROM_THIS_POKEMON(effect, store, state, 20);
    }

    return state;
  }
}