import { TrainerType, CardType, SuperType } from '../../../game/store/card/card-types';
import { Effect } from '../../../game/store/effects/effect';
import { State, StoreLike, TrainerCard, GameError, GameMessage, Player, PokemonCard, ChooseCardsPrompt, pokemonHasCardType } from '../../../game';
import { DRAW_CARDS, MOVE_CARDS } from '../../../game/store/prefabs/prefabs';
import { WAS_TRAINER_USED } from '../../../game/store/prefabs/trainer-prefabs';

export class MaxiesHiddenBallTrick extends TrainerCard {
  protected _trainerType: TrainerType = TrainerType.SUPPORTER;
  public set: string = 'PRC';
  public cardImage: string = 'assets/cardback.png';
  public setNumber: string = '133';
  public name: string = "Maxie's Hidden Ball Trick";
  public fullName: string = "Maxie's Hidden Ball Trick PRC";
  public text: string =
    'You can play this card only when it is the last card in your hand. Put a [F] Pokemon from your discard pile onto your Bench. Then, draw 5 cards.';

  public canPlay(store: StoreLike, state: State, player: Player): boolean {
    if (player.supporterTurn > 0) {
      return false;
    }
    if (player.hand.cards.some((c) => c !== this)) {
      return false;
    }
    const hasPokemon = player.discard.cards.some(
      (c) => c instanceof PokemonCard && pokemonHasCardType(c, CardType.FIGHTING),
    );
    const hasSlot = player.bench.some((b) => b.cards.length === 0);
    return (hasPokemon && hasSlot) || player.deck.cards.length > 0;
  }

  public reduceEffect(store: StoreLike, state: State, effect: Effect): State {
    if (WAS_TRAINER_USED(effect, this)) {
      const player = effect.player;
      const cards = player.hand.cards.filter((c) => c !== this);

      const hasPokemon = player.discard.cards.some(
        (c) => c instanceof PokemonCard && pokemonHasCardType(c, CardType.FIGHTING),
      );
      const slot = player.bench.find((b) => b.cards.length === 0);
      const hasEffect = (hasPokemon && slot) || player.deck.cards.length > 0;

      if (cards.length !== 0 || !hasEffect) {
        throw new GameError(GameMessage.CANNOT_PLAY_THIS_CARD);
      }

      // It is not possible to recover a Fighting Pokemon, but we can still draw 5 cards
      if (!hasPokemon || slot === undefined) {
        DRAW_CARDS(store, state, player, 5);
        return state;
      }

      return store.prompt(
        state,
        new ChooseCardsPrompt(
          player,
          GameMessage.CHOOSE_CARD_TO_PUT_ONTO_BENCH,
          player.discard,
          { superType: SuperType.POKEMON, cardType: [CardType.FIGHTING] },
          { min: 1, max: 1, allowCancel: false },
        ),
        (selected) => {
          const cards = selected || [];
          MOVE_CARDS(store, state, player.discard, slot, { cards: cards, sourceCard: this });
          slot.pokemonPlayedTurn = state.turn;
          DRAW_CARDS(store, state, player, 5);
        },
      );
    }

    return state;
  }
}
