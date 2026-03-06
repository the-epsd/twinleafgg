import { CardType, Stage } from '../../game/store/card/card-types';
import { PowerType } from '../../game/store/card/pokemon-types';
import { Effect } from '../../game/store/effects/effect';
import { RetreatEffect } from '../../game/store/effects/game-effects';
import { PokemonCard, PlayerType, StateUtils, StoreLike, State } from '../../game';
import { GameError, GameMessage } from '../../game';
import { ADD_MARKER, COIN_FLIP_PROMPT, DISCARD_TOP_X_CARDS_FROM_YOUR_DECK, REMOVE_MARKER, WAS_ATTACK_USED } from '../../game/store/prefabs/prefabs';

const GOODRA_SLIMY_SLIP_ALLOWED = 'GOODRA_SLIMY_SLIP_ALLOWED';

export class Goodra extends PokemonCard {
  public stage: Stage = Stage.STAGE_2;
  public evolvesFrom = 'Sliggoo';
  public hp: number = 160;
  public cardType: CardType = N;
  public weakness: { type: CardType }[] = [];
  public resistance: { type: CardType; value: number }[] = [];
  public retreat = [C, C, C];
  public powers = [{
    name: 'Slimy Slip',
    powerType: PowerType.ABILITY,
    text: 'When your opponent\'s Active Pokemon retreats, they flip a coin. If tails, that retreat fails and no Energy is discarded.'
  }];
  public attacks = [{
    name: 'Dragon Pulse',
    cost: [N, N, C],
    damage: 160,
    text: 'Discard the top card of your deck.'
  }];
  public regulationMark = 'J';
  public set: string = 'M4';
  public cardImage: string = 'assets/cardback.png';
  public setNumber: string = '66';
  public name: string = 'Goodra';
  public fullName: string = 'Goodra M4';

  public reduceEffect(store: StoreLike, state: State, effect: Effect): State {
    if (effect instanceof RetreatEffect) {
      const player = effect.player;
      const opponent = StateUtils.getOpponent(state, player);
      if (player.marker.hasMarker(GOODRA_SLIMY_SLIP_ALLOWED)) {
        REMOVE_MARKER(GOODRA_SLIMY_SLIP_ALLOWED, player);
        return state;
      }
      let isGoodraInPlay = false;
      opponent.forEachPokemon(PlayerType.TOP_PLAYER, (cardList, card) => {
        if (card === this) isGoodraInPlay = true;
      });
      if (isGoodraInPlay) {
        effect.preventDefault = true;
        return COIN_FLIP_PROMPT(store, state, player, result => {
          if (!result) {
            throw new GameError(GameMessage.BLOCKED_BY_ABILITY);
          }
          ADD_MARKER(GOODRA_SLIMY_SLIP_ALLOWED, player, this);
          effect.preventDefault = false;
          store.reduceEffect(state, effect);
        });
      }
    }
    if (WAS_ATTACK_USED(effect, 0, this)) {
      DISCARD_TOP_X_CARDS_FROM_YOUR_DECK(store, state, effect.player, 1, this, effect);
    }
    return state;
  }
}
