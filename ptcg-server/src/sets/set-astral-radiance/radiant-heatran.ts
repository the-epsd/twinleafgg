import { PokemonCard } from '../../game/store/card/pokemon-card';
import { Stage, CardType, CardTag } from '../../game/store/card/card-types';
import { StoreLike, State } from '../../game';
import { WAS_ATTACK_USED } from '../../game/store/prefabs/prefabs';
import { Effect } from '../../game/store/effects/effect';

export class RadiantHeatran extends PokemonCard {

  public stage: Stage = Stage.BASIC;
  public tags = [CardTag.RADIANT];
  public regulationMark = 'F';
  public cardType: CardType = R;
  public hp: number = 160;
  public weakness = [{ type: W }];
  public retreat = [C, C, C];

  public attacks = [
    {
      name: 'Raging Blast',
      cost: [R, C, C],
      damage: 70,
      damageCalculation: 'x',
      text: 'This attack does 70 damage for each damage counter on this Pokémon.'
    },
  ];

  public set: string = 'ASR';
  public name: string = 'Radiant Heatran';
  public fullName: string = 'Radiant Heatran ASR';
  public cardImage: string = 'assets/cardback.png';
  public setNumber: string = '27';

  public reduceEffect(store: StoreLike, state: State, effect: Effect): State {
    if (WAS_ATTACK_USED(effect, 0, this)) {
      effect.damage = effect.player.active.damage * 7;
      return state;
    }
    return state;
  }

}