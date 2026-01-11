import { State, StoreLike } from '../../game';
import { CardType, Stage } from '../../game/store/card/card-types';
import { PokemonCard } from '../../game/store/card/pokemon-card';
import { Effect } from '../../game/store/effects/effect';
import { MarkerConstants } from '../../game/store/markers/marker-constants';
import { WAS_ATTACK_USED } from '../../game/store/prefabs/prefabs';

export class Lucario extends PokemonCard {
  public stage: Stage = Stage.STAGE_1;
  public cardType: CardType = F;
  public hp: number = 130;
  public weakness = [{ type: P }];
  public retreat = [C, C];

  public attacks = [{
    name: 'Avenging Knuckle',
    cost: [F],
    damage: 30,
    damageCalculation: '+',
    text: 'If any of your [F] Pokémon were Knocked Out by damage from an attack during your opponent\'s last turn, this attack does 120 more damage.'
  },
  {
    name: 'Accelerating Stab',
    cost: [F, C, C],
    damage: 120,
    text: 'During your next turn, this Pokémon can\'t use Accelerating Stab.'
  }];

  public regulationMark = 'G';
  public set: string = 'SVI';
  public cardImage: string = 'assets/cardback.png';
  public setNumber: string = '114';
  public evolvesFrom = 'Riolu';
  public name: string = 'Lucario';

  public fullName: string = 'Lucario SVI';

  public reduceEffect(store: StoreLike, state: State, effect: Effect): State {
    if (WAS_ATTACK_USED(effect, 0, this)) {
      const player = effect.player;
      if (player.marker.hasMarker(MarkerConstants.REVENGE_MARKER)) {
        effect.damage += 120;
      }
    }

    if (WAS_ATTACK_USED(effect, 1, this)) {
      const player = effect.player;
      if (!player.active.cannotUseAttacksNextTurnPending.includes('Accelerating Stab')) {
        player.active.cannotUseAttacksNextTurnPending.push('Accelerating Stab');
      }
    }
    return state;
  }
}