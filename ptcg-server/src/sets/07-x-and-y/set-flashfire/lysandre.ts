import { Stage, TrainerType } from '../../../game/store/card/card-types';
import { Effect } from '../../../game/store/effects/effect';
import { SupporterEffect } from '../../../game/store/effects/play-card-effects';
import { State, StoreLike, TrainerCard, GameError, GameMessage, Player, StateUtils } from '../../../game';
import { MOVE_CARDS, SWITCH_IN_OPPONENT_BENCHED_POKEMON } from '../../../game/store/prefabs/prefabs';
import { WAS_TRAINER_USED } from '../../../game/store/prefabs/trainer-prefabs';

export class Lysandre extends TrainerCard {
  protected _trainerType: TrainerType = TrainerType.SUPPORTER;
  public set: string = 'FLF';
  public cardImage: string = 'assets/cardback.png';
  public setNumber: string = '90';
  public name: string = 'Lysandre';
  public fullName: string = 'Lysandre FLF';
  public text: string = "Switch 1 of your opponent's Benched Pokemon with his or her Active Pokemon.";

  public canPlay(store: StoreLike, state: State, player: Player): boolean {
    if (player.supporterTurn > 0) {
      return false;
    }
    const opponent = StateUtils.getOpponent(state, player);
    return opponent.bench.some((b) => b.cards.length > 0);
  }

  public reduceEffect(store: StoreLike, state: State, effect: Effect): State {
    if (WAS_TRAINER_USED(effect, this)) {
      const player = effect.player;
      const opponent = StateUtils.getOpponent(state, player);
      const hasBench = opponent.bench.some((b) => b.cards.length > 0);

      if (!hasBench) {
        throw new GameError(GameMessage.CANNOT_PLAY_THIS_CARD);
      }

      if (player.supporterTurn > 0) {
        throw new GameError(GameMessage.SUPPORTER_ALREADY_PLAYED);
      }

      effect.preventDefault = true;
      MOVE_CARDS(store, state, player.hand, player.supporter, {
        cards: [effect.trainerCard],
        sourceCard: this,
      });

      try {
        const supporterEffect = new SupporterEffect(player, effect.trainerCard);
        store.reduceEffect(state, supporterEffect);
      } catch {
        return state;
      }

      return SWITCH_IN_OPPONENT_BENCHED_POKEMON(store, state, player, {
        allowCancel: false,
        onSwitched: (cardList) => {
          if (cardList.isStage(Stage.BASIC)) {
            try {
              const supporterEffect = new SupporterEffect(player, effect.trainerCard);
              store.reduceEffect(state, supporterEffect);
            } catch {
              return;
            }
          }
        },
      });
    }

    return state;
  }
}
