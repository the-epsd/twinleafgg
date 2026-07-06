import { PokemonCard, Stage, CardType, PowerType, State, StoreLike, CardTag } from '../../../game';
import { Effect } from '../../../game/store/effects/effect';

import { WAS_ATTACK_USED } from '../../../game/store/prefabs/prefabs';

export class Revavroomex extends PokemonCard {

  public regulationMark = 'G';

  public stage: Stage = Stage.STAGE_1;

  public tags = [CardTag.POKEMON_ex];

  public evolvesFrom = 'Varoom';

  public cardType: CardType = CardType.METAL;

  public hp: number = 280;

  public weakness = [{ type: CardType.FIRE }];

  public retreat = [CardType.COLORLESS];

  public resistance = [{ type: CardType.GRASS, value: -30 }];

  public powers = [
    {
      name: 'Tune-Up',
      powerType: PowerType.ABILITY,
      text: 'This Pokémon may have up to 4 Pokémon Tools attached to it. If it loses this Ability, discard Pokémon Tools from it until only 1 remains.'

    }
  ];

  public attacks = [
    {
      name: 'Wild Drift',
      cost: [CardType.METAL, CardType.METAL, CardType.COLORLESS],
      damage: 170,
      text: 'During your opponent\'s next turn, this Pokémon takes 30 less damage from attacks (after applying Weakness and Resistance).'
    }
  ];

  public set: string = 'OBF';

  public cardImage: string = 'assets/cardback.png';

  public setNumber: string = '156';

  public name: string = 'Revavroom ex';

  public fullName: string = 'Revavroom ex OBF';

  public maxTools: number = 4;
  public reduceEffect(store: StoreLike, state: State, effect: Effect): State {
    if (WAS_ATTACK_USED(effect, 1, this)) {
      effect.player.active.damageReductionNextTurn = 30;
    }

    return state;
  }
}
