import { CardType, Stage } from '../../game/store/card/card-types';
import { Effect } from '../../game/store/effects/effect';
import { PokemonCard, StoreLike, State, StateUtils } from '../../game';
import { UseAttackEffect } from '../../game/store/effects/game-effects';
import { EndTurnEffect } from '../../game/store/effects/game-phase-effects';
import { ADD_MARKER, HAS_MARKER, MULTIPLE_COIN_FLIPS_PROMPT, WAS_ATTACK_USED } from '../../game/store/prefabs/prefabs';
import { ADD_CONFUSION_TO_PLAYER_ACTIVE, AFTER_ATTACK } from '../../game/store/prefabs/prefabs';
import { PlayerType } from '../../game/store/actions/play-card-action';

export class Octillery extends PokemonCard {
  public stage: Stage = Stage.STAGE_1;
  public evolvesFrom = 'Remoraid';
  public hp: number = 110;
  public cardType: CardType = W;
  public weakness = [{ type: L }];
  public retreat = [C, C];

  public attacks = [{
    name: 'Corner Stop',
    cost: [W],
    damage: 30,
    text: 'During your opponent\'s next turn, when the Defending Pokemon tries to attack, your opponent flips 2 coins. If either is tails, that attack does nothing.'
  },
  {
    name: 'Tantrum',
    cost: [W, C],
    damage: 120,
    text: 'This Pokemon is now Confused.'
  }];

  public regulationMark = 'J';
  public set: string = 'M4';
  public cardImage: string = 'assets/cardback.png';
  public setNumber: string = '17';
  public name: string = 'Octillery';
  public fullName: string = 'Octillery M4';

  public readonly CORNER_STOP_MARKER = 'OCTILLERY_M4_CORNER_STOP_MARKER';
  public readonly CLEAR_MARKER = 'OCTILLERY_M4_CLEAR_MARKER';
  public readonly USED_MARKER = 'OCTILLERY_M4_USED_MARKER';

  public reduceEffect(store: StoreLike, state: State, effect: Effect): State {
    if (WAS_ATTACK_USED(effect, 0, this)) {
      const opponent = StateUtils.getOpponent(state, effect.player);
      ADD_MARKER(this.CORNER_STOP_MARKER, opponent.active, this);
      ADD_MARKER(this.CLEAR_MARKER, opponent, this);
    }
    if (effect instanceof UseAttackEffect
      && HAS_MARKER(this.CORNER_STOP_MARKER, effect.player.active, this)) {
      const attackingPlayer = effect.player;
      const defender = StateUtils.getOpponent(state, attackingPlayer);
      if (HAS_MARKER(this.USED_MARKER, defender, this)) {
        return state;
      }
      effect.preventDefault = true;
      defender.marker.addMarker(this.USED_MARKER, this);
      return MULTIPLE_COIN_FLIPS_PROMPT(store, state, attackingPlayer, 2, results => {
        if (results.every(r => r)) {
          const useAttackEffect = new UseAttackEffect(attackingPlayer, effect.attack);
          store.reduceEffect(state, useAttackEffect);
        } else {
          store.reduceEffect(state, new EndTurnEffect(attackingPlayer));
        }
      });
    }
    if (effect instanceof EndTurnEffect) {
      effect.player.marker.removeMarker(this.USED_MARKER, this);
    }
    if (effect instanceof EndTurnEffect && HAS_MARKER(this.CLEAR_MARKER, effect.player, this)) {
      effect.player.marker.removeMarker(this.CLEAR_MARKER, this);
      const opponent = StateUtils.getOpponent(state, effect.player);
      opponent.forEachPokemon(PlayerType.TOP_PLAYER, cardList => {
        cardList.marker.removeMarker(this.CORNER_STOP_MARKER, this);
      });
    }
    if (AFTER_ATTACK(effect, 1, this)) {
      ADD_CONFUSION_TO_PLAYER_ACTIVE(store, state, effect.player, this);
    }
    return state;
  }
}
