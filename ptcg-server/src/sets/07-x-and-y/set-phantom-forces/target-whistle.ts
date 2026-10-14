import { GameError, GameMessage, Player, State, StateUtils, StoreLike } from '../../../game';
import { PokemonCard } from '../../../game/store/card/pokemon-card';
import { Stage, SuperType, TrainerType } from '../../../game/store/card/card-types';
import { TrainerCard } from '../../../game/store/card/trainer-card';
import { Effect } from '../../../game/store/effects/effect';
import { ChooseCardsPrompt } from '../../../game/store/prompts/choose-cards-prompt';
import { MOVE_CARDS } from '../../../game/store/prefabs/prefabs';
import { WAS_TRAINER_USED } from '../../../game/store/prefabs/trainer-prefabs';

export class TargetWhistle extends TrainerCard {
  protected _trainerType: TrainerType = TrainerType.ITEM;
  public set: string = 'PHF';
  public cardImage: string = 'assets/cardback.png';
  public setNumber: string = '106';
  public name: string = 'Target Whistle';
  public fullName: string = 'Target Whistle PHF';
  public text: string =
    "Put a Basic Pokémon from your opponent's discard pile onto his or her Bench.";

  public canPlay(store: StoreLike, state: State, player: Player): boolean {
    const opponent = StateUtils.getOpponent(state, player);

    if (opponent.bench.every((b) => b.cards.length > 0)) {
      return false;
    }

    return opponent.discard.cards.some(
      (c) => c instanceof PokemonCard && c.stage === Stage.BASIC,
    );
  }

  public reduceEffect(store: StoreLike, state: State, effect: Effect): State {
    if (WAS_TRAINER_USED(effect, this)) {
      const player = effect.player;
      const opponent = StateUtils.getOpponent(state, player);

      if (!this.canPlay(store, state, player)) {
        throw new GameError(GameMessage.CANNOT_PLAY_THIS_CARD);
      }

      const slot = opponent.bench.find((b) => b.cards.length === 0);
      if (slot === undefined) {
        throw new GameError(GameMessage.CANNOT_PLAY_THIS_CARD);
      }

      return store.prompt(
        state,
        new ChooseCardsPrompt(
          player,
          GameMessage.CHOOSE_CARD_TO_PUT_ONTO_BENCH,
          opponent.discard,
          { superType: SuperType.POKEMON, stage: Stage.BASIC },
          { min: 1, max: 1, allowCancel: false },
        ),
        (selected) => {
          const cards = selected || [];
          if (cards.length === 0) {
            return;
          }

          MOVE_CARDS(store, state, opponent.discard, slot, { cards, sourceCard: this });
          slot.pokemonPlayedTurn = state.turn;
        },
      );
    }

    return state;
  }
}
