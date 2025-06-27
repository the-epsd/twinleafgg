import { PlayerType, State, StoreLike } from '../../game';
import { CardType, Stage } from '../../game/store/card/card-types';
import { PokemonCard } from '../../game/store/card/pokemon-card';
import { Effect } from '../../game/store/effects/effect';
import { MULTIPLE_COIN_FLIPS_PROMPT, WAS_ATTACK_USED } from '../../game/store/prefabs/prefabs';

export class Sneasel extends PokemonCard {
  public stage: Stage = Stage.BASIC;
  public cardType: CardType = D;
  public hp: number = 60;
  public resistance = [{ type: P, value: -30 }];
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
    text: 'Flip a coin for each of your Pokémon in play (including this one). This attack does 20 damage times the number of heads.'
  }];

  public set: string = 'N1';
  public cardImage: string = 'assets/cardback.png';
  public setNumber: string = '25';
  public name: string = 'Sneasel';
  public fullName: string = 'Sneasel N1';

  public reduceEffect(store: StoreLike, state: State, effect: Effect): State {

    if (WAS_ATTACK_USED(effect, 0, this)) {
      const player = effect.player;
      MULTIPLE_COIN_FLIPS_PROMPT(store, state, player, 3, results => {
        let heads: number = 0;
        results.forEach(r => {
          if (r) heads++;
        });

        effect.damage = 10 * heads;
      });
    }

    if (WAS_ATTACK_USED(effect, 1, this)) {
      const player = effect.player;

      let monCount = 0;
      player.forEachPokemon(PlayerType.BOTTOM_PLAYER, p => {
        monCount++;
      });

      MULTIPLE_COIN_FLIPS_PROMPT(store, state, player, monCount, results => {
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