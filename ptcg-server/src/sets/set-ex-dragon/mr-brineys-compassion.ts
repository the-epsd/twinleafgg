import { StoreLike, State, CardTarget, ChoosePokemonPrompt, GameError, GameMessage, PlayerType, SlotType, PokemonCard } from '../../game';
import { CardTag, TrainerType } from '../../game/store/card/card-types';
import { TrainerCard } from '../../game/store/card/trainer-card';
import { Effect } from '../../game/store/effects/effect';
import { TrainerEffect } from '../../game/store/effects/play-card-effects';
import { MOVE_CARD_TO, MOVE_CARDS } from '../../game/store/prefabs/prefabs';

export class MrBrineysCompassion extends TrainerCard {
  public trainerType: TrainerType = TrainerType.SUPPORTER;
  public set: string = 'DR';
  public cardImage: string = 'assets/cardback.png';
  public setNumber: string = '87';
  public name: string = 'Mr. Briney\'s Compassion';
  public fullName: string = 'Mr. Briney\'s Compassion DR';
  public text = 'Choose 1 of your Pokémon in play (excluding Pokémon-ex). Return that Pokémon and all cards attached to it to your hand.';

  public reduceEffect(store: StoreLike, state: State, effect: Effect): State {

    if (effect instanceof TrainerEffect && effect.trainerCard === this) {
      const player = effect.player;

      const supporterTurn = player.supporterTurn;

      if (supporterTurn > 0) {
        throw new GameError(GameMessage.SUPPORTER_ALREADY_PLAYED);
      }

      player.hand.moveCardTo(effect.trainerCard, player.supporter);

      let hasNonexPokemon: boolean = false;
      const blocked: CardTarget[] = [];

      player.forEachPokemon(PlayerType.BOTTOM_PLAYER, (list, card, target) => {
        if (!card.tags.includes(CardTag.POKEMON_ex)) {
          hasNonexPokemon = true;
          return;
        }
        if (card.tags.includes(CardTag.POKEMON_ex)) {
          blocked.push(target);
        }
      });

      if (!hasNonexPokemon) {
        throw new GameError(GameMessage.CANNOT_PLAY_THIS_CARD);
      }

      return store.prompt(state, new ChoosePokemonPrompt(
        player.id,
        GameMessage.CHOOSE_POKEMON_TO_PICK_UP,
        PlayerType.BOTTOM_PLAYER,
        [SlotType.ACTIVE, SlotType.BENCH],
        { allowCancel: false, blocked }
      ), result => {
        const cardList = result.length > 0 ? result[0] : null;
        if (cardList !== null) {
          const pokemons = cardList.getPokemons();
          const otherCards = cardList.cards.filter(card =>
            !(card instanceof PokemonCard) &&
            (!cardList.tools || !cardList.tools.includes(card))
          );
          const tools = [...cardList.tools];

          // Move other cards to hand
          if (otherCards.length > 0) {
            MOVE_CARDS(store, state, cardList, player.hand, { cards: otherCards });
          }

          // Move tools to hand explicitly
          for (const tool of tools) {
            cardList.moveCardTo(tool, player.hand);
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