import { PokemonCard } from '../../game/store/card/pokemon-card';
import { Stage, CardType, CardTag } from '../../game/store/card/card-types';
import { StoreLike, State } from '../../game';
import { Effect } from '../../game/store/effects/effect';
import { WAS_ATTACK_USED } from '../../game/store/prefabs/prefabs';
import { THIS_ATTACK_DOES_X_DAMAGE_TO_1_OF_YOUR_OPPONENTS_BENCHED_POKEMON } from '../../game/store/prefabs/attack-effects';

export class Escavalier extends PokemonCard {
  public tags = [CardTag.TEAM_PLASMA];
  public stage: Stage = Stage.STAGE_1;
  public evolvesFrom: string = 'Karrablast';
  public cardType: CardType = M;
  public hp: number = 100;
  public weakness = [{ type: R }];
  public resistance = [{ type: P, value: -20 }];
  public retreat = [C, C, C];

  public attacks = [
    {
      name: 'Steamroll',
      cost: [M, C],
      damage: 40,
      text: 'Does 20 damage to 1 of your opponent\'s Benched Pok\u00e9mon. (Don\'t apply Weakness and Resistance for Benched Pok\u00e9mon.)'
    },
    {
      name: 'Slashing Strike',
      cost: [M, C, C],
      damage: 80,
      text: 'This Pok\u00e9mon can\'t use Slashing Strike during your next turn.'
    }
  ];

  public set: string = 'PLB';
  public setNumber: string = '61';
  public cardImage: string = 'assets/cardback.png';
  public name: string = 'Escavalier';
  public fullName: string = 'Escavalier PLB';

  public reduceEffect(store: StoreLike, state: State, effect: Effect): State {
    if (WAS_ATTACK_USED(effect, 0, this)) {
      THIS_ATTACK_DOES_X_DAMAGE_TO_1_OF_YOUR_OPPONENTS_BENCHED_POKEMON(20, effect, store, state);
    }

    if (WAS_ATTACK_USED(effect, 1, this)) {
      const player = effect.player;
      if (!player.active.cannotUseAttacksNextTurnPending.includes('Slashing Strike')) {
        player.active.cannotUseAttacksNextTurnPending.push('Slashing Strike');
      }
    }

    return state;
  }
}
