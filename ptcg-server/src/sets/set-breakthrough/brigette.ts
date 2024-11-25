import { Card, ChooseCardsPrompt, GameError, GameMessage, PokemonCard, PokemonCardList, ShuffleDeckPrompt, State, StoreLike } from '../../game';
import { CardTag, Stage, SuperType, TrainerType } from '../../game/store/card/card-types';
import { TrainerCard } from '../../game/store/card/trainer-card';
import { Effect } from '../../game/store/effects/effect';
import { TrainerEffect } from '../../game/store/effects/play-card-effects';


export class Brigette extends TrainerCard {

  public trainerType: TrainerType = TrainerType.SUPPORTER;

  public set: string = 'BKT';

  public cardImage: string = 'assets/cardback.png';

  public setNumber: string = '134';

  public regulationMark = 'E';

  public name: string = 'Brigette';

  public fullName: string = 'Brigette BKT';

  public text: string =
    'Search your deck for 1 Basic Pokémon-EX or 3 Basic Pokémon (except for Pokémon-EX) and put them onto your Bench. Shuffle your deck afterward.';

  public reduceEffect(store: StoreLike, state: State, effect: Effect): State {
    if (effect instanceof TrainerEffect && effect.trainerCard === this) {

      const player = effect.player;

      if (player.supporterTurn > 0) {
        throw new GameError(GameMessage.SUPPORTER_ALREADY_PLAYED);
      }

      // Allow player to search deck and choose up to 2 Basic Pokemon
      const slots: PokemonCardList[] = player.bench.filter(b => b.cards.length === 0);

      if (player.deck.cards.length === 0) {
        throw new GameError(GameMessage.CANNOT_PLAY_THIS_CARD);
      } else {
        // Check if bench has open slots
        const openSlots = player.bench.filter(b => b.cards.length === 0);

        if (openSlots.length === 0) {
          // No open slots, throw error
          throw new GameError(GameMessage.CANNOT_PLAY_THIS_CARD);
        }

        const blocked: number[] = [];
        player.deck.cards.forEach((c, index) => {
          // eslint-disable-next-line no-empty
          if (c instanceof PokemonCard && c.stage === Stage.BASIC && !c.tags.includes(CardTag.POKEMON_EX)) {

          } else {
            blocked.push(index);
          }
        });

        player.hand.moveCardTo(effect.trainerCard, player.supporter);
        // We will discard this card after prompt confirmation
        effect.preventDefault = true;

        let cards: Card[] = [];

        const maxCards = Math.min(3, openSlots.length);

        return store.prompt(state, new ChooseCardsPrompt(
          player,
          GameMessage.CHOOSE_CARD_TO_PUT_ONTO_BENCH,
          player.deck,
          { superType: SuperType.POKEMON, stage: Stage.BASIC },
          { min: 0, max: maxCards, allowCancel: false }
        ), selectedCards => {
          cards = selectedCards || [];

          cards.forEach((card, index) => {
            player.deck.moveCardTo(card, slots[index]);
            slots[index].pokemonPlayedTurn = state.turn;
          });

          player.supporter.moveCardTo(this, player.discard);


          return store.prompt(state, new ShuffleDeckPrompt(player.id), order => {
            player.deck.applyOrder(order);
          });
        });
      }
    }

    return state;
  }
}