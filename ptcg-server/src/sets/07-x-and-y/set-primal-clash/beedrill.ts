import { PokemonCard } from '../../../game/store/card/pokemon-card';
import { Stage, CardType } from '../../../game/store/card/card-types';
import { StoreLike, State } from '../../../game';
import { Effect } from '../../../game/store/effects/effect';
import { WAS_ATTACK_USED, MULTIPLE_COIN_FLIPS_PROMPT } from '../../../game/store/prefabs/prefabs';
import { DEFENDING_POKEMON_KNOCKED_OUT_IF_DAMAGED_DURING_YOUR_NEXT_TURN } from '../../../game/store/prefabs/effect-of-attack-prefabs';

export class Beedrill extends PokemonCard {
  public stage: Stage = Stage.STAGE_2;
  public evolvesFrom: string = 'Kakuna';
  public cardType: CardType = G;
  public hp: number = 120;
  public weakness = [{ type: R }];
  public retreat = [];

  public attacks = [{
    name: 'Allergic Shock',
    cost: [G],
    damage: 0,
    text: 'During your next turn, if the Defending Pokémon is damaged by an attack, it is Knocked Out.',
  }, {
    name: 'Twineedle',
    cost: [G, G],
    damage: 50,
    damageCalculation: 'x',
    text: 'Flip 2 coins. This attack does 50 damage times the number of heads.',
  }];

  public set: string = 'PRC';
  public setNumber: string = '3';
  public cardImage: string = 'assets/cardback.png';
  public name: string = 'Beedrill';
  public fullName: string = 'Beedrill PRC';

  public reduceEffect(store: StoreLike, state: State, effect: Effect): State {
    if (WAS_ATTACK_USED(effect, 0, this)) {
      return DEFENDING_POKEMON_KNOCKED_OUT_IF_DAMAGED_DURING_YOUR_NEXT_TURN(store, state, effect, this);
    }

    if (WAS_ATTACK_USED(effect, 1, this)) {
      MULTIPLE_COIN_FLIPS_PROMPT(store, state, effect.player, 2, results => {
        const heads = results.filter(r => r).length;
        effect.damage = 50 * heads;
      });
    }

    return state;
  }
}
