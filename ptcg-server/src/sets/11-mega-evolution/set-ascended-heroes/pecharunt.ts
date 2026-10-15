import { PokemonCard } from '../../../game/store/card/pokemon-card';
import { CardType, Stage } from '../../../game/store/card/card-types';
import { PowerType, State, StoreLike } from '../../../game';
import { Effect } from '../../../game/store/effects/effect';
import { KnockOutEffect } from '../../../game/store/effects/game-effects';
import { NEXT_TURN_ATTACK_BONUS } from '../../../game/store/prefabs/attack-effects';
import {
  IS_ABILITY_BLOCKED,
  SEARCH_DECK_FOR_CARDS_TO_HAND,
} from '../../../game/store/prefabs/prefabs';

export class Pecharunt extends PokemonCard {
  public stage: Stage = Stage.BASIC;
  public hp: number = 80;
  public cardType: CardType[] = [D];
  public weakness = [{ type: F }];
  public retreat = [C];

  public powers = [{
    name: 'Final Chain',
    powerType: PowerType.ABILITY,
    text: 'If this Pokémon is Knocked Out by damage from an attack from your opponent\'s Pokémon, search your deck for a card and put it into your hand. Then, shuffle your deck.'
  }];

  public attacks = [{
    name: 'Mochi Rush',
    cost: [D],
    damage: 20,
    text: 'During your next turn, this Pokémon\'s Mochi Rush attack does 50 more damage (before applying Weakness and Resistance).'
  }];

  public regulationMark = 'I';
  public set: string = 'ASC';
  public cardImage: string = 'assets/cardback.png';
  public setNumber: string = '143';
  public name: string = 'Pecharunt';
  public fullName: string = 'Pecharunt ASC';

  public reduceEffect(store: StoreLike, state: State, effect: Effect): State {
    // Final Chain
    if (
      effect instanceof KnockOutEffect &&
      effect.target.cards.includes(this) &&
      effect.target.getPokemonCard() === this &&
      effect.player.marker.hasMarker(effect.player.DAMAGE_DEALT_MARKER)
    ) {
      const player = effect.player;
      if (!IS_ABILITY_BLOCKED(store, state, player, this)) {
        SEARCH_DECK_FOR_CARDS_TO_HAND(
          store,
          state,
          player,
          this,
          {},
          { min: 1, max: 1, allowCancel: false },
          this.powers[0],
        );
      }
    }

    // Mochi Rush
    NEXT_TURN_ATTACK_BONUS(effect, {
      attack: this.attacks[0],
      source: this,
      bonusDamage: 50,
    });

    return state;
  }
}
