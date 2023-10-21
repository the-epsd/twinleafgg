import { PlayerType, SlotType } from '../../game/store/actions/play-card-action';
import { GameMessage } from '../../game/game-message';
import { TrainerCard } from '../../game/store/card/trainer-card';
import { TrainerType } from '../../game/store/card/card-types';
import { StoreLike } from '../../game/store/store-like';
import { State } from '../../game/store/state/state';
import { Effect } from '../../game/store/effects/effect';
import { TrainerEffect } from '../../game/store/effects/play-card-effects';
import { ChoosePokemonPrompt } from '../../game/store/prompts/choose-pokemon-prompt';

export class ProfessorTurosScenario extends TrainerCard {

  public trainerType: TrainerType = TrainerType.SUPPORTER;

  public regulationMark = 'G';

  public set: string = 'PAR';

  public set2: string = 'futureflash';
  
  public setNumber: string = '65';

  public name: string = 'Professor Turo\'s Scenario';

  public fullName: string = 'Professor Turo\'s Scenario PAR';

  public text: string =
    'Put 1 of your Pokémon into your hand. (Discard all attached cards.)';

  public reduceEffect(store: StoreLike, state: State, effect: Effect): State {
    if (effect instanceof TrainerEffect && effect.trainerCard === this) {
      const player = effect.player;
  
      return store.prompt(state, new ChoosePokemonPrompt(
        player.id,
        GameMessage.CHOOSE_POKEMON_TO_PICK_UP,
        PlayerType.BOTTOM_PLAYER,
        [ SlotType.ACTIVE, SlotType.BENCH ],
        { allowCancel: false }
      ), result => {
        const cardList = result.length > 0 ? result[0] : null;
        if (cardList !== null) {
          const pokemons = cardList.getPokemons();
          cardList.moveCardsTo(pokemons, player.hand);
          cardList.moveTo(player.discard);
          cardList.clearEffects();
        }
      });
    }
  
    return state;
  }
  
}
  