import { TrainerCard } from '../../../game/store/card/trainer-card';
import { TrainerType, CardTag, SuperType, EnergyType } from '../../../game/store/card/card-types';
import {
  StoreLike,
  State,
  GameMessage,
  ChooseCardsPrompt,
  ConfirmPrompt,
  Player,
} from '../../../game';
import { Effect } from '../../../game/store/effects/effect';
import { MOVE_CARDS, SEARCH_DECK_FOR_CARDS_TO_HAND } from '../../../game/store/prefabs/prefabs';
import { WAS_TRAINER_USED } from '../../../game/store/prefabs/trainer-prefabs';

export class MistyAndLorelei extends TrainerCard {
  protected _trainerType: TrainerType = TrainerType.SUPPORTER;
  protected _tags = [CardTag.TAG_TEAM];
  public set: string = 'CEC';
  public cardImage: string = 'assets/cardback.png';
  public setNumber: string = '199';
  public name: string = 'Misty & Lorelei';
  public fullName: string = 'Misty & Lorelei CEC';
  public text: string =
    'Search your deck for up to 3 [W] Energy cards, reveal them, and put them into your hand. Then, shuffle your deck. When you play this card, you may discard 5 other cards from your hand. If you do, during this turn, your Water Pokémon can use their GX attacks even if you have used your GX attack. You may play only 1 Supporter card during your turn (before your attack).';

  public canPlay(store: StoreLike, state: State, player: Player): boolean {
    if (player.supporterTurn > 0) {
      return false;
    }
    return true;
  }

  public reduceEffect(store: StoreLike, state: State, effect: Effect): State {
    if (WAS_TRAINER_USED(effect, this)) {
      const player = effect.player;

      // Optional: discard 5 other cards from hand to unlock GX for Water Pokemon
      if (player.hand.cards.length >= 6 && player.usedGX) {
        // Need at least 5 other cards + this card
        const blocked: number[] = [];
        player.hand.cards.forEach((c, index) => {
          if (c === this) {
            blocked.push(index);
          }
        });

        store.prompt(
          state,
          new ConfirmPrompt(player.id, GameMessage.WANT_TO_USE_ABILITY),
          (wantToDiscard) => {
            if (wantToDiscard) {
              store.prompt(
                state,
                new ChooseCardsPrompt(
                  player,
                  GameMessage.CHOOSE_CARD_TO_DISCARD,
                  player.hand,
                  {},
                  { min: 5, max: 5, allowCancel: false, blocked },
                ),
                (selected) => {
                  const cards = selected || [];
                  MOVE_CARDS(store, state, player.hand, player.discard, {
                    cards,
                    sourceCard: this,
                  });
                  // Allow Water Pokemon to use GX attacks
                  player.usedGX = false;
                },
              );
            }
          },
        );
      }

      // Search for Water energy
      SEARCH_DECK_FOR_CARDS_TO_HAND(
        store,
        state,
        player,
        this,
        { superType: SuperType.ENERGY, energyType: EnergyType.BASIC, name: 'Water Energy' },
        { min: 0, max: 3, allowCancel: true },
      );
    }

    return state;
  }
}
