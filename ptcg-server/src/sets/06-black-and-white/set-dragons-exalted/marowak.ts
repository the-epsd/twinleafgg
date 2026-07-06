import { PokemonCard } from '../../../game/store/card/pokemon-card';
import { Stage, CardType } from '../../../game/store/card/card-types';
import { StateUtils, StoreLike, State } from '../../../game';
import { Effect } from '../../../game/store/effects/effect';
import { WAS_ATTACK_USED, BLOCK_RETREAT } from '../../../game/store/prefabs/prefabs';
export class Marowak extends PokemonCard {
  public stage: Stage = Stage.STAGE_1;
  public evolvesFrom: string = 'Cubone';
  public cardType: CardType = F;
  public hp: number = 100;
  public weakness = [{ type: W }];
  public resistance = [{ type: L, value: -20 }];
  public retreat = [C];

  public attacks = [
    {
      name: 'Bone Lock',
      cost: [F],
      damage: 30,
      text: 'The Defending Pokémon can\'t retreat during your opponent\'s next turn.'
    },
    {
      name: 'Vortex Chop',
      cost: [F, C, C],
      damage: 60,
      damageCalculation: '+',
      text: 'If the Defending Pokémon has any Resistance, this attack does 30 more damage.'
    }
  ];

  public set: string = 'DRX';
  public setNumber: string = '61';
  public cardImage: string = 'assets/cardback.png';
  public name: string = 'Marowak';
  public fullName: string = 'Marowak DRX';

  public reduceEffect(store: StoreLike, state: State, effect: Effect): State {
    // Bone Lock - prevent retreat
    if (WAS_ATTACK_USED(effect, 0, this)) {
      BLOCK_RETREAT(store, state, effect, this);
    }
    // Vortex Chop - more damage if Defending has Resistance
    if (WAS_ATTACK_USED(effect, 1, this)) {
      const opponent = StateUtils.getOpponent(state, effect.player);
      const target = opponent.active.getPokemonCard();
      if (target && target.resistance !== undefined && target.resistance.length > 0) {
        effect.damage += 30;
      }
    }

    return state;
  }
}
