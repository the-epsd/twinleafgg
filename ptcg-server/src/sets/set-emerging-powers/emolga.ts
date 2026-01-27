import { PokemonCard } from '../../game/store/card/pokemon-card';
import { Stage, CardType } from '../../game/store/card/card-types';
import { StoreLike, State } from '../../game';
import { Effect } from '../../game/store/effects/effect';
import { WAS_ATTACK_USED, COIN_FLIP_PROMPT, MULTIPLE_COIN_FLIPS_PROMPT } from '../../game/store/prefabs/prefabs';
import { YOUR_OPPPONENTS_ACTIVE_POKEMON_IS_NOW_PARALYZED } from '../../game/store/prefabs/attack-effects';
import { AttackEffect } from '../../game/store/effects/game-effects';

export class Emolga extends PokemonCard {
  public stage: Stage = Stage.BASIC;
  public cardType: CardType = L;
  public hp: number = 70;
  public weakness = [{ type: F }];
  public retreat = [];

  public attacks = [
    {
      name: 'Thundershock',
      cost: [L],
      damage: 10,
      text: 'Flip a coin. If heads, the Defending Pokémon is now Paralyzed.'
    },
    {
      name: 'Acrobatics',
      cost: [C, C],
      damage: 10,
      damageCalculation: '+',
      text: 'Flip 2 coins. This attack does 20 more damage for each heads.'
    }
  ];

  public set: string = 'EPO';
  public cardImage: string = 'assets/cardback.png';
  public setNumber: string = '32';
  public name: string = 'Emolga';
  public fullName: string = 'Emolga EPO';

  public reduceEffect(store: StoreLike, state: State, effect: Effect): State {
    if (WAS_ATTACK_USED(effect, 0, this)) {
      COIN_FLIP_PROMPT(store, state, effect.player, result => {
        if (result) {
          YOUR_OPPPONENTS_ACTIVE_POKEMON_IS_NOW_PARALYZED(store, state, effect);
        }
      });
    }

    if (WAS_ATTACK_USED(effect, 1, this)) {
      MULTIPLE_COIN_FLIPS_PROMPT(store, state, effect.player, 2, results => {
        let heads = 0;
        results.forEach(r => { if (r) heads++; });
        (effect as AttackEffect).damage += 20 * heads;
      });
    }

    return state;
  }
}
