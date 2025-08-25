import { Effect } from '../../game/store/effects/effect';
import { TrainerCard } from '../../game/store/card/trainer-card';
import { TrainerType } from '../../game/store/card/card-types';
import { StoreLike } from '../../game/store/store-like';
import { State } from '../../game/store/state/state';
import { TrainerEffect } from '../../game/store/effects/play-card-effects';
import { Card, ChoosePokemonPrompt, GameError, GameMessage, PlayerType, SlotType, StateUtils } from '../../game';
import { PokemonCard } from '../../game/store/card/pokemon-card';
import { CLEAN_UP_SUPPORTER, DRAW_CARDS } from '../../game/store/prefabs/prefabs';

//Avery is not done yet!! have to add the "remove from bench" logic

export class Avery extends TrainerCard {

  public trainerType: TrainerType = TrainerType.SUPPORTER;

  public set: string = 'CRE';

  public cardImage: string = 'assets/cardback.png';

  public setNumber: string = '130';

  public regulationMark = 'E';

  public name: string = 'Avery';

  public fullName: string = 'Avery CRE';

  public text: string =
    'Draw 3 cards. If you drew any cards in this way, your opponent discards Pokémon from their Bench until they have 3.';


  public reduceEffect(store: StoreLike, state: State, effect: Effect): State {
    if (effect instanceof TrainerEffect && effect.trainerCard === this) {

      const player = effect.player;

      const supporterTurn = player.supporterTurn;

      if (supporterTurn > 0) {
        throw new GameError(GameMessage.SUPPORTER_ALREADY_PLAYED);
      }

      player.hand.moveCardTo(effect.trainerCard, player.supporter);
      // We will discard this card after prompt confirmation
      effect.preventDefault = true;

      // Draw 3 cards
      DRAW_CARDS(player, 3);

      // Get opponent
      const opponent = StateUtils.getOpponent(state, player);
      const opponentBenched = opponent.bench.reduce((left, b) => left + (b.cards.length ? 1 : 0), 0);

      // Discard pokemon from opponent's bench until they have 3
      while (opponentBenched > 3) {
        const benchDifference = opponentBenched - 3;
        return store.prompt(state, new ChoosePokemonPrompt(
          opponent.id,
          GameMessage.CHOOSE_CARD_TO_DISCARD,
          PlayerType.BOTTOM_PLAYER,
          [SlotType.BENCH],
          {
            allowCancel: false,
            min: benchDifference,
            max: benchDifference
          }
        ), (selected: any[]): State => {
          selected.forEach((cardList: any) => {
            // Separate pokemons, other cards, and tools
            const pokemons = cardList.getPokemons();
            const otherCards = cardList.cards.filter((card: Card) =>
              !(card instanceof PokemonCard) &&
              (!cardList.tools || !cardList.tools.includes(card))
            );
            const tools = [...cardList.tools];

            // Move other cards to discard
            if (otherCards.length > 0) {
              cardList.moveCardsTo(otherCards, opponent.discard);
            }

            // Move tools to discard
            if (tools.length > 0) {
              for (const tool of tools) {
                cardList.moveCardTo(tool, opponent.discard);
              }
            }

            // Move Pokémon to discard
            if (pokemons.length > 0) {
              cardList.moveCardsTo(pokemons, opponent.discard);
            }
          });
          CLEAN_UP_SUPPORTER(effect, player);
          return state;
        });
      }

      player.supporter.moveCardTo(effect.trainerCard, player.discard);

      return state;
    }
    return state;
  }
}

