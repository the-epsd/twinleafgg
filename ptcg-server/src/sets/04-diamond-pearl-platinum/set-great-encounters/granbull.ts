import { PokemonCard } from '../../../game/store/card/pokemon-card';
import { CardType, Stage } from '../../../game/store/card/card-types';
import { State, StoreLike } from '../../../game';
import { Effect } from '../../../game/store/effects/effect';
import { WAS_ATTACK_USED } from '../../../game/store/prefabs/prefabs';
import { DEFENDING_POKEMON_DOES_LESS_DAMAGE } from '../../../game/store/prefabs/effect-of-attack-prefabs';

export class Granbull extends PokemonCard {
  public stage: Stage = Stage.STAGE_1;
  public evolvesFrom: string = 'Snubbull';
  public hp: number = 90;
  public cardType: CardType[] = [C];
  public weakness = [{ type: F, value: +20 }];
  public retreat = [C, C];

  public attacks = [{
    name: 'Daunt',
    cost: [C, C],
    damage: 30,
    text: 'During your opponent\'s next turn, any damage done by attacks from the Defending Pokémon is reduced by 20 (before applying Weakness and Resistance).'
  },
  {
    name: 'Rage',
    cost: [C, C, C, C],
    damage: 40,
    damageCalculation: '+',
    text: 'Does 40 damage plus 10 more damage for each damage counter on Granbull.'
  }];

  public set: string = 'GE';
  public cardImage: string = 'assets/cardback.png';
  public setNumber: string = '39';
  public name: string = 'Granbull';
  public fullName: string = 'Granbull GE';

  public reduceEffect(store: StoreLike, state: State, effect: Effect): State {
    // Daunt
    if (WAS_ATTACK_USED(effect, 0, this)) {
      return DEFENDING_POKEMON_DOES_LESS_DAMAGE(store, state, effect, this, 20);
    }

    // Rage
    if (WAS_ATTACK_USED(effect, 1, this)) {
      effect.damage += effect.player.active.damage;
    }

    return state;
  }
}
