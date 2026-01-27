import { PokemonCard } from '../../game/store/card/pokemon-card';
import { CardType, Stage } from '../../game/store/card/card-types';
import { StoreLike, State, StateUtils } from '../../game';
import { Effect } from '../../game/store/effects/effect';
import { AbstractAttackEffect } from '../../game/store/effects/attack-effects';
import { CLEAR_MARKER_AND_OPPONENTS_POKEMON_MARKER_AT_END_OF_TURN, COIN_FLIP_PROMPT, PREVENT_DAMAGE, WAS_ATTACK_USED } from '../../game/store/prefabs/prefabs';
import { MarkerConstants } from '../../game/store/markers/marker-constants';

export class Snom extends PokemonCard {
  public stage: Stage = Stage.BASIC;
  public cardType: CardType = W;
  public hp: number = 50;
  public weakness = [{ type: M }];
  public retreat = [C];

  public attacks = [{
    name: 'Hide',
    cost: [W],
    damage: 0,
    text: 'Flip a coin. If heads, during your opponent\'s next turn, prevent all damage from and effects of attacks done to this Pokémon.'
  }];

  public set = 'MEG';
  public cardImage: string = 'assets/cardback.png';
  public setNumber: string = '42';
  public name = 'Snom';
  public fullName = 'Snom MEG';
  public regulationMark = 'I';

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