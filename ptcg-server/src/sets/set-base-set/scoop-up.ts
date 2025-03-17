import { Effect } from '../../game/store/effects/effect';
import { GameMessage } from '../../game/game-message';
import { TrainerEffect } from '../../game/store/effects/play-card-effects';
import { State } from '../../game/store/state/state';
import { StoreLike } from '../../game/store/store-like';
import { TrainerCard } from '../../game/store/card/trainer-card';
import { TrainerType } from '../../game/store/card/card-types';
import { ChoosePokemonPrompt } from '../../game/store/prompts/choose-pokemon-prompt';
import { PlayerType, SlotType } from '../../game/store/actions/play-card-action';
import { PokemonCard } from '../../game';
import { MOVE_CARDS, MOVE_CARD_TO } from '../../game/store/prefabs/prefabs';

export class ScoopUp extends TrainerCard {

  public trainerType: TrainerType = TrainerType.ITEM;

  public set: string = 'BS';

  public cardImage: string = 'assets/cardback.png';

  public setNumber: string = '78';

  public name: string = 'Scoop Up';

  public fullName: string = 'Scoop Up BS';

  public text: string =
    'Choose 1 of your Pokémon in play and return its Basic Pokémon card to your hand. (Discard all cards attached to that card.)';

  public reduceEffect(store: StoreLike, state: State, effect: Effect): State {
    if (effect instanceof TrainerEffect && effect.trainerCard === this) {
      const player = effect.player;

      return store.prompt(state, new ChoosePokemonPrompt(
        player.id,
        GameMessage.CHOOSE_POKEMON_TO_PICK_UP,
        PlayerType.BOTTOM_PLAYER,
        [SlotType.ACTIVE, SlotType.BENCH],
        { allowCancel: false }
      ), result => {
        const cardList = result.length > 0 ? result[0] : null;
        if (cardList !== null) {
          const pokemons = cardList.getPokemons();
          const basicPokemons = pokemons.filter(p => p.evolvesFrom === null);  // Get only Basic Pokemon
          const otherCards = cardList.cards.filter(card =>
            !(card instanceof PokemonCard) || // Non-Pokemon cards
            (card instanceof PokemonCard && card.evolvesFrom !== null) // Evolution cards
          );

          // Move other cards (including evolutions) to discard
          if (otherCards.length > 0) {
            MOVE_CARDS(store, state, cardList, player.discard, { cards: otherCards });
          }

          // Move only Basic Pokemon to hand
          if (basicPokemons.length > 0) {
            MOVE_CARDS(store, state, cardList, player.hand, { cards: basicPokemons });
          }
          MOVE_CARD_TO(state, effect.trainerCard, player.discard);
        }
      });
    }
    return state;
  }
}