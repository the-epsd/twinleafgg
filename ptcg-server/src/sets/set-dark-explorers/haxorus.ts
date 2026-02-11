import { PokemonCard } from '../../game/store/card/pokemon-card';
import { Stage, CardType } from '../../game/store/card/card-types';
import { StoreLike, State } from '../../game';
import { Effect } from '../../game/store/effects/effect';
import { WAS_ATTACK_USED, MULTIPLE_COIN_FLIPS_PROMPT } from '../../game/store/prefabs/prefabs';
import { YOUR_OPPPONENTS_ACTIVE_POKEMON_IS_NOW_PARALYZED } from '../../game/store/prefabs/attack-effects';

export class Haxorus extends PokemonCard {
  public stage: Stage = Stage.STAGE_2;
  public evolvesFrom = 'Fraxure';
  public cardType: CardType = C;
  public hp: number = 140;
  public weakness = [];
  public retreat = [C, C, C];

  public attacks = [
    {
      name: 'Guillotine',
      cost: [C, C, C],
      damage: 60,
      text: ''
    },
    {
      name: 'Stunning Uppercut',
      cost: [C, C, C, C],
      damage: 80,
      text: 'Flip 2 coins. If both of them are heads, the Defending Pokémon is now Paralyzed. If both of them are tails, this attack does nothing.'
    }
  ];

  public set: string = 'DEX';
  public setNumber: string = '88';
  public cardImage: string = 'assets/cardback.png';
  public name: string = 'Haxorus';
  public fullName: string = 'Haxorus DEX';

  public reduceEffect(store: StoreLike, state: State, effect: Effect): State {
    // Stunning Uppercut - flip 2 coins
    // Both heads = Paralyzed
    // Both tails = no damage
    if (WAS_ATTACK_USED(effect, 1, this)) {
      return MULTIPLE_COIN_FLIPS_PROMPT(store, state, effect.player, 2, results => {
        const heads = results.filter(r => r).length;

        if (heads === 2) {
          // Both heads - Paralyze the defending Pokémon
          YOUR_OPPPONENTS_ACTIVE_POKEMON_IS_NOW_PARALYZED(store, state, effect);
        } else if (heads === 0) {
          // Both tails - attack does nothing
          effect.damage = 0;
        }
        // Otherwise (1 head, 1 tail) - just deal normal damage
      });
    }

    return state;
  }
}
