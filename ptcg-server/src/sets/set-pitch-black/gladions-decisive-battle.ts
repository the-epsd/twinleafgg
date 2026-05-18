import { TrainerCard } from '../../game/store/card/trainer-card';
import { TrainerType } from '../../game/store/card/card-types';
import { GameError } from '../../game/game-error';
import { GameMessage } from '../../game/game-message';
import { Effect } from '../../game/store/effects/effect';
import { TrainerEffect } from '../../game/store/effects/play-card-effects';
import { DealDamageEffect } from '../../game/store/effects/attack-effects';
import { EndTurnEffect } from '../../game/store/effects/game-phase-effects';
import { StoreLike } from '../../game/store/store-like';
import { State } from '../../game/store/state/state';

export class GladionsDecisiveBattle extends TrainerCard {
  public trainerType: TrainerType = TrainerType.SUPPORTER;

  public regulationMark = 'J';
  public set: string = 'M5';
  public setNumber: string = '76';
  public cardImage: string = 'assets/cardback.png';
  public name: string = 'Gladion\'s Decisive Battle';
  public fullName: string = 'Gladion\'s Decisive Battle M5';
  public text: string = `You may only play this card if it is the only card in your hand.\n\nDuring this turn, attacks used by your Pokémon that do not have a Rule Box deal 80 more damage to your opponent's Active Pokémon.`;

  public readonly GLADION_MARKER = 'M5_GLADIONS_DECISIVE_BATTLE';

  public reduceEffect(_store: StoreLike, state: State, effect: Effect): State {

    if (effect instanceof TrainerEffect && effect.trainerCard === this) {
      const player = effect.player;

      if (player.supporterTurn > 0) {
        throw new GameError(GameMessage.SUPPORTER_ALREADY_PLAYED);
      }

      const otherHand = player.hand.cards.filter(c => c !== effect.trainerCard);
      if (otherHand.length !== 0) {
        throw new GameError(GameMessage.CANNOT_PLAY_THIS_CARD);
      }

      player.marker.addMarker(this.GLADION_MARKER, this);
    }

    if (effect instanceof DealDamageEffect
      && effect.player.marker.hasMarker(this.GLADION_MARKER, this)
      && effect.target === effect.opponent.active
      && !effect.source.hasRuleBox()) {
      effect.damage += 80;
    }

    if (effect instanceof EndTurnEffect) {
      effect.player.marker.removeMarker(this.GLADION_MARKER, this);
    }

    return state;
  }
}
