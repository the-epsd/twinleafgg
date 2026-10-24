import { CardTag, GameError, GameMessage, Player, State, StateUtils, StoreLike, TrainerCard, TrainerType } from '../../../game';
import { DealDamageEffect } from '../../../game/store/effects/attack-effects';
import { Effect } from '../../../game/store/effects/effect';
import { EndTurnEffect } from '../../../game/store/effects/game-phase-effects';
import { TrainerEffect } from '../../../game/store/effects/play-card-effects';

export class KorrinasDetermination extends TrainerCard {
  protected _trainerType: TrainerType = TrainerType.SUPPORTER;
  public regulationMark = 'J';
  public set: string = 'M7';
  public cardImage: string = 'assets/cardback.png';
  public setNumber: string = '75';
  public name: string = 'Korrina\'s Determination';
  public fullName: string = 'Korrina\'s Determination FLO';
  public text: string =
    'During this turn, attacks used by your Mega Evolution ex do 20 more damage to your opponent\'s Active Pokémon for each Prize card your opponent has already taken.';

  public readonly KORRINA_MARKER = 'FLO_KORRINAS_DETERMINATION_MARKER';

  public canPlay(_store: StoreLike, _state: State, player: Player): boolean {
    if (player.supporterTurn > 0) {
      return false;
    }
    return true;
  }

  public reduceEffect(_store: StoreLike, state: State, effect: Effect): State {
    if (effect instanceof TrainerEffect && effect.trainerCard === this) {
      const player = effect.player;

      if (player.supporterTurn > 0) {
        throw new GameError(GameMessage.SUPPORTER_ALREADY_PLAYED);
      }

      player.marker.addMarker(this.KORRINA_MARKER, this);
    }

    if (effect instanceof DealDamageEffect && effect.player.marker.hasMarker(this.KORRINA_MARKER, this)) {
      const player = effect.player;
      const opponent = StateUtils.getOpponent(state, player);
      const sourceCard = effect.source.getPokemonCard();
      if (
        effect.damage > 0 &&
        effect.target === opponent.active &&
        sourceCard &&
        sourceCard.hasTag(CardTag.POKEMON_SV_MEGA)
      ) {
        effect.damage += opponent.prizesTaken * 20;
      }
    }

    if (effect instanceof EndTurnEffect) {
      effect.player.marker.removeMarker(this.KORRINA_MARKER, this);
    }

    return state;
  }
}
