import { GameError } from '../../game/game-error';
import { GameMessage } from '../../game/game-message';
import { StateUtils } from '../../game/store/state-utils';
import { TrainerCard } from '../../game/store/card/trainer-card';
import { CardTag, Stage, SuperType, TrainerType } from '../../game/store/card/card-types';
import { UseStadiumEffect } from '../../game/store/effects/game-effects';
import { Card, ChooseCardsPrompt, PokemonCard, PokemonCardList, ShuffleDeckPrompt } from '../../game';
import { StoreLike } from '../../game/store/store-like';
import { State } from '../../game/store/state/state';
import { Effect } from '../../game/store/effects/effect';

function* useStadium(next: Function, store: StoreLike, state: State, effect: UseStadiumEffect): IterableIterator<State> {
  const player = effect.player;

  const slots: PokemonCardList[] = player.bench.filter(b => b.cards.length === 0);

  if (player.deck.cards.length === 0) {
    throw new GameError(GameMessage.CANNOT_PLAY_THIS_CARD);
  }
  if (slots.length == 0) {
    throw new GameError(GameMessage.CANNOT_PLAY_THIS_CARD);
  } else {
    // handle no open slots

    const blocked: number[] = [];
    player.deck.cards.forEach((card, index) => {
      if (card instanceof PokemonCard && card.tags.includes(CardTag.RADIANT) || card instanceof PokemonCard && card.tags.includes(CardTag.POKEMON_EX) || card instanceof PokemonCard && card.tags.includes(CardTag.POKEMON_GX) || card.tags.includes(CardTag.POKEMON_V) || card.tags.includes(CardTag.POKEMON_VSTAR) || card.tags.includes(CardTag.POKEMON_VMAX) || card.tags.includes(CardTag.POKEMON_ex) || card.tags.includes(CardTag.PRISM_STAR)) {
        blocked.push(index);
      }
    });

    let cards: Card[] = [];
    return store.prompt(state, new ChooseCardsPrompt(
      player,
      GameMessage.CHOOSE_CARD_TO_PUT_ONTO_BENCH,
      player.deck,
      { superType: SuperType.POKEMON, stage: Stage.BASIC },
      { min: 0, max: 1, allowCancel: false, blocked }
    ), selectedCards => {
      cards = selectedCards || [];

      // Operation canceled by the user
      if (cards.length === 0) {
        return store.prompt(state, new ShuffleDeckPrompt(player.id), order => {
          player.deck.applyOrder(order);
        });
      }

      if (cards[0].tags.includes(CardTag.POKEMON_V) ||
        cards[0].tags.includes(CardTag.POKEMON_VSTAR) ||
        cards[0].tags.includes(CardTag.POKEMON_VMAX) ||
        cards[0].tags.includes(CardTag.RADIANT) ||
        (cards[0].tags.includes(CardTag.POKEMON_ex) && cards[0].regulationMark)) {
        throw new GameError(GameMessage.INVALID_TARGET);
      }

      else {
        cards.forEach((card, index) => {
          player.deck.moveCardTo(card, slots[index]);
          slots[index].pokemonPlayedTurn = state.turn;
        });
      }
      return store.prompt(state, new ShuffleDeckPrompt(player.id), order => {
        player.deck.applyOrder(order);
      });
    });
  }
}

export class Artazon extends TrainerCard {

  public regulationMark = 'G';

  public cardImage: string = 'assets/cardback.png';

  public setNumber: string = '171';

  public trainerType = TrainerType.STADIUM;

  public set = 'PAL';

  public name = 'Artazon';

  public fullName = 'Artazon PAL';

  public text = 'Once during each player\'s turn, that player may search their ' +
    'deck for a Basic Pokémon that doesn\'t have a Rule Box ' +
    'and put it onto their Bench. Then, that player shuffles their deck. ' +
    '(Pokémon ex, Pokémon V, etc. have Rule Boxes.)';

  public reduceEffect(store: StoreLike, state: State, effect: Effect): State {

    if (effect instanceof UseStadiumEffect && StateUtils.getStadiumCard(state) === this) {
      const generator = useStadium(() => generator.next(), store, state, effect);
      return generator.next().value;
    }

    return state;
  }

}
