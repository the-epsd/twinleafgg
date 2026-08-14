import { PokemonCard } from '../../../game/store/card/pokemon-card';
import { Stage, CardType, CardTag } from '../../../game/store/card/card-types';
import { StoreLike, State } from '../../../game';
import { Effect } from '../../../game/store/effects/effect';
import { WAS_ATTACK_USED } from '../../../game/store/prefabs/prefabs';

export class Kakuna extends PokemonCard {
  public stage: Stage = Stage.STAGE_1;
  public evolvesFrom = 'Weedle';
  protected _tags = [CardTag.SINGLE_STRIKE];
  public cardType: CardType = G;
  public hp: number = 80;
  public weakness = [{ type: R }];
  public retreat = [C, C, C];

  public attacks = [
    {
      name: 'Stiffen',
      cost: [G],
      damage: 0,
      text: "During your opponent's next turn, this Pokémon takes 40 less damage from attacks (after applying Weakness and Resistance).",
    },
  ];

  public set: string = 'CRE';
  public name: string = 'Kakuna';
  public fullName: string = 'Kakuna CRE';
  public cardImage: string = 'assets/cardback.png';
  public setNumber: string = '2';
  public regulationMark: string = 'E';

  public reduceEffect(store: StoreLike, state: State, effect: Effect): State {
    // Stiffen
    if (WAS_ATTACK_USED(effect, 0, this)) {
      effect.player.active.damageReductionNextTurn = 40;
    }

    return state;
  }
}
