import { GameError } from '../../../game/game-error';
import { GameMessage } from '../../../game/game-message';
import { TrainerCard } from '../../../game/store/card/trainer-card';
import { TrainerType, EnergyType, SuperType } from '../../../game/store/card/card-types';
import { StoreLike } from '../../../game/store/store-like';
import { State } from '../../../game/store/state/state';
import { Effect } from '../../../game/store/effects/effect';
import { ChooseCardsPrompt } from '../../../game/store/prompts/choose-cards-prompt';
import { MOVE_CARDS, SHUFFLE_DECK } from '../../../game/store/prefabs/prefabs';
import { WAS_TRAINER_USED } from '../../../game/store/prefabs/trainer-prefabs';
import { Player } from '../../../game';

export class EnergyRecycler extends TrainerCard {
  protected _trainerType: TrainerType = TrainerType.ITEM;
  public regulationMark = 'E';
  public set: string = 'BST';
  public cardImage: string = 'assets/cardback.png';
  public setNumber: string = '124';
  public name: string = 'Energy Recycler';
  public fullName: string = 'Energy Recycler BST';
  public text: string = 'Shuffle up to 5 basic Energy cards from your discard pile into your deck.';

  public canPlay(store: StoreLike, state: State, player: Player): boolean {
    let energyInDiscard = 0;
    player.discard.cards.forEach((c) => {
      const isBasicEnergy = c.superType === SuperType.ENERGY && c.energyType === EnergyType.BASIC;
      if (isBasicEnergy) {
        energyInDiscard += 1;
      }
    });

    if (energyInDiscard === 0) {
      return false;
    }
    return true;
  }

  public reduceEffect(store: StoreLike, state: State, effect: Effect): State {
    if (WAS_TRAINER_USED(effect, this)) {
      const player = effect.player;

      const energyInDiscard = player.discard.cards.filter(
        (c) => c.superType === SuperType.ENERGY && c.energyType === EnergyType.BASIC,
      ).length;

      // Player does not have correct cards in discard
      if (energyInDiscard === 0) {
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
          { superType: SuperType.ENERGY, energyType: EnergyType.BASIC },
          { min: 1, max: 5, allowCancel: false },
        ),
        (selected) => {
          const cards = selected || [];
          MOVE_CARDS(store, state, player.discard, player.deck, { cards, sourceCard: this });
          return SHUFFLE_DECK(store, state, player);
        },
      );
    }

    return state;
  }
}
