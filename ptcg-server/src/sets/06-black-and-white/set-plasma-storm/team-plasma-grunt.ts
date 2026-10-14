import { TrainerCard } from '../../../game/store/card/trainer-card';
import { TrainerType, CardTag } from '../../../game/store/card/card-types';
import { StoreLike, State, GameError, GameMessage, Player, ChooseCardsPrompt } from '../../../game';
import { Effect } from '../../../game/store/effects/effect';
import { DRAW_CARDS, MOVE_CARDS } from '../../../game/store/prefabs/prefabs';
import { WAS_TRAINER_USED } from '../../../game/store/prefabs/trainer-prefabs';

export class TeamPlasmaGrunt extends TrainerCard {
  protected _trainerType: TrainerType = TrainerType.SUPPORTER;
  protected _tags = [CardTag.TEAM_PLASMA];
  public set: string = 'PLS';
  public cardImage: string = 'assets/cardback.png';
  public setNumber: string = '125';
  public name: string = 'Team Plasma Grunt';
  public fullName: string = 'Team Plasma Grunt PLS';
  public text: string =
    "Discard a Team Plasma card from your hand. (If you can't discard a Team Plasma card, you can't play this card.) Draw 4 cards.";

  public canPlay(store: StoreLike, state: State, player: Player): boolean {
    if (player.supporterTurn > 0) {
      return false;
    }
    const plasmaCards = player.hand.cards.filter(
      (c) => c !== this && c.hasTag(CardTag.TEAM_PLASMA),
    );
    return plasmaCards.length > 0;
  }

  public reduceEffect(store: StoreLike, state: State, effect: Effect): State {
    if (WAS_TRAINER_USED(effect, this)) {
      const player = effect.player;

      if (player.supporterTurn > 0) {
        throw new GameError(GameMessage.SUPPORTER_ALREADY_PLAYED);
      }

      const plasmaCards = player.hand.cards.filter(
        (c) => c !== this && c.hasTag(CardTag.TEAM_PLASMA),
      );

      if (plasmaCards.length === 0) {
        throw new GameError(GameMessage.CANNOT_PLAY_THIS_CARD);
      }

      MOVE_CARDS(store, state, player.hand, player.supporter, { cards: [effect.trainerCard], sourceCard: this });
      effect.preventDefault = true;

      const blocked: number[] = [];
      player.hand.cards.forEach((c, index) => {
        if (!c.hasTag(CardTag.TEAM_PLASMA)) {
          blocked.push(index);
        }
      });

      store.prompt(
        state,
        new ChooseCardsPrompt(
          player,
          GameMessage.CHOOSE_CARD_TO_DISCARD,
          player.hand,
          {},
          { min: 1, max: 1, allowCancel: false, blocked },
        ),
        (selected) => {
          selected = selected || [];
          if (selected.length > 0) {
            MOVE_CARDS(store, state, player.hand, player.discard, { cards: selected, sourceCard: this });
            DRAW_CARDS(store, state, player, 4);
          }
          MOVE_CARDS(store, state, player.supporter, player.discard, { cards: [this], sourceCard: this });
        },
      );
    }

    return state;
  }
}
