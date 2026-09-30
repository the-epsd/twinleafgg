import { PokemonCard } from '../../../game/store/card/pokemon-card';
import { Stage, CardType } from '../../../game/store/card/card-types';
import { StoreLike, State } from '../../../game';
import { Effect } from '../../../game/store/effects/effect';
import { WAS_ATTACK_USED } from '../../../game/store/prefabs/prefabs';

export class Zacian extends PokemonCard {
  public stage: Stage = Stage.BASIC;
  public hp: number = 130;
  public cardType: CardType[] = [M];
  public weakness = [{ type: R }];
  public resistance = [{ type: G, value: -30 }];
  public retreat = [C, C];

  public attacks = [{
    name: 'Hard Blade',
    cost: [M],
    damage: 20,
    damageCalculation: '+',
    text: 'If this Pokémon has a Pokémon Tool attached to it, this attack does 40 more damage.'
  },
  {
    name: 'Slash Down',
    cost: [M, M, C],
    damage: 120,
    text: 'During your next turn, this Pokémon can\'t use Slash Down.'
  }];

  public regulationMark: string = 'J';
  public set: string = '30C';
  public cardImage: string = 'assets/cardback.png';
  public setNumber: string = '106';
  public name: string = 'Zacian';
  public fullName: string = 'Zacian 30C';

  public reduceEffect(store: StoreLike, state: State, effect: Effect): State {
    // Hard Blade
    if (WAS_ATTACK_USED(effect, 0, this)) {
      if (effect.player.active.tools.length > 0) {
        effect.damage += 40;
      }
    }

    // Slash Down
    if (WAS_ATTACK_USED(effect, 1, this)) {
      effect.player.active.cannotUseAttacksNextTurnPending.push('Slash Down');
    }

    return state;
  }
}
