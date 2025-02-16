import { PlayerType, SlotType } from '../../game/store/actions/play-card-action';
import { GameMessage } from '../../game/game-message';
import { TrainerCard } from '../../game/store/card/trainer-card';
import { StoreLike } from '../../game/store/store-like';
import { State } from '../../game/store/state/state';
import { Effect } from '../../game/store/effects/effect';
import { TrainerEffect } from '../../game/store/effects/play-card-effects';
import { ChoosePokemonPrompt } from '../../game/store/prompts/choose-pokemon-prompt';
import { GameError, TrainerType } from '../../game';
import { MOVE_CARDS } from '../../game/store/prefabs/prefabs';

export class ProfessorTurosScenario extends TrainerCard {

  public trainerType: TrainerType = TrainerType.SUPPORTER;

  public regulationMark = 'G';

  public set: string = 'PAR';

  public cardImage: string = 'assets/cardback.png';

  public setNumber: string = '171';

  public name: string = 'Professor Turo\'s Scenario';

  public fullName: string = 'Professor Turo\'s Scenario PAR';

  public text: string =
    'Put 1 of your Pokémon into your hand. (Discard all attached cards.)';

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
        if (result.length > 0) {
          const cardList = result[0];
          const pokemons = cardList.getPokemons();

          // Move Pokemon to hand while preserving its state
          state = MOVE_CARDS(store, state, cardList, player.hand, {
            cards: pokemons,
            skipCleanup: true
          });

          // Move any remaining cards (energy/tools) to discard
          state = MOVE_CARDS(store, state, cardList, player.discard);

          // Discard supporter
          state = MOVE_CARDS(store, state, player.supporter, player.discard, {
            cards: [effect.trainerCard]
          });
        }
      });
    }

    return state;
  }

}
