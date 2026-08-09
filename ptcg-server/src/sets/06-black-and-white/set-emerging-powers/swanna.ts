import { PokemonCard } from '../../../game/store/card/pokemon-card';
import { Stage, CardType } from '../../../game/store/card/card-types';
import { StoreLike, State } from '../../../game';
import { Effect } from '../../../game/store/effects/effect';
import { COIN_FLIP_PROMPT, WAS_ATTACK_USED } from '../../../game/store/prefabs/prefabs';
import { PREVENT_DAMAGE, PREVENT_EFFECTS_OF_ATTACKS } from '../../../game/store/prefabs/effect-of-attack-prefabs';
import { DISCARD_X_ENERGY_FROM_THIS_POKEMON } from '../../../game/store/prefabs/costs';

export class Swanna extends PokemonCard {
  public stage: Stage = Stage.STAGE_1;
  public evolvesFrom: string = 'Ducklett';
  public cardType: CardType = W;
  public hp: number = 90;
  public weakness = [{ type: L }];
  public resistance = [{ type: F, value: -20 }];
  public retreat = [C];

  public attacks = [{
    name: 'Wing Dance',
    cost: [C, C],
    damage: 30,
    text: 'Flip a coin. If heads, prevent all effects of attacks, including damage, done to this Pokémon during your opponent\'s next turn.'
  }, {
    name: 'Air Slash',
    cost: [W, C, C],
    damage: 70,
    text: 'Discard an Energy attached to this Pokémon.'
  }];

  public set: string = 'EPO';
  public setNumber: string = '27';
  public cardImage: string = 'assets/cardback.png';
  public name: string = 'Swanna';
  public fullName: string = 'Swanna EPO';

  public reduceEffect(store: StoreLike, state: State, effect: Effect): State {
    // Wing Dance
    if (WAS_ATTACK_USED(effect, 0, this)) {
      COIN_FLIP_PROMPT(store, state, effect.player, result => {
        if (result) {
          PREVENT_DAMAGE(store, state, effect, this);
          PREVENT_EFFECTS_OF_ATTACKS(store, state, effect, this);
        }
      });
    }

    // Air Slash
    if (WAS_ATTACK_USED(effect, 1, this)) {
      DISCARD_X_ENERGY_FROM_THIS_POKEMON(store, state, effect, 1);
    }

    return state;
  }
}
