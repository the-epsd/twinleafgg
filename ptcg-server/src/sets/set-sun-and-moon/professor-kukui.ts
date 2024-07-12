import { GameError, GameMessage } from '../../game';
import { TrainerType } from '../../game/store/card/card-types';
import { TrainerCard } from '../../game/store/card/trainer-card';
import { DealDamageEffect } from '../../game/store/effects/attack-effects';
import { Effect } from '../../game/store/effects/effect';
import { EndTurnEffect } from '../../game/store/effects/game-phase-effects';
import { TrainerEffect } from '../../game/store/effects/play-card-effects';
import { State } from '../../game/store/state/state';
import { StoreLike } from '../../game/store/store-like';

export class ProfessorKukui extends TrainerCard {

  public trainerType: TrainerType = TrainerType.SUPPORTER;

  public set: string = 'SUM';

  public name: string = 'Professor Kukui';

  public fullName: string = 'Professor Kukui SUM';

  public cardImage: string = 'assets/cardback.png';

  public setNumber: string = '128';

  public text: string =
    'Draw 2 cards. During this turn, your Pokémon\'s attacks do 20 more damage to your opponent\'s Active Pokémon (before applying Weakness and Resistance).';

  private readonly PROFESSOR_KUKUI_MARKER = 'PROFESSOR_KUKUI_MARKER';

  public reduceEffect(store: StoreLike, state: State, effect: Effect): State {
    if (effect instanceof TrainerEffect && effect.trainerCard === this) {
      const player = effect.player;
      const supporterTurn = player.supporterTurn;

      if (supporterTurn > 0) {
        throw new GameError(GameMessage.SUPPORTER_ALREADY_PLAYED);
      }

      player.marker.addMarker(this.PROFESSOR_KUKUI_MARKER, this);
      player.hand.moveCardTo(effect.trainerCard, player.discard);
      player.deck.moveTo(player.hand, 2);

      return state;
    }

    if (effect instanceof DealDamageEffect) {
      const marker = effect.player.marker;
      if (marker.hasMarker(this.PROFESSOR_KUKUI_MARKER, this) && effect.damage > 0) {
        effect.damage += 20;
      }
      return state;
    }

    if (effect instanceof EndTurnEffect) {
      effect.player.marker.removeMarker(this.PROFESSOR_KUKUI_MARKER, this);
      return state;
    }

    return state;
  }

}
