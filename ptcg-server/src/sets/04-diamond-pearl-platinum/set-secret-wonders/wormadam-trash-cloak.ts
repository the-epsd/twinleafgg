import { PokemonCard } from '../../../game/store/card/pokemon-card';
import { CardType, Stage } from '../../../game/store/card/card-types';
import { GamePhase, PowerType, State, StateUtils, StoreLike } from '../../../game';
import { Effect } from '../../../game/store/effects/effect';
import { PutDamageEffect } from '../../../game/store/effects/attack-effects';
import { IS_POKEBODY_BLOCKED, THIS_POKEMON_DOES_DAMAGE_TO_ITSELF, WAS_ATTACK_USED } from '../../../game/store/prefabs/prefabs';

export class WormadamTrashCloak extends PokemonCard {
  public stage: Stage = Stage.STAGE_1;
  public evolvesFrom: string = 'Burmy Trash Cloak';
  public hp: number = 70;
  public cardType: CardType[] = [M];
  public weakness = [{ type: R, value: +20 }];
  public resistance = [{ type: P, value: -20 }];
  public retreat = [C];

  public powers = [{
    name: 'Trash Cloak',
    powerType: PowerType.POKEBODY,
    text: 'If Wormadam Trash Cloak has a Pokémon Tool card attached to it, any damage done to Wormadam Trash Cloak by attacks is reduced by 20 (after applying Weakness and Resistance).'
  }];

  public attacks = [{
    name: 'Iron Tackle',
    cost: [M, M, C],
    damage: 70,
    text: 'Wormadam Trash Cloak does 20 damage to itself.'
  }];

  public set: string = 'SW';
  public cardImage: string = 'assets/cardback.png';
  public setNumber: string = '43';
  public name: string = 'Wormadam Trash Cloak';
  public fullName: string = 'Wormadam Trash Cloak SW';

  public reduceEffect(store: StoreLike, state: State, effect: Effect): State {
    // Trash Cloak
    if (
      effect instanceof PutDamageEffect
      && effect.target.cards.includes(this)
      && effect.target.getPokemonCard() === this
      && state.phase === GamePhase.ATTACK
    ) {
      const owner = StateUtils.findOwner(state, effect.target);
      if (IS_POKEBODY_BLOCKED(store, state, owner, this)) {
        return state;
      }
      if (effect.target.tools.length > 0) {
        effect.damage = Math.max(0, effect.damage - 20);
      }
    }

    // Iron Tackle
    if (WAS_ATTACK_USED(effect, 0, this)) {
      THIS_POKEMON_DOES_DAMAGE_TO_ITSELF(store, state, effect, 20);
    }

    return state;
  }
}
