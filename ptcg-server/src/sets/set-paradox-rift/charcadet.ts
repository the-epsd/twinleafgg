import { PokemonCard } from '../../game/store/card/pokemon-card';
import { Stage, CardType } from '../../game/store/card/card-types';
import { StoreLike, State, StateUtils } from '../../game';
import { Effect } from '../../game/store/effects/effect';
import { CLEAR_MARKER_AND_OPPONENTS_POKEMON_MARKER_AT_END_OF_TURN, COIN_FLIP_PROMPT, PREVENT_DAMAGE, WAS_ATTACK_USED } from '../../game/store/prefabs/prefabs';
import { MarkerConstants } from '../../game/store/markers/marker-constants';
import { AbstractAttackEffect } from '../../game/store/effects/attack-effects';

export class Charcadet extends PokemonCard {
  public stage: Stage = Stage.BASIC;
  public cardType: CardType = CardType.FIRE;
  public hp: number = 60;
  public weakness = [{ type: CardType.WATER }];
  public retreat = [CardType.COLORLESS];

  public attacks = [{
    name: 'Protect',
    cost: [CardType.COLORLESS],
    damage: 0,
    text: ' Flip a coin. If heads, during your opponent\'s next turn, prevent all damage from and effects of attacks done to this Pokémon.'
  },
  {
    name: 'Magma Punch',
    cost: [CardType.FIRE, CardType.COLORLESS],
    damage: 20,
    text: ''
  }];

  public set: string = 'PAR';
  public setNumber: string = '25';
  public regulationMark: string = 'G';
  public cardImage: string = 'assets/cardback.png';
  public name: string = 'Charcadet';
  public fullName: string = 'Charcadet PAR';

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