import { GameError, GameMessage, Player, State, StoreLike } from '../../../game';
import { TrainerType } from '../../../game/store/card/card-types';
import { TrainerCard } from '../../../game/store/card/trainer-card';
import { Effect } from '../../../game/store/effects/effect';
import { ChooseCardsPrompt } from '../../../game/store/prompts/choose-cards-prompt';
import { MOVE_CARDS, SHUFFLE_DECK } from '../../../game/store/prefabs/prefabs';
import { WAS_TRAINER_USED } from '../../../game/store/prefabs/trainer-prefabs';

export class BattleCompressor extends TrainerCard {
  protected _trainerType: TrainerType = TrainerType.ITEM;
  public set: string = 'PHF';
  public cardImage: string = 'assets/cardback.png';
  public setNumber: string = '92';
  public name: string = 'Battle Compressor';
  public fullName: string = 'Battle Compressor PHF';
  public text: string =
    'Search your deck for up to 3 cards and discard them. Shuffle your deck afterward.';

  public canPlay(store: StoreLike, state: State, player: Player): boolean {
    return player.deck.cards.length > 0;
  }

  public reduceEffect(store: StoreLike, state: State, effect: Effect): State {
    if (WAS_TRAINER_USED(effect, this)) {
      const player = effect.player;

      if (!this.canPlay(store, state, player)) {
        throw new GameError(GameMessage.CANNOT_PLAY_THIS_CARD);
      }

      return store.prompt(
        state,
        new ChooseCardsPrompt(
          player,
          GameMessage.CHOOSE_CARD_TO_DISCARD,
          player.deck,
          {},
          { min: 0, max: 3, allowCancel: false },
        ),
        (selected) => {
          const cards = selected || [];
          MOVE_CARDS(store, state, player.deck, player.discard, { cards, sourceCard: this });
          SHUFFLE_DECK(store, state, player);
        },
      );
    }

    return state;
  }
}
