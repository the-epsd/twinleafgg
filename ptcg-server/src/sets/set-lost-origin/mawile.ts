import { PokemonCard } from '../../game/store/card/pokemon-card';
import { Stage, CardType } from '../../game/store/card/card-types';
import { StoreLike, State, StateUtils, GameError, GameMessage } from '../../game';
import { Effect } from '../../game/store/effects/effect';
import { AttackEffect, RetreatEffect } from '../../game/store/effects/game-effects';
import { EndTurnEffect } from '../../game/store/effects/game-phase-effects';
import { PutDamageEffect } from '../../game/store/effects/attack-effects';
import { MarkerConstants } from '../../game/store/markers/marker-constants';

export class Mawile extends PokemonCard {

  public stage: Stage = Stage.BASIC;

  public regulationMark = 'F';

  public cardType: CardType = CardType.PSYCHIC;

  public hp: number = 90;

  public weakness = [{ type: CardType.METAL }];

  public retreat = [CardType.COLORLESS];

  public attacks =
    [
      {
        name: 'Tempting Trap',
        cost: [CardType.COLORLESS],
        damage: 0,
        text: 'During your opponent\'s next turn, the Defending Pokémon can\'t retreat. During your next turn, the Defending Pokémon takes 90 more damage from attacks (after applying Weakness and Resistance).'
      },
      {
        name: 'Bite',
        cost: [CardType.PSYCHIC, CardType.COLORLESS, CardType.COLORLESS],
        damage: 90,
        text: ''
      }
    ];

  public set: string = 'LOR';

  public cardImage: string = 'assets/cardback.png';

  public setNumber: string = '71';

  public name: string = 'Mawile';

  public fullName: string = 'Mawile LOR';

  public reduceEffect(store: StoreLike, state: State, effect: Effect): State {
    if (effect instanceof AttackEffect && effect.attack === this.attacks[0]) {
      const player = effect.player;
      const opponent = StateUtils.getOpponent(state, player);

      // Add markers for next turn effects
      opponent.active.marker.addMarker(MarkerConstants.DURING_OPPONENTS_NEXT_TURN_DEFENDING_POKEMON_TAKES_MORE_DAMAGE_MARKER, this);
      opponent.marker.addMarker(MarkerConstants.CLEAR_DURING_OPPONENTS_NEXT_TURN_DEFENDING_POKEMON_TAKES_MORE_DAMAGE_MARKER, this);
      opponent.active.marker.addMarker(MarkerConstants.DEFENDING_POKEMON_CANNOT_RETREAT_MARKER, this);

      return state;
    }

    // Handle retreat blocking
    if (effect instanceof RetreatEffect && effect.player.active.marker.hasMarker(MarkerConstants.DEFENDING_POKEMON_CANNOT_RETREAT_MARKER, this)) {
      throw new GameError(GameMessage.BLOCKED_BY_EFFECT);
    }

    // Clear retreat block at end of affected turn
    if (effect instanceof EndTurnEffect && effect.player.marker.hasMarker(MarkerConstants.CLEAR_DURING_OPPONENTS_NEXT_TURN_DEFENDING_POKEMON_TAKES_MORE_DAMAGE_MARKER, this)) {
      effect.player.marker.removeMarker(MarkerConstants.CLEAR_DURING_OPPONENTS_NEXT_TURN_DEFENDING_POKEMON_TAKES_MORE_DAMAGE_MARKER, this);
      effect.player.active.marker.removeMarker(MarkerConstants.DEFENDING_POKEMON_CANNOT_RETREAT_MARKER, this);
    }

    // Handle damage boost effect
    if (effect instanceof PutDamageEffect && effect.target.marker.hasMarker(MarkerConstants.DURING_OPPONENTS_NEXT_TURN_DEFENDING_POKEMON_TAKES_MORE_DAMAGE_MARKER, this) && effect.damage > 0) {
      return state;
    }

    if (effect instanceof EndTurnEffect) {
      const player = effect.player;
      const opponent = StateUtils.getOpponent(state, player);

      if (opponent.active.marker.hasMarker(MarkerConstants.DURING_OPPONENTS_NEXT_TURN_DEFENDING_POKEMON_TAKES_MORE_DAMAGE_MARKER, this) && !opponent.marker.hasMarker(MarkerConstants.CLEAR_DURING_OPPONENTS_NEXT_TURN_DEFENDING_POKEMON_TAKES_MORE_DAMAGE_MARKER, this)) {
        opponent.active.marker.removeMarker(MarkerConstants.DURING_OPPONENTS_NEXT_TURN_DEFENDING_POKEMON_TAKES_MORE_DAMAGE_MARKER, this);
      }
    }
    return state;
  }
}
