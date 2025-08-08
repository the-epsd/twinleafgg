import { PokemonCard } from '../../game/store/card/pokemon-card';
import { Stage, CardType } from '../../game/store/card/card-types';
import { StoreLike, State, StateUtils } from '../../game';
import { Effect } from '../../game/store/effects/effect';
import { AbstractAttackEffect } from '../../game/store/effects/attack-effects';
import { MarkerConstants } from '../../game/store/markers/marker-constants';
import { WAS_ATTACK_USED, COIN_FLIP_PROMPT, PREVENT_DAMAGE, CLEAR_MARKER_AND_OPPONENTS_POKEMON_MARKER_AT_END_OF_TURN } from '../../game/store/prefabs/prefabs';

export class Barboach extends PokemonCard {
  public stage: Stage = Stage.BASIC;
  public cardType: CardType = F;
  public hp: number = 70;
  public weakness = [{ type: G }];
  public retreat = [C, C];

  public attacks = [{
    name: 'Hide',
    cost: [F],
    damage: 0,
    text: 'Flip a coin. If heads, during your opponent\'s next turn, prevent all damage from and effects of attacks done to this Pokémon.'
  },
  {
    name: 'Mud-Slap',
    cost: [F, C],
    damage: 20,
    text: ''
  }];

  public set: string = 'OBF';
  public setNumber: string = '108';
  public regulationMark = 'G';
  public cardImage: string = 'assets/cardback.png';
  public name: string = 'Barboach';
  public fullName: string = 'Barboach OBF';

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