import { PokemonCard } from '../../game/store/card/pokemon-card';
import { Stage, CardType } from '../../game/store/card/card-types';
import { StoreLike } from '../../game/store/store-like';
import { State } from '../../game/store/state/state';
import { Effect } from '../../game/store/effects/effect';
import { AbstractAttackEffect } from '../../game/store/effects/attack-effects';
import { StateUtils } from '../../game/store/state-utils';
import { MarkerConstants } from '../../game/store/markers/marker-constants';
import { WAS_ATTACK_USED, COIN_FLIP_PROMPT, PREVENT_DAMAGE, CLEAR_MARKER_AND_OPPONENTS_POKEMON_MARKER_AT_END_OF_TURN } from '../../game/store/prefabs/prefabs';

export class Dunsparce extends PokemonCard {
  public stage: Stage = Stage.BASIC;
  public cardType: CardType = C;
  public hp: number = 60;
  public weakness = [{ type: F }];
  public retreat = [];

  public attacks = [{
    name: 'Gnaw',
    cost: [C],
    damage: 10,
    text: ''
  },
  {
    name: 'Dig',
    cost: [C, C],
    damage: 30,
    text: 'Flip a coin. If heads, during your opponent\'s next turn, prevent all damage from and effects of attacks done to this Pokémon.'
  }];

  public regulationMark = 'H';
  public set: string = 'TEF';
  public cardImage: string = 'assets/cardback.png';
  public setNumber: string = '128';
  public name: string = 'Dunsparce';
  public fullName: string = 'Dunsparce TEF';

  public readonly PREVENT_DAMAGE_DURING_OPPONENTS_NEXT_TURN_MARKER = 'PREVENT_DAMAGE_DURING_OPPONENTS_NEXT_TURN_MARKER';
  public readonly CLEAR_PREVENT_DAMAGE_DURING_OPPONENTS_NEXT_TURN_MARKER = 'CLEAR_PREVENT_DAMAGE_DURING_OPPONENTS_NEXT_TURN_MARKER';

  public reduceEffect(store: StoreLike, state: State, effect: Effect): State {

    if (WAS_ATTACK_USED(effect, 0, this)) {
      COIN_FLIP_PROMPT(store, state, effect.player, result => {
        if (result) {
          PREVENT_DAMAGE(store, state, effect, this);
        }
      });
    }

    if (effect instanceof AbstractAttackEffect && effect.target.cards.includes(this)) {
      const opponent = StateUtils.getOpponent(state, effect.player);
      const sourceCard = effect.source.getPokemonCard();

      if (sourceCard && opponent.active.marker.hasMarker(MarkerConstants.PREVENT_DAMAGE_DURING_OPPONENTS_NEXT_TURN_MARKER, this)) {
        effect.preventDefault = true;
      }
    }

    CLEAR_MARKER_AND_OPPONENTS_POKEMON_MARKER_AT_END_OF_TURN(state, effect, MarkerConstants.CLEAR_PREVENT_DAMAGE_DURING_OPPONENTS_NEXT_TURN_MARKER, MarkerConstants.PREVENT_DAMAGE_DURING_OPPONENTS_NEXT_TURN_MARKER, this);

    return state;
  }
}