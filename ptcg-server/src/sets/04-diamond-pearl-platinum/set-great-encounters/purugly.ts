import { PokemonCard } from '../../../game/store/card/pokemon-card';
import { CardType, Stage } from '../../../game/store/card/card-types';
import { State, StoreLike } from '../../../game';
import { Effect } from '../../../game/store/effects/effect';
import { COIN_FLIP_PROMPT, MULTIPLE_COIN_FLIPS_PROMPT, WAS_ATTACK_USED } from '../../../game/store/prefabs/prefabs';
import { DISCARD_AN_ENERGY_FROM_OPPONENTS_ACTIVE_POKEMON } from '../../../game/store/prefabs/attack-effects';

export class Purugly extends PokemonCard {
  public stage: Stage = Stage.STAGE_1;
  public evolvesFrom: string = 'Glameow';
  public hp: number = 90;
  public cardType: CardType[] = [C];
  public weakness = [{ type: F, value: +20 }];
  public retreat = [C, C];

  public attacks = [{
    name: 'Swagger',
    cost: [C, C],
    damage: 20,
    text: 'Flip a coin. If heads, discard an Energy attached to the Defending Pokémon.'
  },
  {
    name: 'Fury Swipes',
    cost: [C, C, C],
    damage: 40,
    damageCalculation: 'x',
    text: 'Flip 3 coins. This attack does 40 damage times the number of heads.'
  }];

  public set: string = 'GE';
  public cardImage: string = 'assets/cardback.png';
  public setNumber: string = '50';
  public name: string = 'Purugly';
  public fullName: string = 'Purugly GE';

  public reduceEffect(store: StoreLike, state: State, effect: Effect): State {
    // Swagger
    if (WAS_ATTACK_USED(effect, 0, this)) {
      COIN_FLIP_PROMPT(store, state, effect.player, result => {
        if (result) {
          DISCARD_AN_ENERGY_FROM_OPPONENTS_ACTIVE_POKEMON(store, state, effect);
        }
      });
    }

    // Fury Swipes
    if (WAS_ATTACK_USED(effect, 1, this)) {
      MULTIPLE_COIN_FLIPS_PROMPT(store, state, effect.player, 3, results => {
        effect.damage = 40 * results.filter(r => r).length;
      });
    }

    return state;
  }
}
