import { PokemonCard } from '../../game/store/card/pokemon-card';
import { Stage, CardType } from '../../game/store/card/card-types';
import { PowerType, StoreLike, State } from '../../game';
import { Effect } from '../../game/store/effects/effect';
import { WAS_ATTACK_USED, IS_ABILITY_BLOCKED } from '../../game/store/prefabs/prefabs';

export class Fraxure extends PokemonCard {
  public stage: Stage = Stage.STAGE_1;
  public evolvesFrom: string = 'Axew';
  public cardType: CardType = N;
  public hp: number = 70;
  public weakness = [{ type: N }];
  public retreat = [C];

  public powers = [{
    name: 'Grit',
    useWhenInPlay: false,
    powerType: PowerType.ABILITY,
    text: 'If this Pok\u00e9mon is affected by a Special Condition, each of its attacks does 40 more damage (before applying Weakness and Resistance).'
  }];

  public attacks = [
    {
      name: 'Dragon Claw',
      cost: [F, M, C],
      damage: 60,
      text: ''
    }
  ];

  public set: string = 'DRV';
  public setNumber: string = '14';
  public cardImage: string = 'assets/cardback.png';
  public name: string = 'Fraxure';
  public fullName: string = 'Fraxure DRV';

  public reduceEffect(store: StoreLike, state: State, effect: Effect): State {
    // Grit - passive ability: +40 damage when affected by Special Condition
    if (WAS_ATTACK_USED(effect, 0, this)) {
      const player = effect.player;

      if (!IS_ABILITY_BLOCKED(store, state, player, this)) {
        if (player.active.specialConditions.length > 0) {
          effect.damage += 40;
        }
      }
    }

    return state;
  }
}
