import { Attack, CardType, PokemonCard, Stage, State, StoreLike, Weakness } from '../../game';
import { Effect } from '../../game/store/effects/effect';
import { MULTIPLE_COIN_FLIPS_PROMPT, WAS_ATTACK_USED } from '../../game/store/prefabs/prefabs';

export class Poliwag extends PokemonCard {

  public stage: Stage = Stage.BASIC;
  public cardType: CardType = W;
  public hp: number = 60;
  public weakness: Weakness[] = [{ type: L }];
  public retreat: CardType[] = [C];

  public attacks: Attack[] = [
    { name: 'Stampede', cost: [W], damage: 10, text: '' },
    {
      name: 'Tail Rap',
      cost: [C, C],
      damage: 20,
      damageCalculation: 'x',
      text: 'Flip 2 coins. This attack does 20 damage for each heads.',
    },
  ];

  public set: string = 'TWM';
  public regulationMark: string = 'H';
  public cardImage: string = 'assets/cardback.png';
  public setNumber: string = '41';
  public name: string = 'Poliwag';
  public fullName: string = 'Poliwag TWM';

  public reduceEffect(store: StoreLike, state: State, effect: Effect): State {

    if (WAS_ATTACK_USED(effect, 1, this)) {
      return MULTIPLE_COIN_FLIPS_PROMPT(store, state, effect.player, 2, (results) => {
        effect.damage = 20 * results.reduce((sum, r) => (sum + (r ? 1 : 0)), 0);
      });
    }

    return state;
  }
}