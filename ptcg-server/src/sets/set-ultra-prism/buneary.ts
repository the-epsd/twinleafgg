import { PokemonCard } from '../../game/store/card/pokemon-card';
import { Stage, CardType } from '../../game/store/card/card-types';
import { StoreLike, State, StateUtils } from '../../game';
import { UseAttackEffect } from '../../game/store/effects/game-effects';
import { Effect } from '../../game/store/effects/effect';
import { EndTurnEffect } from '../../game/store/effects/game-phase-effects';
import { WAS_ATTACK_USED, ADD_MARKER, HAS_MARKER, COIN_FLIP_PROMPT, REMOVE_MARKER_AT_END_OF_TURN } from '../../game/store/prefabs/prefabs';

export class Buneary extends PokemonCard {
  public stage: Stage = Stage.BASIC;
  public cardType: CardType = C;
  public hp: number = 60;
  public weakness = [{ type: F }];
  public retreat = [C];

  public readonly WEAK_KNEED_MARKER = 'BUNEARY_UPR_WEAK_KNEED_MARKER';
  public readonly SMOKESCREEN_MARKER = 'BUNEARY_UPR_SMOKESCREEN_MARKER';

  public attacks = [
    {
      name: 'Weak Kneed',
      cost: [C],
      damage: 0,
      text: 'If the Defending Pokémon tries to attack during your opponent\'s next turn, your opponent flips a coin. If tails, that attack does nothing.'
    },
    {
      name: 'Skip',
      cost: [C],
      damage: 10,
      text: ''
    }
  ];

  public set: string = 'UPR';
  public setNumber: string = '106';
  public cardImage: string = 'assets/cardback.png';
  public name: string = 'Buneary';
  public fullName: string = 'Buneary UPR';

  public reduceEffect(store: StoreLike, state: State, effect: Effect): State {
    // Attack 1: Weak Kneed
    // Ref: set-unified-minds/wimpod.ts (Sand Attack - UseAttackEffect smokescreen pattern)
    if (WAS_ATTACK_USED(effect, 0, this)) {
      const player = effect.player;
      const opponent = StateUtils.getOpponent(state, player);
      ADD_MARKER(this.WEAK_KNEED_MARKER, opponent.active, this);
    }

    if (effect instanceof UseAttackEffect && HAS_MARKER(this.WEAK_KNEED_MARKER, effect.player.active, this)) {
      const player = effect.player;
      const opponent = StateUtils.getOpponent(state, player);

      if (HAS_MARKER(this.SMOKESCREEN_MARKER, opponent, this)) {
        return state; // Avoids recursion
      }

      effect.preventDefault = true;
      ADD_MARKER(this.SMOKESCREEN_MARKER, opponent, this); // Avoids recursion

      COIN_FLIP_PROMPT(store, state, player, result => {
        if (result) {
          const useAttackEffect = new UseAttackEffect(player, effect.attack);
          store.reduceEffect(state, useAttackEffect);
        } else {
          const endTurnEffect = new EndTurnEffect(player);
          store.reduceEffect(state, endTurnEffect);
        }
      });
    }

    REMOVE_MARKER_AT_END_OF_TURN(effect, this.SMOKESCREEN_MARKER, this);

    if (effect instanceof EndTurnEffect && effect.player.active.marker.hasMarker(this.WEAK_KNEED_MARKER, this)) {
      effect.player.active.marker.removeMarker(this.WEAK_KNEED_MARKER, this);
    }

    return state;
  }
}
