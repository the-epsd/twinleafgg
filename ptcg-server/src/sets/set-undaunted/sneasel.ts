import { Effect } from '../../game/store/effects/effect';
import { PokemonCard } from '../../game/store/card/pokemon-card';
import { Stage, CardType } from '../../game/store/card/card-types';
import { StoreLike, State } from '../../game';
import { MULTIPLE_COIN_FLIPS_PROMPT, WAS_ATTACK_USED } from '../../game/store/prefabs/prefabs';

export class Sneasel extends PokemonCard {
  public stage: Stage = Stage.BASIC;
  public cardType: CardType = D;
  public hp: number = 60;
  public weakness = [{ type: F }];
  public resistance = [{ type: P, value: -20 }];
  public retreat = [];

  public attacks = [{
    name: 'Fury Swipes',
    cost: [C],
    damage: 10,
    damageCalculation: 'x',
    text: 'Flip 3 coins. This attack does 10 damage times the number of heads.'
  },
  {
    name: 'Beat Up',
    cost: [D, D],
    damage: 20,
    damageCalculation: 'x',
    text: 'Flip a coin for each of your Pokémon in play. This attack does 20 damage times the number of heads.'
  }];

  public set: string = 'UD';
  public setNumber: string = '68';
  public cardImage: string = 'assets/cardback.png';
  public name: string = 'Sneasel';
  public fullName: string = 'Sneasel UD';

  public reduceEffect(store: StoreLike, state: State, effect: Effect): State {

    if (WAS_ATTACK_USED(effect, 0, this)) {
      const player = effect.player;
      return MULTIPLE_COIN_FLIPS_PROMPT(store, state, player, 3, results => {
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

      return MULTIPLE_COIN_FLIPS_PROMPT(store, state, player, playerBench + 1, results => {
        let heads: number = 0;
        results.forEach(r => {
          if (r) heads++;
        });
        effect.damage = 20 * heads;
      });
    }

    return state;
  }

}
