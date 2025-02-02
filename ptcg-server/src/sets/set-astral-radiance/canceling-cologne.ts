import { TrainerCard } from '../../game/store/card/trainer-card';
import { TrainerType } from '../../game/store/card/card-types';
import { StoreLike } from '../../game/store/store-like';
import { State } from '../../game/store/state/state';
import { Effect } from '../../game/store/effects/effect';
import { StateUtils } from '../..';
import { PowerEffect } from '../../game/store/effects/game-effects';
import { EndTurnEffect } from '../../game/store/effects/game-phase-effects';
import { TrainerEffect } from '../../game/store/effects/play-card-effects';

export class CancelingCologne extends TrainerCard {

  public trainerType: TrainerType = TrainerType.ITEM;

  public regulationMark = 'F';

  public set: string = 'ASR';

  public name: string = 'Canceling Cologne';

  public cardImage: string = 'assets/cardback.png';

  public setNumber: string = '136';

  public fullName: string = 'Canceling Cologne ASR';

  public text: string =
    'Until the end of your turn, your opponent\'s Active Pokémon has no Abilities. (This includes Pokémon that come into play during that turn.)';

  public CANCELING_COLOGNE_MARKER = 'CANCELING_COLOGNE';

  public reduceEffect(store: StoreLike, state: State, effect: Effect): State {

    if (effect instanceof EndTurnEffect) {
      const player = effect.player;
      const opponent = StateUtils.getOpponent(state, player);

      if (opponent.marker.hasMarker(this.CANCELING_COLOGNE_MARKER)) {
        opponent.marker.removeMarker(this.CANCELING_COLOGNE_MARKER);
      }
    }

    if (effect instanceof TrainerEffect && effect.trainerCard === this) {
      const player = effect.player;
      const opponent = StateUtils.getOpponent(state, player);

      opponent.marker.addMarker(this.CANCELING_COLOGNE_MARKER, this);

      // We will discard this card after prompt confirmation
      effect.preventDefault = true;
      player.hand.moveCardTo(effect.trainerCard, player.supporter);

      player.supporter.moveCardTo(effect.trainerCard, player.discard);
    }

    if (effect instanceof PowerEffect && !effect.power.exemptFromAbilityLock) {
      const player = effect.player;
      const opponent = StateUtils.getOpponent(state, player);

      const pokemonCard = effect.card;
      const activePokemon = opponent.active.cards[0]; // Assuming activePokemon is the first card in the array
      if (opponent.marker.hasMarker(this.CANCELING_COLOGNE_MARKER)) {
        if (pokemonCard === activePokemon) {
          effect.preventDefault = true;
          return state;
        }
      }
    }
    return state;
  }
}