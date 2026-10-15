import { PokemonCard } from '../../../game/store/card/pokemon-card';
import { CardTag, CardType, Stage } from '../../../game/store/card/card-types';
import { PowerType, State, StateUtils, StoreLike } from '../../../game';
import { Effect } from '../../../game/store/effects/effect';
import { PlaceDamageCountersEffect } from '../../../game/store/effects/game-effects';
import {
  DRAW_CARDS,
  IS_ABILITY_BLOCKED,
  ON_DAMAGED_BY_OPPONENT_ATTACK_EVEN_IF_KNOCKED_OUT,
  WAS_ATTACK_USED,
} from '../../../game/store/prefabs/prefabs';

export class HopsPincurchinEx extends PokemonCard {
  public stage: Stage = Stage.BASIC;
  protected _tags = [CardTag.HOPS, CardTag.POKEMON_ex];
  public hp: number = 200;
  public cardType: CardType[] = [L];
  public weakness = [{ type: F }];
  public retreat = [C, C];

  public powers = [{
    name: 'Counterattack Quills',
    powerType: PowerType.ABILITY,
    text: 'If this Pokémon is in the Active Spot and is damaged by an attack from your opponent\'s Pokémon (even if this Pokémon is Knocked Out), place 3 damage counters on the Attacking Pokémon.'
  }];

  public attacks = [{
    name: 'Spiky Thunder',
    cost: [L, L, C],
    damage: 120,
    text: 'Draw 2 cards.'
  }];

  public regulationMark = 'I';
  public set: string = 'ASC';
  public cardImage: string = 'assets/cardback.png';
  public setNumber: string = '68';
  public name: string = 'Hop\'s Pincurchin ex';
  public fullName: string = 'Hop\'s Pincurchin ex ASC';

  public reduceEffect(store: StoreLike, state: State, effect: Effect): State {
    // Counterattack Quills
    if (ON_DAMAGED_BY_OPPONENT_ATTACK_EVEN_IF_KNOCKED_OUT(state, effect, { source: this })) {
      const abilityOwner = StateUtils.findOwner(state, effect.target);
      if (!IS_ABILITY_BLOCKED(store, state, abilityOwner, this)) {
        store.reduceEffect(
          state,
          new PlaceDamageCountersEffect(abilityOwner, effect.source, 30, this, this.powers[0]),
        );
      }
    }

    // Spiky Thunder
    if (WAS_ATTACK_USED(effect, 0, this)) {
      DRAW_CARDS(store, state, effect.player, 2);
    }

    return state;
  }
}
