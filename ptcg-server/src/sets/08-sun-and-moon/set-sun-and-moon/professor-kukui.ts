import { GameError, GameMessage, Player } from '../../../game';
import { TrainerType } from '../../../game/store/card/card-types';
import { TrainerCard } from '../../../game/store/card/trainer-card';
import { DealDamageEffect } from '../../../game/store/effects/attack-effects';
import { Effect } from '../../../game/store/effects/effect';
import { State } from '../../../game/store/state/state';
import { StoreLike } from '../../../game/store/store-like';
import {
  ADD_MARKER,
  DRAW_CARDS,
  HAS_MARKER,
  REMOVE_MARKER_AT_END_OF_TURN,
} from '../../../game/store/prefabs/prefabs';
import { WAS_TRAINER_USED } from '../../../game/store/prefabs/trainer-prefabs';

export class ProfessorKukui extends TrainerCard {
  protected _trainerType: TrainerType = TrainerType.SUPPORTER;
  public set: string = 'SUM';
  public cardImage: string = 'assets/cardback.png';
  public setNumber: string = '128';
  public name: string = 'Professor Kukui';
  public fullName: string = 'Professor Kukui SUM';
  public text: string =
    "Draw 2 cards. During this turn, your Pokémon's attacks do 20 more damage to your opponent's Active Pokémon (before applying Weakness and Resistance).";
  public readonly PROFESSOR_KUKUI_MARKER = 'PROFESSOR_KUKUI_MARKER';

  public canPlay(store: StoreLike, state: State, player: Player): boolean {
    if (player.supporterTurn > 0) {
      return false;
    }
    if (player.deck.cards.length === 0) {
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

      if (player.deck.cards.length === 0) {
        throw new GameError(GameMessage.NO_CARDS_IN_DECK);
      }

      DRAW_CARDS(store, state, player, 2);
      ADD_MARKER(this.PROFESSOR_KUKUI_MARKER, player, this);

      return state;
    }

    if (effect instanceof DealDamageEffect) {
      if (HAS_MARKER(this.PROFESSOR_KUKUI_MARKER, effect.player, this) && effect.damage > 0) {
        effect.damage += 20;
      }
      return state;
    }

    REMOVE_MARKER_AT_END_OF_TURN(effect, this.PROFESSOR_KUKUI_MARKER, this);

    return state;
  }
}
