import { CardType, PokemonCard, Stage, State, StoreLike } from '../../../game';
import { Effect } from '../../../game/store/effects/effect';
import {
  DEFENDING_POKEMON_TAKES_MORE_DAMAGE_DURING_YOUR_NEXT_TURN,
  WAS_ATTACK_USED,
} from '../../../game/store/prefabs/prefabs';

export class Onix extends PokemonCard {
  public stage: Stage = Stage.BASIC;
  public cardType: CardType = F;
  public hp: number = 100;
  public weakness = [{ type: G }];
  public retreat = [C, C];

  public attacks = [{
    name: 'Screech',
    cost: [C],
    damage: 0,
    text: 'During your next turn, the Defending Pokémon takes 20 more damage from attacks (after applying Weakness and Resistance).'
  },
  {
    name: 'Rage',
    cost: [F, F],
    damage: 10,
    damageCalculation: '+',
    text: 'This attack does 10 more damage for each damage counter on this Pokémon.'
  }];

  public set: string = 'CES';
  public setNumber: string = '71';
  public cardImage: string = 'assets/cardback.png';
  public name: string = 'Onix';
  public fullName: string = 'Onix CES';

  public reduceEffect(store: StoreLike, state: State, effect: Effect): State {
    // Screech
    if (WAS_ATTACK_USED(effect, 0, this)) {
      return DEFENDING_POKEMON_TAKES_MORE_DAMAGE_DURING_YOUR_NEXT_TURN(store, state, effect, this, 20);
    }

    // Rage
    if (WAS_ATTACK_USED(effect, 1, this)) {
      effect.damage += 10 * (effect.player.active.damage / 10);
    }

    return state;
  }
}
