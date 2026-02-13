import { PokemonCard } from '../../game/store/card/pokemon-card';
import { Stage, CardType } from '../../game/store/card/card-types';
import { StoreLike, State } from '../../game';
import { Effect } from '../../game/store/effects/effect';
import { WAS_ATTACK_USED, COIN_FLIP_PROMPT, MULTIPLE_COIN_FLIPS_PROMPT } from '../../game/store/prefabs/prefabs';
import { YOUR_OPPPONENTS_ACTIVE_POKEMON_IS_NOW_PARALYZED } from '../../game/store/prefabs/attack-effects';

export class Druddigon extends PokemonCard {
  public stage: Stage = Stage.BASIC;
  public cardType: CardType = N;
  public hp: number = 110;
  public weakness = [{ type: N }];
  public retreat = [C, C];

  public attacks = [
    {
      name: 'Tight Jaw',
      cost: [C, C],
      damage: 20,
      text: 'Flip a coin. If heads, the Defending Pok\u00e9mon is now Paralyzed.'
    },
    {
      name: 'Dragon Tail',
      cost: [R, W, C],
      damage: 80,
      damageCalculation: 'x' as 'x',
      text: 'Flip 2 coins. This attack does 80 damage times the number of heads.'
    }
  ];

  public set: string = 'DRV';
  public setNumber: string = '17';
  public cardImage: string = 'assets/cardback.png';
  public name: string = 'Druddigon';
  public fullName: string = 'Druddigon DRV';

  public reduceEffect(store: StoreLike, state: State, effect: Effect): State {
    // Tight Jaw - flip for paralysis
    if (WAS_ATTACK_USED(effect, 0, this)) {
      COIN_FLIP_PROMPT(store, state, effect.player, result => {
        if (result) {
          YOUR_OPPPONENTS_ACTIVE_POKEMON_IS_NOW_PARALYZED(store, state, effect);
        }
      });
    }

    // Dragon Tail - flip 2, 80x heads
    if (WAS_ATTACK_USED(effect, 1, this)) {
      MULTIPLE_COIN_FLIPS_PROMPT(store, state, effect.player, 2, results => {
        const heads = results.filter(r => r).length;
        effect.damage = 80 * heads;
      });
    }

    return state;
  }
}
