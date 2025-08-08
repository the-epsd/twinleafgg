import { PokemonCard } from '../../game/store/card/pokemon-card';
import { Stage, CardType, CardTag } from '../../game/store/card/card-types';
import { StoreLike, State, StateUtils } from '../../game';
import { Effect } from '../../game/store/effects/effect';
import { CLEAR_MARKER_AND_OPPONENTS_POKEMON_MARKER_AT_END_OF_TURN, COIN_FLIP_PROMPT, PREVENT_DAMAGE, WAS_ATTACK_USED } from '../../game/store/prefabs/prefabs';
import { AbstractAttackEffect } from '../../game/store/effects/attack-effects';
import { MarkerConstants } from '../../game/store/markers/marker-constants';

export class CynthiasFeebas extends PokemonCard {
  public stage: Stage = Stage.BASIC;
  public tags = [CardTag.CYNTHIAS];
  public cardType: CardType = W;
  public hp: number = 30;
  public weakness = [{ type: L }];
  public retreat = [C];

  public attacks = [{
    name: 'Undulate',
    cost: [C],
    damage: 10,
    text: 'Flip a coin. If heads, during your opponent\'s next turn, prevent all damage from and effects of attacks done to this Pokémon.'
  }];

  public regulationMark = 'I';
  public set: string = 'DRI';
  public setNumber: string = '52';
  public cardImage: string = 'assets/cardback.png';
  public name: string = 'Cynthia\'s Feebas';
  public fullName: string = 'Cynthia\'s Feebas DRI';

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