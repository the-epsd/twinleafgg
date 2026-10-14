import { TrainerCard } from '../../../game/store/card/trainer-card';
import { TrainerType, CardTag, SuperType } from '../../../game/store/card/card-types';
import { StoreLike, State, ChooseCardsPrompt, GameMessage, GameError, Player } from '../../../game';
import { Effect } from '../../../game/store/effects/effect';
import { MOVE_CARDS } from '../../../game/store/prefabs/prefabs';
import { WAS_TRAINER_USED } from '../../../game/store/prefabs/trainer-prefabs';

export class WelcomingLantern extends TrainerCard {
  protected _trainerType: TrainerType = TrainerType.ITEM;
  public regulationMark: string = 'E';
  public set: string = 'CRE';
  public cardImage: string = 'assets/cardback.png';
  public setNumber: string = '156';
  public name: string = 'Welcoming Lantern';
  public fullName: string = 'Welcoming Lantern CRE';
  public text: string =
    'Put a Single Strike Supporter card from your discard pile into your hand. You may play any number of Item cards during your turn.';
  protected _tags = [CardTag.SINGLE_STRIKE];

  public canPlay(store: StoreLike, state: State, player: Player): boolean {
    const blocked: number[] = [];
    player.discard.cards.forEach((card, index) => {
      if (
        !(
          card instanceof TrainerCard &&
          card.trainerType === TrainerType.SUPPORTER &&
          card.hasTag(CardTag.SINGLE_STRIKE)
        )
      ) {
        blocked.push(index);
      }
    });

    if (blocked.length === player.discard.cards.length) {
      return false;
    }
    return true;
  }

  public reduceEffect(store: StoreLike, state: State, effect: Effect): State {
    if (WAS_TRAINER_USED(effect, this)) {
      const player = effect.player;

      // Build blocked list: block all cards that are not Single Strike Supporters
      const blocked: number[] = [];
      player.discard.cards.forEach((card, index) => {
        if (
          !(
            card instanceof TrainerCard &&
            card.trainerType === TrainerType.SUPPORTER &&
            card.hasTag(CardTag.SINGLE_STRIKE)
          )
        ) {
          blocked.push(index);
        }
      });

      if (blocked.length === player.discard.cards.length) {
        throw new GameError(GameMessage.CANNOT_PLAY_THIS_CARD);
      }

      state = store.prompt(
        state,
        new ChooseCardsPrompt(
          player,
          GameMessage.CHOOSE_CARD_TO_HAND,
          player.discard,
          { superType: SuperType.TRAINER, trainerType: TrainerType.SUPPORTER },
          { min: 1, max: 1, allowCancel: false, blocked },
        ),
        (selected) => {
          if (selected && selected.length > 0) {
            MOVE_CARDS(store, state, player.discard, player.hand, {
              cards: selected,
              sourceCard: this,
            });
          }
        },
      );
    }

    return state;
  }
}
