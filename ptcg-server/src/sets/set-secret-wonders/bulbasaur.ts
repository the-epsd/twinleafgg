import { State, StoreLike } from '../../game';
import { CardType, Stage } from '../../game/store/card/card-types';
import { PokemonCard } from '../../game/store/card/pokemon-card';
import { Effect } from '../../game/store/effects/effect';
import { ADD_SLEEP_TO_PLAYER_ACTIVE, AFTER_ATTACK, MULTIPLE_COIN_FLIPS_PROMPT, WAS_ATTACK_USED } from '../../game/store/prefabs/prefabs';

export class Bulbasaur extends PokemonCard {
  public stage: Stage = Stage.BASIC;
  public cardType: CardType = G;
  public hp: number = 60;
  public weakness = [{ type: R, value: +10 }];
  public retreat = [C];

  public attacks = [{
    name: 'Shake Vine',
    cost: [],
    damage: 0,
    text: 'The Defending Pokémon is now Asleep.'
  },
  {
    name: 'Bullet Seed',
    cost: [G, C],
    damage: 10,
    damageCalculation: 'x',
    text: 'Flip 4 coins. This attack does 10 damage times the number of heads.'
  }];

  public set: string = 'SW';
  public name: string = 'Bulbasaur';
  public fullName: string = 'Bulbasaur SW';
  public cardImage: string = 'assets/cardback.png';
  public setNumber: string = '77';

  public reduceEffect(store: StoreLike, state: State, effect: Effect): State {

    if (AFTER_ATTACK(effect, 0, this)) {
      ADD_SLEEP_TO_PLAYER_ACTIVE(store, state, effect.opponent, this);
    }

    if (WAS_ATTACK_USED(effect, 0, this)) {
      const player = effect.player;
      MULTIPLE_COIN_FLIPS_PROMPT(store, state, player, 4, results => {
        let heads: number = 0;
        results.forEach(r => {
          if (r) heads++;
        });

        effect.damage = 10 * heads;
      });
    }

    return state;
  }
}