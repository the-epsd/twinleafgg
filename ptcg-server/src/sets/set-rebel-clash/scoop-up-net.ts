import { CardTarget, ChoosePokemonPrompt, GameMessage, PlayerType, PokemonCard, SlotType, TrainerCard } from '../../game';
import { CardTag, SuperType, TrainerType } from '../../game/store/card/card-types';
import { Effect } from '../../game/store/effects/effect';
import { TrainerEffect } from '../../game/store/effects/play-card-effects';
import { MOVE_CARD_TO, MOVE_CARDS } from '../../game/store/prefabs/prefabs';
import { State } from '../../game/store/state/state';
import { StoreLike } from '../../game/store/store-like';

export class ScoopUpNet extends TrainerCard {
  public name = 'Scoop Up Net';
  public cardImage: string = 'assets/cardback.png';
  public setNumber = '165';
  public set = 'RCL';
  public fullName = 'Scoop Up Net RCL';
  public superType = SuperType.TRAINER;
  public trainerType = TrainerType.ITEM;
  public text = 'Put 1 of your Pokémon that isn\'t a Pokémon V or a Pokémon-GX into your hand. (Discard all attached cards.)';

  public reduceEffect(store: StoreLike, state: State, effect: Effect): State {

    if (effect instanceof TrainerEffect && effect.trainerCard === this) {
      const player = effect.player;

      const blocked: CardTarget[] = [];
      player.forEachPokemon(PlayerType.BOTTOM_PLAYER, (cardList, card, target) => {
        if (card instanceof PokemonCard && (
          card.tags.includes(CardTag.POKEMON_GX) ||
          card.tags.includes(CardTag.POKEMON_V) ||
          card.tags.includes(CardTag.POKEMON_VSTAR) ||
          card.tags.includes(CardTag.POKEMON_VMAX)
        )) {
          blocked.push(target);
        }
      });

      MOVE_CARD_TO(state, effect.trainerCard, player.supporter);
      effect.preventDefault = true;

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
