import { PokemonCard } from '../../game/store/card/pokemon-card';
import { StoreLike, State, GameError, GameMessage, StateUtils, CardType, Stage } from '../../game';
import { Effect } from '../../game/store/effects/effect';
import { AttackEffect } from '../../game/store/effects/game-effects';
import { EndTurnEffect } from '../../game/store/effects/game-phase-effects';
import { PlayItemEffect, PlaySupporterEffect } from '../../game/store/effects/play-card-effects';

export class Whismur extends PokemonCard {

  public stage: Stage = Stage.BASIC;

  public cardType: CardType = CardType.COLORLESS;

  public hp: number = 60;

  public weakness = [{ type: CardType.FIGHTING }];

  public retreat = [CardType.COLORLESS, CardType.COLORLESS];

  public attacks = [
    {
      name: 'Bawl',
      cost: [CardType.COLORLESS],
      damage: 0,
      text: 'You can use this attack only if you go second, and only on your first turn. Your opponent can\'t play any Trainer cards from their hand during their next turn.'
    },
    {
      name: 'Pound',
      cost: [CardType.COLORLESS, CardType.COLORLESS],
      damage: 20,
      text: ''
    }
  ];

  public set: string = 'CES';

  public cardImage: string = 'assets/cardback.png';

  public setNumber: string = '116';

  public name: string = 'Whismur';

  public fullName: string = 'Whismur CES';

  public readonly SUDDEN_SHRIEK_MARKER = 'SUDDEN_SHRIEK_MARKER';

  public reduceEffect(store: StoreLike, state: State, effect: Effect): State {

    if (effect instanceof AttackEffect && effect.attack === this.attacks[0]) {
      // Get current turn
      const turn = state.turn;

      // Check if it is player's first turn
      if (turn !== 2) {
        throw new GameError(GameMessage.CANNOT_USE_ATTACK);
      } else {

        const player = effect.player;
        const opponent = StateUtils.getOpponent(state, player);
        opponent.marker.addMarker(this.SUDDEN_SHRIEK_MARKER, this);
      }

      if (effect instanceof PlayItemEffect || effect instanceof PlaySupporterEffect) {
        const player = effect.player;
        const opponent = StateUtils.getOpponent(state, player);
        if (opponent.marker.hasMarker(this.SUDDEN_SHRIEK_MARKER, this)) {
          throw new GameError(GameMessage.BLOCKED_BY_EFFECT);
        }
      }

      if (effect instanceof EndTurnEffect) {
        effect.player.marker.removeMarker(this.SUDDEN_SHRIEK_MARKER, this);
      }
    }
    return state;
  }
}