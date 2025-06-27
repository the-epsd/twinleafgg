import { GameError, GameMessage, PokemonCard, StateUtils } from '../../game';
import { Stage, TrainerType } from '../../game/store/card/card-types';
import { TrainerCard } from '../../game/store/card/trainer-card';
import { Effect } from '../../game/store/effects/effect';
import { TrainerEffect } from '../../game/store/effects/play-card-effects';
import { SEARCH_YOUR_DECK_FOR_POKEMON_AND_PUT_INTO_HAND, SHOW_CARDS_TO_PLAYER } from '../../game/store/prefabs/prefabs';
import { State } from '../../game/store/state/state';
import { StoreLike } from '../../game/store/store-like';

export class GoodManners extends TrainerCard {
  public trainerType: TrainerType = TrainerType.ITEM;
  public set: string = 'G1';
  public cardImage: string = 'assets/cardback.png';
  public setNumber: string = '111';
  public name: string = 'Good Manners';
  public fullName: string = 'Good Manners G1';

  public text: string =
    'In order to play this card, you can\'t have any Basic Pokémon cards in your hand. Show your hand to your opponent, then search your deck for a Basic Pokémon card, show it to your opponent, and put it into your hand. Shuffle your deck afterward.';

  public reduceEffect(store: StoreLike, state: State, effect: Effect): State {
    if (effect instanceof TrainerEffect && effect.trainerCard === this) {
      const player = effect.player;
      const opponent = StateUtils.getOpponent(state, player);

      if (player.hand.cards.some(card => card instanceof PokemonCard && card.stage === Stage.BASIC)) {
        throw new GameError(GameMessage.CANNOT_PLAY_THIS_CARD);
      }

      player.hand.moveCardTo(effect.trainerCard, player.supporter);
      effect.preventDefault = true;

      SHOW_CARDS_TO_PLAYER(store, state, opponent, player.hand.cards);
      SEARCH_YOUR_DECK_FOR_POKEMON_AND_PUT_INTO_HAND(store, state, player, { stage: Stage.BASIC }, { min: 0, max: 1 });

      player.supporter.moveCardTo(effect.trainerCard, player.discard);
      return state;
    }

    return state;
  }
}
