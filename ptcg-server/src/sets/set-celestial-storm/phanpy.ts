import { PokemonCard } from '../../game/store/card/pokemon-card';
import { Stage, CardType } from '../../game/store/card/card-types';
import { StoreLike, State, StateUtils } from '../../game';
import { Effect } from '../../game/store/effects/effect';
import { PutDamageEffect } from '../../game/store/effects/attack-effects';
import { ADD_MARKER, CLEAR_MARKER_AND_OPPONENTS_POKEMON_MARKER_AT_END_OF_TURN, HAS_MARKER, WAS_ATTACK_USED } from '../../game/store/prefabs/prefabs';
import { MarkerConstants } from '../../game/store/markers/marker-constants';
import { CoinFlipEffect } from '../../game/store/effects/play-card-effects';

export class Phanpy extends PokemonCard {
  public stage: Stage = Stage.BASIC;
  public cardType: CardType = F;
  public hp: number = 70;
  public weakness = [{ type: G }];
  public retreat = [C];

  public attacks = [{
    name: 'Tackle',
    cost: [C],
    damage: 10,
    text: ''
  },
  {
    name: 'Endure',
    cost: [F],
    damage: 0,
    text: 'Flip a coin. If heads, if this Pokémon would be Knocked Out by damage from an attack during your opponent\'s next turn, it is not Knocked Out, and its remaining HP becomes 10.'
  }];

  public set = 'CES';
  public cardImage: string = 'assets/cardback.png';
  public setNumber: string = '72';
  public name = 'Phanpy';
  public fullName = 'Phanpy CES';

  public reduceEffect(store: StoreLike, state: State, effect: Effect): State {
    if (WAS_ATTACK_USED(effect, 1, this)) {
      const opponent = StateUtils.getOpponent(state, effect.player);
      const coinFlipEffect = new CoinFlipEffect(effect.player, (result: boolean) => {
        if (result) {
          ADD_MARKER(MarkerConstants.PREVENT_KNOCKED_OUT_DURING_OPPONENTS_NEXT_TURN_MARKER, effect.player.active, this);
          ADD_MARKER(MarkerConstants.CLEAR_PREVENT_KNOCKED_OUT_DURING_OPPONENTS_NEXT_TURN_MARKER, opponent, this);
        }
      });
      store.reduceEffect(state, coinFlipEffect);
      return state;
    }

    //Endure UP
    if (effect instanceof PutDamageEffect
      && effect.target.cards.includes(this)
      && HAS_MARKER(MarkerConstants.PREVENT_KNOCKED_OUT_DURING_OPPONENTS_NEXT_TURN_MARKER, effect.target, this)) {
      effect.surviveOnTenHPReason = this.attacks[1].name;
      return state;
    }

    CLEAR_MARKER_AND_OPPONENTS_POKEMON_MARKER_AT_END_OF_TURN(state, effect, MarkerConstants.CLEAR_PREVENT_KNOCKED_OUT_DURING_OPPONENTS_NEXT_TURN_MARKER, MarkerConstants.PREVENT_KNOCKED_OUT_DURING_OPPONENTS_NEXT_TURN_MARKER, this);
    return state;
  }
}