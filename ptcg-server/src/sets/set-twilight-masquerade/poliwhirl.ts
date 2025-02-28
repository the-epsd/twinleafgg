import { Attack, CardType, PokemonCard, Stage, State, StoreLike, Weakness } from '../../game';
import { Effect } from '../../game/store/effects/effect';
import { YOUR_OPPPONENTS_ACTIVE_POKEMON_IS_NOW_ASLEEP } from '../../game/store/prefabs/attack-effects';
import { MULTIPLE_COIN_FLIPS_PROMPT, WAS_ATTACK_USED } from '../../game/store/prefabs/prefabs';

export class Poliwhirl extends PokemonCard {

  public stage: Stage = Stage.STAGE_1;
  public evolvesFrom: string = 'Poliwag';
  public cardType: CardType = W;
  public hp: number = 100;
  public weakness: Weakness[] = [{ type: L }];
  public retreat: CardType[] = [C, C];

  public attacks: Attack[] = [
    {
      name: 'Hypnosis',
      cost: [W],
      damage: 0,
      text: 'Your opponent\'s Active Pokémon is now Asleep.'
    },
    {
      name: 'Double Slap',
      cost: [C, C],
      damage: 30,
      damageCalculation: 'x',
      text: 'Flip 2 coins. This attack does 30 damage for each heads.',
    },
  ];

  public set: string = 'TWM';
  public regulationMark: string = 'H';
  public cardImage: string = 'assets/cardback.png';
  public setNumber: string = '42';
  public name: string = 'Poliwhirl';
  public fullName: string = 'Poliwhirl TWM';

  public reduceEffect(store: StoreLike, state: State, effect: Effect): State {

    if (WAS_ATTACK_USED(effect, 0, this)) {
      YOUR_OPPPONENTS_ACTIVE_POKEMON_IS_NOW_ASLEEP(store, state, effect);
    }

    if (WAS_ATTACK_USED(effect, 1, this)) {
      return MULTIPLE_COIN_FLIPS_PROMPT(store, state, effect.player, 2, (results) => {
        effect.damage = 30 * results.reduce((sum, r) => (sum + (r ? 1 : 0)), 0);
      });
    }

    return state;
  }
}