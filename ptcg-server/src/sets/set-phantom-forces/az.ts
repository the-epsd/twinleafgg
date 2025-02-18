import { Effect } from '../../game/store/effects/effect';
import { GameMessage } from '../../game/game-message';
import { TrainerEffect } from '../../game/store/effects/play-card-effects';
import { State } from '../../game/store/state/state';
import { StoreLike } from '../../game/store/store-like';
import { TrainerCard } from '../../game/store/card/trainer-card';
import { BoardEffect, TrainerType } from '../../game/store/card/card-types';
import { ChoosePokemonPrompt } from '../../game/store/prompts/choose-pokemon-prompt';
import { PlayerType, SlotType } from '../../game/store/actions/play-card-action';

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
          cardList.clearEffects();
          cardList.damage = 0;
          cardList.moveCardsTo(pokemons, player.hand);
          cardList.moveTo(player.discard);
          cardList.removeBoardEffect(BoardEffect.ABILITY_USED);
          player.supporter.moveCardTo(effect.trainerCard, player.discard);
        }
      });
    }

    return state;
  }

}
