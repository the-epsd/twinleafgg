import { Effect } from '../../game/store/effects/effect';
import { GameError } from '../../game/game-error';
import { GameMessage } from '../../game/game-message';
import { TrainerEffect } from '../../game/store/effects/play-card-effects';
import { State } from '../../game/store/state/state';
import { StoreLike } from '../../game/store/store-like';
import { TrainerCard } from '../../game/store/card/trainer-card';
import { TrainerType, SuperType, CardTag } from '../../game/store/card/card-types';
import { PokemonCard } from '../../game/store/card/pokemon-card';
import { ChooseCardsPrompt } from '../../game/store/prompts/choose-cards-prompt';
import { ShuffleDeckPrompt } from '../../game';

export class SingleStrikeStyleMustard extends TrainerCard {

  public regulationMark = 'E';

  public tags = [CardTag.SINGLE_STRIKE];

  public trainerType: TrainerType = TrainerType.SUPPORTER;

  public set: string = 'BST';

  public cardImage: string = 'assets/cardback.png';

  public setNumber: string = '132';

  public name: string = 'Single Strike Style Mustard';

  public fullName: string = 'Single Strike Style Mustard BST';

  public text: string =
    'You can play this card only when it is the last card in your hand. ' +
    '' +
    'Search your deck for a Single Strike Pokémon and put it onto your Bench. Then, shuffle your deck. If you searched your deck in this way, draw 5 cards.';

  public reduceEffect(store: StoreLike, state: State, effect: Effect): State {
    if (effect instanceof TrainerEffect && effect.trainerCard === this) {
      const player = effect.player;
      const cards = player.hand.cards.filter(c => c !== this);

      const hasPokemon = player.deck.cards.some(c => {
        return c instanceof PokemonCard && c.tags.includes(CardTag.SINGLE_STRIKE);
      });

      const blocked: number[] = [];
      player.deck.cards.forEach((card, index) => {
        if (card instanceof PokemonCard && !card.tags.includes(CardTag.SINGLE_STRIKE)) {
          blocked.push(index);
        }
      });

      const slot = player.bench.find(b => b.cards.length === 0);
      const hasEffect = (hasPokemon && slot) || player.deck.cards.length > 0;

      if (cards.length !== 0 || !hasEffect) {
        throw new GameError(GameMessage.CANNOT_PLAY_THIS_CARD);
      }

      // It is not possible to recover Water Pokemon,
      // but we can still draw 5 cards
      if (!hasPokemon || slot === undefined) {
        player.deck.moveTo(player.hand, 5);
        return state;
      }

      return store.prompt(state, new ChooseCardsPrompt(
        player,
        GameMessage.CHOOSE_CARD_TO_PUT_ONTO_BENCH,
        player.deck,
        { superType: SuperType.POKEMON },
        { min: 1, max: 1, allowCancel: false, blocked: blocked }
      ), selected => {
        const cards = selected || [];
        player.deck.moveCardsTo(cards, slot);
        slot.pokemonPlayedTurn = state.turn;
        player.deck.moveTo(player.hand, 5);

        return store.prompt(state, new ShuffleDeckPrompt(player.id), order => {
          player.deck.applyOrder(order);
        });
      });
    }

    return state;
  }

}
