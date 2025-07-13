import { Effect } from '../../game/store/effects/effect';
import { GameMessage } from '../../game/game-message';
import { TrainerEffect } from '../../game/store/effects/play-card-effects';
import { State } from '../../game/store/state/state';
import { StoreLike } from '../../game/store/store-like';
import { TrainerCard } from '../../game/store/card/trainer-card';
import { TrainerType } from '../../game/store/card/card-types';
import { ChoosePokemonPrompt } from '../../game/store/prompts/choose-pokemon-prompt';
import { PlayerType, SlotType } from '../../game/store/actions/play-card-action';
import { GameError, PokemonCard } from '../../game';
import { MOVE_CARD_TO, MOVE_CARDS } from '../../game/store/prefabs/prefabs';

export class AZ extends TrainerCard {

  public trainerType: TrainerType = TrainerType.SUPPORTER;

  public set: string = 'PHF';

  public name: string = 'AZ';

  public fullName: string = 'AZ PHF';

  public cardImage: string = 'assets/cardback.png';

  public setNumber: string = '91';

  public text: string =
    'Put 1 of your Pokemon into your hand. (Discard all cards attached ' +
    'to that Pokemon.)';

  public reduceEffect(store: StoreLike, state: State, effect: Effect): State {
    if (effect instanceof TrainerEffect && effect.trainerCard === this) {
      const player = effect.player;

      if (player.supporterTurn > 0) {
        throw new GameError(GameMessage.SUPPORTER_ALREADY_PLAYED);
      }

      // Move to supporter pile
      state = MOVE_CARDS(store, state, player.hand, player.supporter, {
        cards: [effect.trainerCard]
      });
      effect.preventDefault = true;

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
          const otherCards = cardList.cards.filter(card =>
            !(card instanceof PokemonCard) &&
            (!cardList.tools || !cardList.tools.includes(card))
          );
          const tools = [...cardList.tools];

          // Move other cards to discard
          if (otherCards.length > 0) {
            MOVE_CARDS(store, state, cardList, player.discard, { cards: otherCards });
          }

          // Move tools to discard
          if (tools.length > 0) {
            for (const tool of tools) {
              cardList.moveCardTo(tool, player.discard);
            }
          }

          // Move Pokémon to hand
          if (pokemons.length > 0) {
            MOVE_CARDS(store, state, cardList, player.hand, { cards: pokemons });
          }
          MOVE_CARD_TO(state, effect.trainerCard, player.discard);
        }
      });
    }

    return state;
  }

}
