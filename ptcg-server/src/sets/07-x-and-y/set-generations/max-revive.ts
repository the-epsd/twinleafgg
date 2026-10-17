import { SuperType, TrainerType } from '../../../game/store/card/card-types';
import { Effect } from '../../../game/store/effects/effect';
import { State, StoreLike, TrainerCard, GameError, GameMessage, Player, StateUtils, ChooseCardsPrompt, PokemonCard } from '../../../game';
import { MOVE_CARDS, SHOW_CARDS_TO_PLAYER } from '../../../game/store/prefabs/prefabs';
import { WAS_TRAINER_USED } from '../../../game/store/prefabs/trainer-prefabs';

export class MaxRevive extends TrainerCard {
  protected _trainerType: TrainerType = TrainerType.ITEM;
  public set: string = 'GEN';
  public cardImage: string = 'assets/cardback.png';
  public setNumber: string = '65';
  public name: string = 'Max Revive';
  public fullName: string = 'Max Revive GEN';
  public text: string = 'Put a Pokémon from your discard pile on top of your deck.';

  public canPlay(store: StoreLike, state: State, player: Player): boolean {
    if (!player.discard.cards.some((c) => c instanceof PokemonCard)) {
      return false;
    }
    return true;
  }

  public reduceEffect(store: StoreLike, state: State, effect: Effect): State {
    if (WAS_TRAINER_USED(effect, this)) {
      const player = effect.player;
      const opponent = StateUtils.getOpponent(state, player);

      if (!this.canPlay(store, state, player)) {
        throw new GameError(GameMessage.CANNOT_PLAY_THIS_CARD);
      }

      MOVE_CARDS(store, state, player.hand, player.supporter, {
        cards: [effect.trainerCard],
        sourceCard: this,
      });

      return store.prompt(
        state,
        new ChooseCardsPrompt(
          player,
          GameMessage.CHOOSE_CARDS_TO_PUT_ON_TOP_OF_THE_DECK,
          player.discard,
          { superType: SuperType.POKEMON },
          { min: 1, max: 1, allowCancel: false },
        ),
        (selected) => {
          const cards = selected || [];
          if (cards.length === 0) {
            return;
          }

          MOVE_CARDS(store, state, player.discard, player.deck, {
            cards,
            toTop: true,
            sourceCard: this,
          });
          SHOW_CARDS_TO_PLAYER(store, state, opponent, cards);
        },
      );
    }

    return state;
  }
}
