import { PokemonCard } from '../../game/store/card/pokemon-card';
import { Stage, CardType, CardTag } from '../../game/store/card/card-types';
import { StoreLike, State } from '../../game';
import { Effect } from '../../game/store/effects/effect';
import { MOVED_TO_ACTIVE_THIS_TURN, WAS_ATTACK_USED } from '../../game/store/prefabs/prefabs';

export class DragapultV extends PokemonCard {

  public tags = [CardTag.POKEMON_V];
  public regulationMark = 'D';
  public stage: Stage = Stage.BASIC;
  public cardType: CardType = P;
  public hp: number = 210;
  public weakness = [{ type: D }];
  public resistance = [{ type: F, value: -30 }];
  public retreat = [C];

  public attacks = [
    {
      name: 'Bite',
      cost: [P],
      damage: 30,
      text: ''
    },
    {
      name: 'Jet Assult',
      cost: [P, P],
      damage: 60,
      text: 'If this Pokémon moved from your Bench to the Active Spot this turn, this attack does 80 more damage.'
    }
  ];

  public set: string = 'RCL';

  public cardImage: string = 'assets/cardback.png';

  public setNumber: string = '92';

  public name: string = 'Dragapult V';

  public fullName: string = 'Dragapult V RCL';

  public reduceEffect(store: StoreLike, state: State, effect: Effect): State {

    if (WAS_ATTACK_USED(effect, 1, this)) {
      if (MOVED_TO_ACTIVE_THIS_TURN(effect.player, this)) {
        effect.damage += 80;
      }
    }
    return state;
  }
}