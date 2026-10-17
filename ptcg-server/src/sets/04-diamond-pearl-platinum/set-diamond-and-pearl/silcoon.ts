import { PokemonCard } from '../../../game/store/card/pokemon-card';
import { CardType, Stage } from '../../../game/store/card/card-types';
import { State, StoreLike } from '../../../game';
import { Effect } from '../../../game/store/effects/effect';
import { COIN_FLIP_PROMPT, WAS_ATTACK_USED } from '../../../game/store/prefabs/prefabs';
import { DEFENDING_POKEMON_CANNOT_ATTACK, PREVENT_DAMAGE } from '../../../game/store/prefabs/effect-of-attack-prefabs';

export class Silcoon extends PokemonCard {
  public stage: Stage = Stage.STAGE_1;
  public evolvesFrom: string = 'Wurmple';
  public hp: number = 80;
  public cardType: CardType[] = [G];
  public weakness = [{ type: R, value: 20 }];
  public retreat = [C, C, C];

  public attacks = [{
    name: 'Harden',
    cost: [G],
    damage: 0,
    text: 'During your opponent\'s next turn, If Silcoon would be damaged by an attack, prevent that attack\'s damage done to Silcoon if that damage is 30 or less.'
  },
{
    name: 'Entangling String',
    cost: [G, C],
    damage: 20,
    text: 'Flip a coin. If heads, the Defending Pokémon can\'t attack during your opponent\'s next turn.'
  }];

  public set: string = 'DP';
  public cardImage: string = 'assets/cardback.png';
  public setNumber: string = '63';
  public name: string = 'Silcoon';
  public fullName: string = 'Silcoon DP';

  public reduceEffect(store: StoreLike, state: State, effect: Effect): State {
    // Harden
    if (WAS_ATTACK_USED(effect, 0, this)) {
      PREVENT_DAMAGE(store, state, effect, this, { maxDamage: 30 });
    }

    // Entangling String
    if (WAS_ATTACK_USED(effect, 1, this)) {
      COIN_FLIP_PROMPT(store, state, effect.player, result => {
        if (result) {
          DEFENDING_POKEMON_CANNOT_ATTACK(store, state, effect, this);
        }
      });
    }

    return state;
  }
}
