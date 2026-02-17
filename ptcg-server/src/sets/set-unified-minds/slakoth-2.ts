import { PokemonCard } from '../../game/store/card/pokemon-card';
import { Stage, CardType } from '../../game/store/card/card-types';
import { StoreLike, State } from '../../game';
import { Effect } from '../../game/store/effects/effect';
import { WAS_ATTACK_USED } from '../../game/store/prefabs/prefabs';

export class Slakoth2 extends PokemonCard {
  public stage: Stage = Stage.BASIC;
  public cardType: CardType = C;
  public hp: number = 70;
  public weakness = [{ type: F }];
  public retreat = [C, C, C];

  public attacks = [
    {
      name: 'Scratch',
      cost: [C, C],
      damage: 30,
      text: ''
    },
    {
      name: 'Boundless Power',
      cost: [C, C, C],
      damage: 60,
      text: 'This Pokémon can\'t attack during your next turn.'
    }
  ];

  public set: string = 'UNM';
  public setNumber: string = '168';
  public cardImage: string = 'assets/cardback.png';
  public name: string = 'Slakoth';
  public fullName: string = 'Slakoth UNM 168';

  public reduceEffect(store: StoreLike, state: State, effect: Effect): State {
    // Attack 2: Boundless Power
    // Ref: set-unbroken-bonds/aggron.ts (Giga Impact - can't attack next turn)
    if (WAS_ATTACK_USED(effect, 1, this)) {
      effect.player.active.cannotAttackNextTurnPending = true;
    }

    return state;
  }
}
