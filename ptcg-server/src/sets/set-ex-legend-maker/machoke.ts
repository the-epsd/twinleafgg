import { PokemonCard } from '../../game/store/card/pokemon-card';
import { Stage, CardType, SpecialCondition } from '../../game/store/card/card-types';
import { PowerType, State, StoreLike } from '../../game';
import { Effect } from '../../game/store/effects/effect';
import { IS_POKEBODY_BLOCKED, WAS_ATTACK_USED } from '../../game/store/prefabs/prefabs';
import { DealDamageEffect } from '../../game/store/effects/attack-effects';

export class Machoke extends PokemonCard {
  public stage: Stage = Stage.STAGE_1;
  public evolvesFrom: string = 'Machop';
  public cardType: CardType = F;
  public hp: number = 80;
  public weakness = [{ type: P }];
  public retreat = [C];

  public powers = [{
    name: 'Paranoid',
    powerType: PowerType.POKEBODY,
    text: 'As long as Machoke is Confused, Machoke\'s attacks do 50 more damage to the Defending Pokémon (before applying Weakness and Resistance).'
  }];

  public attacks = [{
    name: 'Split Kick',
    cost: [F],
    damage: 0,
    text: 'Does 20 damage to each Defending Pokémon.'
  },
  {
    name: 'Magnum Punch',
    cost: [C, C, C],
    damage: 40,
    text: ''
  }];

  public set: string = 'LM';
  public cardImage: string = 'assets/cardback.png';
  public setNumber: string = '39';
  public name: string = 'Machoke';
  public fullName: string = 'Machoke LM';

  public reduceEffect(store: StoreLike, state: State, effect: Effect): State {

    if (effect instanceof DealDamageEffect && effect.player.active.getPokemonCard() === this) {
      const player = effect.player;

      if (IS_POKEBODY_BLOCKED(store, state, player, this)) {
        return state;
      }

      if (player.active.specialConditions.includes(SpecialCondition.CONFUSED)) {
        effect.damage += 50;
      }
    }

    if (WAS_ATTACK_USED(effect, 0, this)) {
      effect.damage = 20;
    }

    return state;
  }
}
