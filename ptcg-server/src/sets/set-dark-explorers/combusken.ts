import { PokemonCard } from '../../game/store/card/pokemon-card';
import { Stage, CardType } from '../../game/store/card/card-types';
import { StoreLike, State } from '../../game';
import { Effect } from '../../game/store/effects/effect';
import { WAS_ATTACK_USED, MULTIPLE_COIN_FLIPS_PROMPT } from '../../game/store/prefabs/prefabs';
import { DISCARD_X_ENERGY_FROM_THIS_POKEMON } from '../../game/store/prefabs/costs';

export class Combusken extends PokemonCard {

  public stage: Stage = Stage.STAGE_1;

  public evolvesFrom = 'Torchic';

  public cardType: CardType = CardType.FIRE;

  public hp: number = 80;

  public weakness = [{ type: CardType.WATER }];

  public retreat = [CardType.COLORLESS];

  public attacks = [
    {
      name: 'Double Kick',
      cost: [CardType.COLORLESS],
      damage: 20,
      damageCalculation: 'x',
      text: 'Flip 2 coins. This attack does 20 damage times the number of heads.'
    },
    {
      name: 'Flamethrower',
      cost: [CardType.FIRE, CardType.FIRE, CardType.COLORLESS],
      damage: 70,
      text: 'Discard an Energy attached to this Pokemon.'
    }
  ];

  public set: string = 'DEX';

  public setNumber: string = '16';

  public cardImage: string = 'assets/cardback.png';

  public name: string = 'Combusken';

  public fullName: string = 'Combusken DEX';

  public reduceEffect(store: StoreLike, state: State, effect: Effect): State {
    // Double Kick attack
    if (WAS_ATTACK_USED(effect, 0, this)) {
      const player = effect.player;

      return MULTIPLE_COIN_FLIPS_PROMPT(store, state, player, 2, results => {
        const heads = results.filter(r => r).length;
        effect.damage = 20 * heads;
      });
    }

    // Flamethrower attack
    if (WAS_ATTACK_USED(effect, 1, this)) {
      DISCARD_X_ENERGY_FROM_THIS_POKEMON(store, state, effect, 1);
    }

    return state;
  }
}
