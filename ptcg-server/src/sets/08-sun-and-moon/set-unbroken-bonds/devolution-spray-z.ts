import {
  CardTarget,
  ChooseCardsPrompt,
  ChoosePokemonPrompt,
  GameError,
  GameMessage,
  GameStoreMessage,
  Player,
  PlayerType,
  SlotType,
  TrainerCard,
} from '../../../game';
import { SuperType, TrainerType } from '../../../game/store/card/card-types';
import { PokemonCard } from '../../../game/store/card/pokemon-card';
import { Effect } from '../../../game/store/effects/effect';
import { DEVOLVE_POKEMON, SHUFFLE_DECK } from '../../../game/store/prefabs/prefabs';
import { WAS_TRAINER_USED } from '../../../game/store/prefabs/trainer-prefabs';
import { State } from '../../../game/store/state/state';
import { StoreLike } from '../../../game/store/store-like';

export class DevolutionSprayZ extends TrainerCard {
  protected _trainerType: TrainerType = TrainerType.ITEM;
  public set: string = 'UNB';
  public cardImage: string = 'assets/cardback.png';
  public setNumber: string = '166';
  public name: string = 'Devolution Spray Z';
  public fullName: string = 'Devolution Spray Z UB';
  public text: string =
    "Devolve 1 of your evolved Pokémon by shuffling any number of Evolution cards on it into your deck. (That Pokémon can't evolve this turn.)";

  public canPlay(store: StoreLike, state: State, player: Player): boolean {
    let canDevolve = false;
    player.forEachPokemon(PlayerType.BOTTOM_PLAYER, (list) => {
      if (list.isEvolved()) {
        canDevolve = true;
      }
    });
    return canDevolve;
  }

  public reduceEffect(store: StoreLike, state: State, effect: Effect): State {
    if (WAS_TRAINER_USED(effect, this)) {
      let canDevolve = false;
      const player = effect.player;

      const blocked: CardTarget[] = [];
      player.forEachPokemon(PlayerType.BOTTOM_PLAYER, (list, card, target) => {
        if (list.isEvolved()) {
          canDevolve = true;
        } else {
          blocked.push(target);
        }
      });

      if (!canDevolve) {
        throw new GameError(GameStoreMessage.CANNOT_PLAY_THIS_CARD);
      }

      // Choose Pokemon to Devolve
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
          if (results && results.length > 0 && results[0].getPokemons().length > 0) {
            // Choose how far to devolve
            store.prompt(
              state,
              new ChooseCardsPrompt(
                player,
                GameMessage.CHOOSE_POKEMON_TO_PICK_UP,
                results[0],
                { superType: SuperType.POKEMON },
                { min: 1, max: 1, allowCancel: false },
              ),
              (selected) => {
                if (selected && selected.length > 0) {
                  const pokemons = results[0].getPokemons();
                  const selectedPokemon = selected[0] as PokemonCard;
                  const selectedIndex = pokemons.findIndex((p) => p === selectedPokemon);

                  if (selectedIndex === 0) {
                    throw new GameError(GameMessage.INVALID_PROMPT_RESULT);
                  }

                  if (selectedIndex >= 0) {
                    // Devolve until the selected Pokemon and everything above it is shuffled into the deck
                    const devolvesNeeded = pokemons.length - selectedIndex;
                    for (let i = 0; i < devolvesNeeded; i++) {
                      DEVOLVE_POKEMON(store, state, results[0], player.deck);
                    }
                    SHUFFLE_DECK(store, state, player);
                  }
                }
                return state;
              },
            );
          }
          return state;
        },
      );
    }

    return state;
  }
}
