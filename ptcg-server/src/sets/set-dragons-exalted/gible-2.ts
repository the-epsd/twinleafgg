import { PokemonCard } from '../../game/store/card/pokemon-card';
import { Stage, CardType } from '../../game/store/card/card-types';
import { StoreLike, State, StateUtils } from '../../game';
import { Effect } from '../../game/store/effects/effect';
import { UseAttackEffect } from '../../game/store/effects/game-effects';
import { EndTurnEffect } from '../../game/store/effects/game-phase-effects';
import { WAS_ATTACK_USED, COIN_FLIP_PROMPT, ADD_MARKER, HAS_MARKER, REMOVE_MARKER_AT_END_OF_TURN } from '../../game/store/prefabs/prefabs';
import { FLIP_A_COIN_IF_HEADS_DEAL_MORE_DAMAGE } from '../../game/store/prefabs/attack-effects';

export class Gible2 extends PokemonCard {
  public stage: Stage = Stage.BASIC;
  public cardType: CardType = N;
  public hp: number = 60;
  public weakness = [{ type: N }];
  public retreat = [C];

  public attacks = [
    {
      name: 'Sand-Attack',
      cost: [F],
      damage: 0,
      text: 'If the Defending Pokemon tries to attack during your opponent\'s next turn, your opponent flips a coin. If tails, that attack does nothing.'
    },
    {
      name: 'Knock Away',
      cost: [W, C],
      damage: 10,
      damageCalculation: '+' as '+',
      text: 'Flip a coin. If heads, this attack does 20 more damage.'
    }
  ];

  public set: string = 'DRX';
  public setNumber: string = '87';
  public cardImage: string = 'assets/cardback.png';
  public name: string = 'Gible';
  public fullName: string = 'Gible DRX 87';

  public readonly DEFENDING_POKEMON_CANNOT_ATTACK_MARKER = 'GIBLE2_DEFENDING_CANNOT_ATTACK_MARKER';
  public readonly SAND_ATTACK_MARKER = 'GIBLE2_SAND_ATTACK_MARKER';

  public reduceEffect(store: StoreLike, state: State, effect: Effect): State {
    // Attack 1: Sand-Attack
    if (WAS_ATTACK_USED(effect, 0, this)) {
      const opponent = StateUtils.getOpponent(state, effect.player);
      ADD_MARKER(this.DEFENDING_POKEMON_CANNOT_ATTACK_MARKER, opponent.active, this);
    }

    if (effect instanceof UseAttackEffect && HAS_MARKER(this.DEFENDING_POKEMON_CANNOT_ATTACK_MARKER, effect.player.active, this)) {
      const player = effect.player;
      const opponent = StateUtils.getOpponent(state, player);

      if (HAS_MARKER(this.SAND_ATTACK_MARKER, opponent, this)) {
        return state;
      }

      effect.preventDefault = true;
      ADD_MARKER(this.SAND_ATTACK_MARKER, opponent, this);

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

    REMOVE_MARKER_AT_END_OF_TURN(effect, this.SAND_ATTACK_MARKER, this);

    if (effect instanceof EndTurnEffect
      && effect.player.active.marker.hasMarker(this.DEFENDING_POKEMON_CANNOT_ATTACK_MARKER, this)) {
      effect.player.active.marker.removeMarker(this.DEFENDING_POKEMON_CANNOT_ATTACK_MARKER, this);
    }

    // Attack 2: Knock Away - flip for +20
    if (WAS_ATTACK_USED(effect, 1, this)) {
      FLIP_A_COIN_IF_HEADS_DEAL_MORE_DAMAGE(store, state, effect, 20);
    }

    return state;
  }
}
