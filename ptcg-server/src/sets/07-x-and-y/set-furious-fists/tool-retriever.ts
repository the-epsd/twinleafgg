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
} from '../../../game';
import { TrainerType } from '../../../game/store/card/card-types';
import { TrainerCard } from '../../../game/store/card/trainer-card';
import { Effect } from '../../../game/store/effects/effect';
import { MOVE_CARDS } from '../../../game/store/prefabs/prefabs';
import { WAS_TRAINER_USED } from '../../../game/store/prefabs/trainer-prefabs';

export class ToolRetriever extends TrainerCard {
  protected _trainerType: TrainerType = TrainerType.ITEM;
  public set: string = 'FFI';
  public cardImage: string = 'assets/cardback.png';
  public setNumber: string = '101';
  public name: string = 'Tool Retriever';
  public fullName: string = 'Tool Retriever FFI';
  public text: string =
    'Choose up to 2 Pokémon Tool cards attached to your Pokémon and put them into your hand.';

  public canPlay(store: StoreLike, state: State, player: Player): boolean {
    let hasTool = false;
    player.forEachPokemon(PlayerType.BOTTOM_PLAYER, (cardList) => {
      if (cardList.tools.length > 0) {
        hasTool = true;
      }
    });
    return hasTool;
  }

  public reduceEffect(store: StoreLike, state: State, effect: Effect): State {
    if (WAS_TRAINER_USED(effect, this)) {
      const player = effect.player;

      let pokemonWithTool = 0;
      const blocked: CardTarget[] = [];
      player.forEachPokemon(PlayerType.BOTTOM_PLAYER, (cardList, card, target) => {
        if (cardList.tools.length > 0) {
          pokemonWithTool += 1;
        } else {
          blocked.push(target);
        }
      });

      if (pokemonWithTool === 0) {
        throw new GameError(GameMessage.CANNOT_PLAY_THIS_CARD);
      }

      return store.prompt(
        state,
        new ChoosePokemonPrompt(
          player.id,
          GameMessage.CHOOSE_POKEMON_TO_DISCARD_CARDS,
          PlayerType.BOTTOM_PLAYER,
          [SlotType.ACTIVE, SlotType.BENCH],
          { min: 1, max: Math.min(2, pokemonWithTool), allowCancel: true, blocked },
        ),
        (results) => {
          const targets = results || [];

          targets.forEach((target) => {
            if (target.tools.length > 0) {
              MOVE_CARDS(store, state, target, player.hand, {
                cards: [target.tools[0]],
                sourceCard: this,
              });
            }
          });
        },
      );
    }

    return state;
  }
}
