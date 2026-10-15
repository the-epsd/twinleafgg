import { PokemonCard } from '../../../game/store/card/pokemon-card';
import { CardType, Stage } from '../../../game/store/card/card-types';
import { State, StoreLike } from '../../../game';
import { Effect } from '../../../game/store/effects/effect';
import { WAS_ATTACK_USED } from '../../../game/store/prefabs/prefabs';
import { BLOCK_RETREAT, PREVENT_DAMAGE } from '../../../game/store/prefabs/effect-of-attack-prefabs';

export class Cascoon extends PokemonCard {
  public stage: Stage = Stage.STAGE_1;
  public evolvesFrom: string = 'Wurmple';
  public hp: number = 80;
  public cardType: CardType[] = [G];
  public weakness = [{ type: R, value: 20 }];
  public retreat = [C, C, C];

  public attacks = [{
    name: 'Harden',
    cost: [G],
    damage: 0,
    text: 'During your opponent\'s next turn, if Cascoon would be damaged by an attack, prevent that attack\'s damage done to Cascoon if that damage is 30 or less.'
  },
{
    name: 'Gooey Thread',
    cost: [G, C],
    damage: 20,
    text: 'The Defending Pokémon can\'t retreat during your opponent\'s next turn.'
  }];

  public set: string = 'DP';
  public cardImage: string = 'assets/cardback.png';
  public setNumber: string = '44';
  public name: string = 'Cascoon';
  public fullName: string = 'Cascoon DP';

  public reduceEffect(store: StoreLike, state: State, effect: Effect): State {
    // Harden
    if (WAS_ATTACK_USED(effect, 0, this)) {
      PREVENT_DAMAGE(store, state, effect, this, { maxDamage: 30 });
    }

    // Gooey Thread
    if (WAS_ATTACK_USED(effect, 1, this)) {
      return BLOCK_RETREAT(store, state, effect, this);
    }

    return state;
  }
}
