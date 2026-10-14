import { Effect } from '../../../game/store/effects/effect';
import { TrainerCard } from '../../../game/store/card/trainer-card';
import { CardTag, TrainerType } from '../../../game/store/card/card-types';
import { StoreLike } from '../../../game/store/store-like';
import { State } from '../../../game/store/state/state';
import { DealDamageEffect } from '../../../game/store/effects/attack-effects';
import { EndTurnEffect } from '../../../game/store/effects/game-phase-effects';
import { GameError, GameMessage, Player, StateUtils } from '../../..';
import { MOVE_CARDS } from '../../../game/store/prefabs/prefabs';
import { WAS_TRAINER_USED } from '../../../game/store/prefabs/trainer-prefabs';

export class KarensConviction extends TrainerCard {
  protected _trainerType: TrainerType = TrainerType.SUPPORTER;
  public regulationMark = 'E';
  public set: string = 'CRE';
  public cardImage: string = 'assets/cardback.png';
  public setNumber: string = '144';
  public name: string = "Karen's Conviction";
  public fullName: string = "Karen's Conviction CRE";
  public text: string =
    "During this turn, your Single Strike Pokémon's attacks do 20 more damage to your opponent's Active Pokémon for each Prize card your opponent has taken (before applying Weakness and Resistance).";

  public readonly KARENS_CONVICTION_MARKER = 'KARENS_CONVICTION_MARKER';

  public canPlay(store: StoreLike, state: State, player: Player): boolean {
    if (player.supporterTurn > 0) {
      return false;
    }
    return true;
  }

  public reduceEffect(store: StoreLike, state: State, effect: Effect): State {
    if (WAS_TRAINER_USED(effect, this)) {
      const player = effect.player;

      if (player.supporterTurn > 0) {
        throw new GameError(GameMessage.SUPPORTER_ALREADY_PLAYED);
      }

      MOVE_CARDS(store, state, player.hand, player.supporter, {
        cards: [effect.trainerCard],
        sourceCard: this,
      });
      player.marker.addMarker(this.KARENS_CONVICTION_MARKER, this);
      return state;
    }

    if (effect instanceof DealDamageEffect) {
      const player = effect.player;
      if (
        player.marker.hasMarker(this.KARENS_CONVICTION_MARKER, this) &&
        effect.damage > 0 &&
        effect.target === StateUtils.getOpponent(state, player).active
      ) {
        const sourceCard = effect.source.getPokemonCard();
        if (sourceCard && sourceCard.tags.includes(CardTag.SINGLE_STRIKE)) {
          const opponent = StateUtils.getOpponent(state, player);
          effect.damage += opponent.prizesTaken * 20;
        }
      }
      return state;
    }

    if (
      effect instanceof EndTurnEffect &&
      effect.player.marker.hasMarker(this.KARENS_CONVICTION_MARKER, this)
    ) {
      effect.player.marker.removeMarker(this.KARENS_CONVICTION_MARKER, this);
    }

    return state;
  }
}
