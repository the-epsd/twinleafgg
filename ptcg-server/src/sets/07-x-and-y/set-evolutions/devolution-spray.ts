import {
  CardTarget,
  ChoosePokemonPrompt,
  GameError,
  GameMessage,
  Player,
  PlayerType,
  SlotType,
  State,
  StoreLike,
  TrainerCard,
} from '../../../game';
import { TrainerType } from '../../../game/store/card/card-types';
import { Effect } from '../../../game/store/effects/effect';
import { DEVOLVE_POKEMON } from '../../../game/store/prefabs/prefabs';
import { WAS_TRAINER_USED } from '../../../game/store/prefabs/trainer-prefabs';

export class DevolutionSpray extends TrainerCard {
  protected _trainerType: TrainerType = TrainerType.ITEM;
  public set: string = 'EVO';
  public cardImage: string = 'assets/cardback.png';
  public setNumber: string = '76';
  public name: string = 'Devolution Spray';
  public fullName: string = 'Devolution Spray EVO';
  public text: string =
    "Devolve 1 of your evolved Pokémon and put the highest Stage Evolution card on it into your hand. (That Pokémon can't evolve this turn.)";

  public canPlay(store: StoreLike, state: State, player: Player): boolean {
    let canDevolve = false;
    player.forEachPokemon(PlayerType.BOTTOM_PLAYER, (list) => {
      if (list.getPokemons().length > 1) {
        canDevolve = true;
      }
    });
    return canDevolve;
  }

  public reduceEffect(store: StoreLike, state: State, effect: Effect): State {
    if (WAS_TRAINER_USED(effect, this)) {
      const player = effect.player;

      let canDevolve = false;
      const blocked: CardTarget[] = [];
      player.forEachPokemon(PlayerType.BOTTOM_PLAYER, (list, card, target) => {
        if (list.getPokemons().length > 1) {
          canDevolve = true;
        } else {
          blocked.push(target);
        }
      });

      if (!canDevolve) {
        throw new GameError(GameMessage.CANNOT_PLAY_THIS_CARD);
      }

      return store.prompt(
        state,
        new ChoosePokemonPrompt(
          player.id,
          GameMessage.CHOOSE_POKEMON,
          PlayerType.BOTTOM_PLAYER,
          [SlotType.ACTIVE, SlotType.BENCH],
          { allowCancel: false, min: 1, max: 1, blocked },
        ),
        (results) => {
          if (results && results.length > 0) {
            DEVOLVE_POKEMON(store, state, results[0], player.hand);
          }
        },
      );
    }

    return state;
  }
}
