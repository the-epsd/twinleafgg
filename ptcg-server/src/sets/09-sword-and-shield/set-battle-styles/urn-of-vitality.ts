import { TrainerCard } from '../../../game/store/card/trainer-card';
import { TrainerType, SuperType, EnergyType, CardTag } from '../../../game/store/card/card-types';
import { StoreLike } from '../../../game/store/store-like';
import { State } from '../../../game/store/state/state';
import { Effect } from '../../../game/store/effects/effect';
import { GameError } from '../../../game/game-error';
import { GameMessage } from '../../../game/game-message';
import { ChooseCardsPrompt } from '../../../game/store/prompts/choose-cards-prompt';
import { EnergyCard, Player } from '../../../game';
import { MOVE_CARDS, SHUFFLE_DECK } from '../../../game/store/prefabs/prefabs';
import { WAS_TRAINER_USED } from '../../../game/store/prefabs/trainer-prefabs';

export class UrnOfVitality extends TrainerCard {
  protected _trainerType: TrainerType = TrainerType.ITEM;
  protected _tags = [CardTag.SINGLE_STRIKE];
  public regulationMark = 'E';
  public set: string = 'BST';
  public cardImage: string = 'assets/cardback.png';
  public setNumber: string = '139';
  public name: string = 'Urn of Vitality';
  public fullName: string = 'Urn of Vitality BST';
  public text: string =
    'Shuffle up to 2 Single Strike Energy cards from your discard pile into' + 'your deck.';

  public canPlay(store: StoreLike, state: State, player: Player): boolean {
    const hasSingleStrikeEnergyInDiscard = player.discard.cards.some((c) => {
      return (
        c instanceof EnergyCard &&
        c.energyType === EnergyType.SPECIAL &&
        c.name === 'Single Strike Energy'
      );
    });

    if (!hasSingleStrikeEnergyInDiscard) {
      return false;
    }
    return true;
  }

  public reduceEffect(store: StoreLike, state: State, effect: Effect): State {
    if (WAS_TRAINER_USED(effect, this)) {
      const player = effect.player;

      const hasSingleStrikeEnergyInDiscard = player.discard.cards.some((c) => {
        return (
          c instanceof EnergyCard &&
          c.energyType === EnergyType.SPECIAL &&
          c.name === 'Single Strike Energy'
        );
      });

      if (!hasSingleStrikeEnergyInDiscard) {
        throw new GameError(GameMessage.CANNOT_PLAY_THIS_CARD);
      }

      // We will discard this card after prompt confirmation
      effect.preventDefault = true;

      return store.prompt(
        state,
        new ChooseCardsPrompt(
          player,
          GameMessage.CHOOSE_CARD_TO_DECK,
          player.discard,
          { superType: SuperType.ENERGY, energyType: EnergyType.SPECIAL, name: 'Single Strike Energy' },
          { min: 1, max: 2, allowCancel: true },
        ),
        (selected) => {
          const cards = selected || [];

          if (cards.length > 0) {
            MOVE_CARDS(store, state, player.discard, player.deck, { cards: cards, sourceCard: this });
          }

          return SHUFFLE_DECK(store, state, player);
        },
      );
    }
    return state;
  }
}
