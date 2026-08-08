import { PokemonCard } from '../../../game/store/card/pokemon-card';
import { Stage, CardType } from '../../../game/store/card/card-types';
import { StoreLike, State, StateUtils, GameError, GameMessage } from '../../../game';
import { Effect } from '../../../game/store/effects/effect';

import { PlaySupporterEffect } from '../../../game/store/effects/play-card-effects';
import { EndTurnEffect } from '../../../game/store/effects/game-phase-effects';
import { WAS_ATTACK_USED, COIN_FLIP_PROMPT } from '../../../game/store/prefabs/prefabs';

export class Exeggutor extends PokemonCard {
  public stage: Stage = Stage.STAGE_1;
  public evolvesFrom = 'Exeggcute';
  public cardType: CardType = G;
  public hp: number = 100;
  public weakness = [{ type: R }];
  public resistance = [{ type: W, value: -20 }];
  public retreat = [C, C];

  public attacks = [{
    name: 'Blockade',
    cost: [C],
    damage: 10,
    text: 'Your opponent can\'t play any Supporter cards from his or her hand during his or her next turn.'
  }, {
    name: 'Stomp',
    cost: [G, C, C],
    damage: 60,
    text: 'Flip a coin. If heads, this attack does 30 more damage. '
  }];

  public set: string = 'PLF';
  public setNumber: string = '5';
  public cardImage: string = 'assets/cardback.png';
  public name: string = 'Exeggutor';
  public fullName: string = 'Exeggutor PLF';

  public readonly OPPONENT_CANNOT_PLAY_SUPPORTER_CARDS_MARKER = 'OPPONENT_CANNOT_PLAY_SUPPORTER_CARDS_MARKER';

  public reduceEffect(store: StoreLike, state: State, effect: Effect): State {

    if (WAS_ATTACK_USED(effect, 0, this)) {
      const player = effect.player;
      const opponent = StateUtils.getOpponent(state, player);

      opponent.marker.addMarker(this.OPPONENT_CANNOT_PLAY_SUPPORTER_CARDS_MARKER, this);
    }

    if (WAS_ATTACK_USED(effect, 1, this)) {
      const player = effect.player;

      return COIN_FLIP_PROMPT(store, state, player, result => {
        if (result === true) {
          effect.damage += 30;
        }
      });
    }

    if (effect instanceof PlaySupporterEffect) {
      const player = effect.player;
      if (player.marker.hasMarker(this.OPPONENT_CANNOT_PLAY_SUPPORTER_CARDS_MARKER, this)) {
        throw new GameError(GameMessage.BLOCKED_BY_EFFECT);
      }
    }

    if (effect instanceof EndTurnEffect) {
      effect.player.marker.removeMarker(this.OPPONENT_CANNOT_PLAY_SUPPORTER_CARDS_MARKER, this);
    }

    return state;
  }
}