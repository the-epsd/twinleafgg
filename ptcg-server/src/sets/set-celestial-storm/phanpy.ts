import { PokemonCard } from '../../game/store/card/pokemon-card';
import { Stage, CardType } from '../../game/store/card/card-types';
import { StoreLike, State, StateUtils, PlayerType } from '../../game';
import { Effect } from '../../game/store/effects/effect';
import { CheckHpEffect } from '../../game/store/effects/check-effects';
import { PutDamageEffect, AbstractAttackEffect } from '../../game/store/effects/attack-effects';
import { ADD_MARKER, COIN_FLIP_PROMPT, HAS_MARKER, REMOVE_MARKER, REMOVE_MARKER_AT_END_OF_TURN, WAS_ATTACK_USED } from '../../game/store/prefabs/prefabs';
import { EndTurnEffect } from '../../game/store/effects/game-phase-effects';

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

  public readonly PREVENT_KNOCKED_OUT_DURING_OPPONENTS_NEXT_TURN_MARKER = 'PREVENT_KNOCKED_OUT_DURING_OPPONENTS_NEXT_TURN_MARKER';
  public readonly CLEAR_PREVENT_KNOCKED_OUT_DURING_OPPONENTS_NEXT_TURN_MARKER = 'CLEAR_PREVENT_KNOCKED_OUT_DURING_OPPONENTS_NEXT_TURN_MARKER';

  public reduceEffect(store: StoreLike, state: State, effect: Effect): State {

    if (WAS_ATTACK_USED(effect, 1, this)) {
      const opponent = StateUtils.getOpponent(state, effect.player);
      COIN_FLIP_PROMPT(store, state, effect.player, result => {
        if (!result)
          return;
        ADD_MARKER(this.PREVENT_KNOCKED_OUT_DURING_OPPONENTS_NEXT_TURN_MARKER, effect.player.active, this);
        ADD_MARKER(this.CLEAR_PREVENT_KNOCKED_OUT_DURING_OPPONENTS_NEXT_TURN_MARKER, opponent, this);
      });
      return state;
    }

    //Endure UP
    if (effect instanceof AbstractAttackEffect && effect instanceof PutDamageEffect
      && HAS_MARKER(this.PREVENT_KNOCKED_OUT_DURING_OPPONENTS_NEXT_TURN_MARKER, effect.target, this)) {
      const player = StateUtils.findOwner(state, effect.target);
      const checkHpEffect = new CheckHpEffect(player, effect.target);
      store.reduceEffect(state, checkHpEffect);

      if (effect.damage >= (checkHpEffect.hp - player.active.damage)) {
        effect.preventDefault = true;
        effect.target.damage = checkHpEffect.hp - 10;
      }
      return state;
    }

    REMOVE_MARKER_AT_END_OF_TURN(effect, this.CLEAR_PREVENT_KNOCKED_OUT_DURING_OPPONENTS_NEXT_TURN_MARKER, this);

    if (effect instanceof EndTurnEffect) {
      //Remove the marker from Phanpy at the end of the opponent's turn.
      const opponent = StateUtils.getOpponent(state, effect.player);
      opponent.forEachPokemon(PlayerType.TOP_PLAYER, (cardList) => {
        REMOVE_MARKER(this.PREVENT_KNOCKED_OUT_DURING_OPPONENTS_NEXT_TURN_MARKER, cardList, this);
      });
    }
    return state;
  }
}