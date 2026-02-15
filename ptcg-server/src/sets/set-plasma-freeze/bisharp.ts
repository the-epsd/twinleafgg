import { PokemonCard } from '../../game/store/card/pokemon-card';
import { Stage, CardType, CardTag } from '../../game/store/card/card-types';
import { StateUtils, StoreLike, State } from '../../game';
import { Effect } from '../../game/store/effects/effect';
import { WAS_ATTACK_USED } from '../../game/store/prefabs/prefabs';

export class Bisharp extends PokemonCard {
  public tags = [CardTag.TEAM_PLASMA];
  public stage: Stage = Stage.STAGE_1;
  public evolvesFrom: string = 'Pawniard';
  public cardType: CardType = D;
  public hp: number = 100;
  public weakness = [{ type: F }];
  public resistance = [{ type: P, value: -20 }];
  public retreat = [C];

  public attacks = [
    {
      name: 'Slash',
      cost: [C],
      damage: 40,
      text: ''
    },
    {
      name: 'Dragon Slayer',
      cost: [D, D, C],
      damage: 80,
      damageCalculation: '+' as const,
      text: 'If the Defending Pokémon is a Dragon Pokémon, this attack does 40 more damage.'
    }
  ];

  public set: string = 'PLF';
  public setNumber: string = '73';
  public cardImage: string = 'assets/cardback.png';
  public name: string = 'Bisharp';
  public fullName: string = 'Bisharp PLF';

  public reduceEffect(store: StoreLike, state: State, effect: Effect): State {
    if (WAS_ATTACK_USED(effect, 1, this)) {
      const opponent = StateUtils.getOpponent(state, effect.player);
      const defending = opponent.active.getPokemonCard();
      if (defending && defending.cardType === CardType.DRAGON) {
        effect.damage += 40;
      }
    }

    return state;
  }
}
