import { PokemonCard, Stage, CardType, State, StoreLike } from '../../game';
import { Effect } from '../../game/store/effects/effect';
import { WAS_ATTACK_USED } from '../../game/store/prefabs/prefabs';

export class Amoongus extends PokemonCard {
  public stage: Stage = Stage.STAGE_1;
  public evolvesFrom = 'Foongus';
  public cardType: CardType = G;
  public hp: number = 120;
  public weakness = [{ type: R }];
  public retreat = [C];

  public attacks = [
    {
      name: 'Dangerous Reaction',
      cost: [C],
      damage: 30,
      damageCalculation: '+',
      text: 'If your opponent\'s Active Pokémon is affected by a Special Condition, this attack does 120 more damage.'
    },
    {
      name: 'Seed Bomb',
      cost: [G, C],
      damage: 60,
      text: ''
    }
  ];

  public regulationMark = 'I';
  public set: string = 'BLK';
  public setNumber: string = '11';
  public cardImage: string = 'assets/cardback.png';
  public name: string = 'Amoongus';
  public fullName: string = 'Amoongus SV11B';

  public reduceEffect(store: StoreLike, state: State, effect: Effect): State {
    // Dangerous Reaction
    if (WAS_ATTACK_USED(effect, 0, this)) {
      if (effect.opponent.active.specialConditions.length > 0) {
        effect.damage += 120;
      }
    }

    return state;
  }
}
