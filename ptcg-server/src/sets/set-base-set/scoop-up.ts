import { Effect } from '../../game/store/effects/effect';
import { GameMessage } from '../../game/game-message';
import { TrainerEffect } from '../../game/store/effects/play-card-effects';
import { State } from '../../game/store/state/state';
import { StoreLike } from '../../game/store/store-like';
import { TrainerCard } from '../../game/store/card/trainer-card';
import { Stage, TrainerType } from '../../game/store/card/card-types';
import { ChoosePokemonPrompt } from '../../game/store/prompts/choose-pokemon-prompt';
import { PlayerType, SlotType } from '../../game/store/actions/play-card-action';
import { MOVE_CARDS, MOVE_CARD_TO } from '../../game/store/prefabs/prefabs';
import { PokemonCard } from '../../game/store/card/pokemon-card';

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
          // Get all Pokémon cards from the cardList
          const allPokemonCards = cardList.cards.filter(card => card instanceof PokemonCard) as PokemonCard[];

          // Separate basic Pokémon from evolution Pokémon
          const basicPokemonCards = allPokemonCards.filter(p => p.stage === Stage.BASIC);
          const evolutionPokemonCards = allPokemonCards.filter(p => p.stage !== Stage.BASIC);

          // Get non-Pokémon cards
          const nonPokemonCards = cardList.cards.filter(card => !(card instanceof PokemonCard));

          // First, move evolution Pokémon to discard
          if (evolutionPokemonCards.length > 0) {
            MOVE_CARDS(store, state, cardList, player.discard, { cards: evolutionPokemonCards });
          }

          // Then, move non-Pokémon cards to discard
          if (nonPokemonCards.length > 0) {
            MOVE_CARDS(store, state, cardList, player.discard, { cards: nonPokemonCards });
          }

          // Finally, move basic Pokémon to hand
          if (basicPokemonCards.length > 0) {
            MOVE_CARDS(store, state, cardList, player.hand, { cards: basicPokemonCards });
          }

          // Move the trainer card to discard
          MOVE_CARD_TO(state, effect.trainerCard, player.discard);
        }
      });
    }
    return state;
  }
}