import { PlayerType, SlotType } from '../../game/store/actions/play-card-action';
import { GameMessage } from '../../game/game-message';
import { TrainerCard } from '../../game/store/card/trainer-card';
import { BoardEffect, TrainerType } from '../../game/store/card/card-types';
import { StoreLike } from '../../game/store/store-like';
import { State } from '../../game/store/state/state';
import { Effect } from '../../game/store/effects/effect';
import { TrainerEffect } from '../../game/store/effects/play-card-effects';
import { ChoosePokemonPrompt } from '../../game/store/prompts/choose-pokemon-prompt';
import { GameError } from '../../game';
import { SHUFFLE_DECK } from '../../game/store/prefabs/prefabs';
export class Cassius extends TrainerCard {

  public trainerType: TrainerType = TrainerType.SUPPORTER;

  public set: string = 'XY';

  public cardImage: string = 'assets/cardback.png';

  public setNumber: string = '115';

  public name: string = 'Cassius';

  public fullName: string = 'Cassius XY';

  public text: string =
    'Shuffle 1 of your Pokémon and all cards attached to it into your deck.';

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

      return store.prompt(state, new ChoosePokemonPrompt(
        player.id,
        GameMessage.CHOOSE_POKEMON_TO_SHUFFLE,
        PlayerType.BOTTOM_PLAYER,
        [SlotType.ACTIVE, SlotType.BENCH],
        { allowCancel: false }
      ), result => {
        const cardList = result.length > 0 ? result[0] : null;
        if (cardList !== null) {
          player.removePokemonEffects(cardList);
          cardList.clearEffects();
          cardList.damage = 0;
          cardList.removeBoardEffect(BoardEffect.ABILITY_USED);

          cardList.moveCardsTo(cardList.getPokemons(), player.deck);
          cardList.moveTo(player.deck);
          SHUFFLE_DECK(store, state, player);

          player.supporter.moveCardTo(effect.trainerCard, player.discard);
        }
      });
    }

    return state;
  }

}
