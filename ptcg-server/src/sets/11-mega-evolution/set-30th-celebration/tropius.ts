import { PokemonCard } from '../../../game/store/card/pokemon-card';
import { Stage, CardType } from '../../../game/store/card/card-types';
import { StoreLike, State } from '../../../game';
import { Effect } from '../../../game/store/effects/effect';
import { WAS_ATTACK_USED, WAS_POKEMON_KNOCKED_OUT_DURING_OPPONENTS_LAST_TURN } from '../../../game/store/prefabs/prefabs';

export class Tropius extends PokemonCard {
  public stage: Stage = Stage.BASIC;
  public hp: number = 120;
  public cardType: CardType[] = [G];
  public weakness = [{ type: R }];
  public retreat = [C, C];

  public attacks = [{
    name: 'Rally Back',
    cost: [G, C],
    damage: 30,
    damageCalculation: '+',
    text: 'If any of your Pokémon were Knocked Out by damage from an attack from your opponent\'s Pokémon during their last turn, this attack does 90 more damage.'
  },
  {
    name: 'Cutting Wind',
    cost: [G, C, C],
    damage: 90,
    text: ''
  }];

  public regulationMark: string = 'J';
  public set: string = '30C';
  public cardImage: string = 'assets/cardback.png';
  public setNumber: string = '5';
  public name: string = 'Tropius';
  public fullName: string = 'Tropius 30C';

  public reduceEffect(store: StoreLike, state: State, effect: Effect): State {
    // Rally Back
    if (WAS_ATTACK_USED(effect, 0, this)) {
      if (WAS_POKEMON_KNOCKED_OUT_DURING_OPPONENTS_LAST_TURN(effect.player, { byAttackDamage: true })) {
        effect.damage += 90;
      }
    }

    return state;
  }
}
