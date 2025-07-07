import { State, StoreLike } from '../../game';
import { CardType, Stage } from '../../game/store/card/card-types';
import { PokemonCard } from '../../game/store/card/pokemon-card';
import { Effect } from '../../game/store/effects/effect';
import { MULTIPLE_COIN_FLIPS_PROMPT, WAS_ATTACK_USED } from '../../game/store/prefabs/prefabs';

export class Cinccino extends PokemonCard {
  public stage: Stage = Stage.STAGE_1;
  public evolvesFrom = 'Minccino';
  public cardType: CardType = C;
  public hp: number = 90;
  public weakness = [{ type: F }];
  public retreat = [C];

  public attacks = [{
    name: 'Tail Slap',
    cost: [C],
    damage: 20,
    damageCalculation: 'x',
    text: 'Flip 2 coins. This attack does 20 damage times the number of heads.'
  },
  {
    name: 'Tail Slap',
    cost: [C, C],
    damage: 20,
    damageCalculation: 'x',
    text: 'Does 20 damage times the number of your Benched Pokémon.'
  }];

  public set: string = 'BLW';
  public cardImage: string = 'assets/cardback.png';
  public setNumber: string = '89';
  public name: string = 'Cinccino';
  public fullName: string = 'Cinccino BLW';

  public reduceEffect(store: StoreLike, state: State, effect: Effect): State {

    if (WAS_ATTACK_USED(effect, 0, this)) {
      const player = effect.player;
      MULTIPLE_COIN_FLIPS_PROMPT(store, state, player, 2, results => {
        let heads: number = 0;
        results.forEach(r => {
          if (r) heads++;
        });

        effect.damage = 10 * heads;
      });
    }

    if (WAS_ATTACK_USED(effect, 1, this)) {
      const player = effect.player;
      const playerBench = player.bench.reduce((left, b) => left + (b.cards.length ? 1 : 0), 0);

      effect.damage = 20 * playerBench;
    }

    return state;
  }
}