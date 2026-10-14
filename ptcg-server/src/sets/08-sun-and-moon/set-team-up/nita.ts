import { CardType, Stage, TrainerType } from '../../../game/store/card/card-types';
import { Effect } from '../../../game/store/effects/effect';
import { CheckProvidedEnergyEffect } from '../../../game/store/effects/check-effects';
import {
  Card,
  ChooseEnergyPrompt,
  GameError,
  GameMessage,
  Player,
  State,
  StateUtils,
  StoreLike,
  TrainerCard,
} from '../../../game';
import { TRAINER_TARGET_BLOCKED, MOVE_CARDS } from '../../../game/store/prefabs/prefabs';
import { WAS_TRAINER_USED } from '../../../game/store/prefabs/trainer-prefabs';

export class Nita extends TrainerCard {
  protected _trainerType: TrainerType = TrainerType.SUPPORTER;
  public set: string = 'TEU';
  public cardImage: string = 'assets/cardback.png';
  public setNumber: string = '151';
  public name: string = 'Nita';
  public fullName: string = 'Nita TEU';
  public text: string =
    "You can play this card only if your opponent's Active Pokémon is a Basic Pokémon. Put an Energy from your opponent's Active Pokémon on top of their deck.";

  public canPlay(store: StoreLike, state: State, player: Player): boolean {
    if (player.supporterTurn > 0) {
      return false;
    }
    const opponent = StateUtils.getOpponent(state, player);

    // Opponent's Active Pokémon must be a Basic Pokémon
    const opponentActive = opponent.active.getPokemonCard();
    if (!opponentActive || opponentActive.stage !== Stage.BASIC) {
      return false;
    }

    // Opponent's Active Pokémon must have an Energy attached
    const checkEnergy = new CheckProvidedEnergyEffect(opponent, opponent.active);
    store.reduceEffect(state, checkEnergy);
    return checkEnergy.energyMap.length > 0;
  }

  public reduceEffect(store: StoreLike, state: State, effect: Effect): State {
    if (WAS_TRAINER_USED(effect, this)) {
      const player = effect.player;
      const opponent = StateUtils.getOpponent(state, player);

      if (player.supporterTurn > 0) {
        throw new GameError(GameMessage.SUPPORTER_ALREADY_PLAYED);
      }

      // Check if opponent's active is Basic
      const opponentActive = opponent.active.getPokemonCard();
      if (!opponentActive || opponentActive.stage !== Stage.BASIC) {
        throw new GameError(GameMessage.CANNOT_PLAY_THIS_CARD);
      }

      // Check if opponent's active has energy
      const checkEnergy = new CheckProvidedEnergyEffect(opponent, opponent.active);
      state = store.reduceEffect(state, checkEnergy);

      if (checkEnergy.energyMap.length === 0) {
        throw new GameError(GameMessage.CANNOT_PLAY_THIS_CARD);
      }

      if (TRAINER_TARGET_BLOCKED(store, state, player, this, opponent.active)) {
        return state;
      }

      // Choose an energy to put on top of opponent's deck
      store.prompt(
        state,
        new ChooseEnergyPrompt(
          player.id,
          GameMessage.CHOOSE_ENERGIES_TO_DISCARD,
          checkEnergy.energyMap,
          [CardType.COLORLESS],
          { allowCancel: false },
        ),
        (energy) => {
          const cards: Card[] = (energy || []).map((e) => e.card);
          if (cards.length > 0) {
            MOVE_CARDS(store, state, opponent.active, opponent.deck, {
              cards: cards,
              sourceCard: this,
            });
            // Move cards to the top of the deck (index 0)
            cards.forEach((c) => {
              const idx = opponent.deck.cards.indexOf(c);
              if (idx > 0) {
                opponent.deck.cards.splice(idx, 1);
                opponent.deck.cards.unshift(c);
              }
            });
          }
        },
      );
    }

    return state;
  }
}
