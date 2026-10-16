import { PokemonCard } from '../../../game/store/card/pokemon-card';
import { CardType, Stage } from '../../../game/store/card/card-types';
import { PowerType, State, StateUtils, StoreLike } from '../../../game';
import { Effect } from '../../../game/store/effects/effect';
import { PutDamageEffect } from '../../../game/store/effects/attack-effects';
import { DRAW_CARDS, IS_POKEBODY_BLOCKED, WAS_ATTACK_USED } from '../../../game/store/prefabs/prefabs';

export class UnownW extends PokemonCard {
  public stage: Stage = Stage.BASIC;
  public hp: number = 90;
  public cardType: CardType[] = [P];
  public weakness = [{ type: P, value: +30 }];
  public retreat = [C, C, C];

  public powers = [{
    name: 'WALL',
    powerType: PowerType.POKEBODY,
    text: 'As long as Unown W is your Active Pokémon, any damage done to your Pokémon by an opponent\'s attack is reduced by 10 (after applying Weakness and Resistance).'
  }];

  public attacks = [{
    name: 'Hidden Power',
    cost: [P, C, C],
    damage: 50,
    text: 'Draw a card.'
  }];

  public set: string = 'LA';
  public cardImage: string = 'assets/cardback.png';
  public setNumber: string = '80';
  public name: string = 'Unown [W]';
  public fullName: string = 'Unown [W] LA';

  public reduceEffect(store: StoreLike, state: State, effect: Effect): State {
    // WALL
    if (effect instanceof PutDamageEffect) {
      const targetOwner = StateUtils.findOwner(state, effect.target);
      const sourceOwner = StateUtils.findOwner(state, effect.source);
      if (targetOwner === sourceOwner) {
        return state;
      }
      if (targetOwner.active.getPokemonCard() !== this) {
        return state;
      }
      if (IS_POKEBODY_BLOCKED(store, state, targetOwner, this)) {
        return state;
      }
      effect.damage = Math.max(0, effect.damage - 10);
    }

    // Hidden Power
    if (WAS_ATTACK_USED(effect, 0, this)) {
      DRAW_CARDS(store, state, effect.player, 1);
    }

    return state;
  }
}
