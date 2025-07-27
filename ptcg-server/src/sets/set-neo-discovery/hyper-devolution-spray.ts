import { CardTarget, ChoosePokemonPrompt, GameError, GameMessage, GameStoreMessage, PlayerType, SlotType, TrainerCard } from '../../game';
import { SuperType, TrainerType } from '../../game/store/card/card-types';
import { Effect } from '../../game/store/effects/effect';
import { TrainerEffect } from '../../game/store/effects/play-card-effects';
import { DEVOLVE_POKEMON } from '../../game/store/prefabs/prefabs';
import { State } from '../../game/store/state/state';
import { StoreLike } from '../../game/store/store-like';

export class HyperDevolutionSpray extends TrainerCard {
  public name = 'Hyper Devolution Spray';
  public cardImage: string = 'assets/cardback.png';
  public setNumber = '73';
  public set = 'N2';
  public fullName = 'Hyper Devolution Spray N2';
  public superType = SuperType.TRAINER;
  public trainerType = TrainerType.ITEM;

  public text = 'Choose 1 of your evolved Pokémon. Take the highest Stage Evolution card from that Pokémon and put it into your hand. (You can\'t evolve a Pokémon the turn you devolve it.)';

  public reduceEffect(store: StoreLike, state: State, effect: Effect): State {
    if (effect instanceof TrainerEffect && effect.trainerCard === this) {
      let canDevolve = false;
      const player = effect.player;
      const blocked: CardTarget[] = [];
      effect.player.forEachPokemon(PlayerType.BOTTOM_PLAYER, (list, card, target) => {
        if (list.getPokemons().length > 1) {
          canDevolve = true;
        } else {
          blocked.push(target);
        }
      });

      if (!canDevolve) {
        throw new GameError(GameStoreMessage.CANNOT_PLAY_THIS_CARD);
      }

      return store.prompt(
        state,
        new ChoosePokemonPrompt(
          effect.player.id,
          GameMessage.CHOOSE_POKEMON,
          PlayerType.BOTTOM_PLAYER,
          [SlotType.ACTIVE, SlotType.BENCH],
          { allowCancel: false, min: 1, max: 1, blocked }
        ),
        (results) => {
          if (results && results.length > 0) {
            DEVOLVE_POKEMON(store, state, results[0], effect.player.hand);
          }
          player.supporter.moveCardTo(effect.trainerCard, player.discard);
          return state;
        }
      );
    }

    return state;
  }
}
