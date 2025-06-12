import { Attack, CardType, PokemonCard, Stage, State, StoreLike, Weakness } from '../../game';
import { Effect } from '../../game/store/effects/effect';
import { DISCARD_X_ENERGY_FROM_THIS_POKEMON } from '../../game/store/prefabs/costs';
import { MULTIPLE_COIN_FLIPS_PROMPT, WAS_ATTACK_USED } from '../../game/store/prefabs/prefabs';

export class BlackKyurem extends PokemonCard {

  public stage: Stage = Stage.BASIC;
  public cardType: CardType = N;
  public hp: number = 130;
  public weakness: Weakness[] = [{ type: N }];
  public retreat: CardType[] = [C, C];

  public attacks: Attack[] = [
    {
      name: 'Dual Claw',
      cost: [L, C],
      damage: 20,
      damageCalculation: 'x',
      text: 'Flip 2 coins. This attack does 20 damage times the number of heads.',
    },
    {
      name: 'Flash Freeze',
      cost: [W, L, C, C],
      damage: 100,
      text: 'Discard an Energy attached to this Pokémon.'
    },
  ];

  public set: string = 'BCR';
  public cardImage: string = 'assets/cardback.png';
  public setNumber: string = '100';
  public name: string = 'Black Kyurem';
  public fullName: string = 'Black Kyurem BCR';

  public reduceEffect(store: StoreLike, state: State, effect: Effect): State {

    if (WAS_ATTACK_USED(effect, 0, this)) {
      MULTIPLE_COIN_FLIPS_PROMPT(store, state, effect.player, 2, (results) => {
        effect.damage = 20 * results.filter(r => r === true).length;
      });
    }
    
    if (WAS_ATTACK_USED(effect, 1, this)) {
      DISCARD_X_ENERGY_FROM_THIS_POKEMON(store, state, effect, 1);
    }

    return state;
  }
}