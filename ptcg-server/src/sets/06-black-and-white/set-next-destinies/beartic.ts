import { PokemonCard } from '../../../game/store/card/pokemon-card';
import { Stage, CardType } from '../../../game/store/card/card-types';
import { StoreLike, State } from '../../../game';
import { Effect } from '../../../game/store/effects/effect';
import { WAS_ATTACK_USED, COIN_FLIP_PROMPT } from '../../../game/store/prefabs/prefabs';
import { DEFENDING_POKEMON_DOES_LESS_DAMAGE } from '../../../game/store/prefabs/effect-of-attack-prefabs';

export class Beartic extends PokemonCard {
  public stage: Stage = Stage.STAGE_1;
  public evolvesFrom = 'Cubchoo';
  public cardType: CardType[] = [W];
  public hp: number = 120;
  public weakness = [{ type: M }];
  public retreat = [C, C, C];

  public attacks = [{
    name: 'Daunt',
    cost: [C, C],
    damage: 40,
    text: 'During your opponent\'s next turn, any damage done by attack from the Defending Pokémon is reduced by 20 (before applying Weakness and Resistance).'
  }, {
    name: 'Ambush',
    cost: [W, C, C],
    damage: 60,
    damageCalculation: '+',
    text: 'Flip a coin. If heads, this attack does 30 more damage.'
  }];

  public set: string = 'NXD';
  public setNumber: string = '37';
  public cardImage: string = 'assets/cardback.png';
  public name: string = 'Beartic';
  public fullName: string = 'Beartic NXD';

  public reduceEffect(store: StoreLike, state: State, effect: Effect): State {
    // Daunt
    if (WAS_ATTACK_USED(effect, 0, this)) {
      return DEFENDING_POKEMON_DOES_LESS_DAMAGE(store, state, effect, this, 20);
    }

    // Ambush
    if (WAS_ATTACK_USED(effect, 1, this)) {
      return COIN_FLIP_PROMPT(store, state, effect.player, result => {
        if (result) {
          effect.damage += 30;
        }
      });
    }

    return state;
  }
}
