import { GameMessage } from '../../game/game-message';
import { TrainerCard } from '../../game/store/card/trainer-card';
import { TrainerType } from '../../game/store/card/card-types';
import { StoreLike } from '../../game/store/store-like';
import { State } from '../../game/store/state/state';
import { Effect } from '../../game/store/effects/effect';
import { ChoosePokemonPrompt } from '../../game/store/prompts/choose-pokemon-prompt';
import { TrainerEffect } from '../../game/store/effects/play-card-effects';
import { PlayerType, SlotType, CoinFlipPrompt, PokemonCard } from '../../game';
import { MOVE_CARD_TO, MOVE_CARDS } from '../../game/store/prefabs/prefabs';

function* playCard(next: Function, store: StoreLike, state: State, effect: TrainerEffect): IterableIterator<State> {
  const player = effect.player;

  let coinResult: boolean = false;
  yield store.prompt(state, new CoinFlipPrompt(player.id, GameMessage.COIN_FLIP), result => {
    coinResult = result;
    next();
  });

  if (coinResult === false) {
    return state;
  }

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
      const otherCards = cardList.cards.filter(card => !(card instanceof PokemonCard)); // Ensure only non-PokemonCard types

      // Move other cards to hand
      if (otherCards.length > 0) {
        MOVE_CARDS(store, state, cardList, player.hand, { cards: otherCards });
      }

      // Move Pokémon to hand
      if (pokemons.length > 0) {
        MOVE_CARDS(store, state, cardList, player.hand, { cards: pokemons });
      }
      MOVE_CARD_TO(state, effect.trainerCard, player.discard);
    }
  });
}

export class SuperScoopUp extends TrainerCard {

  public trainerType: TrainerType = TrainerType.ITEM;

  public set: string = 'DP';

  public name: string = 'Super Scoop Up';

  public fullName: string = 'Super Scoop Up DP';

  public cardImage: string = 'assets/cardback.png';

  public setNumber: string = '115';

  public text: string =
    'Flip a coin. If heads, put 1 of your Pokemon ' +
    'and all cards attached to it into your hand.';

  public reduceEffect(store: StoreLike, state: State, effect: Effect): State {
    if (effect instanceof TrainerEffect && effect.trainerCard === this) {
      const generator = playCard(() => generator.next(), store, state, effect);
      return generator.next().value;
    }
    return state;
  }

}
