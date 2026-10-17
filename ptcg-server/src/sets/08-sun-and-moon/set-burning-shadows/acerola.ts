import { GameError, Player } from '../../../game';
import { GameMessage } from '../../../game/game-message';
import { CardTarget, PlayerType, SlotType } from '../../../game/store/actions/play-card-action';
import { TrainerType } from '../../../game/store/card/card-types';
import { TrainerCard } from '../../../game/store/card/trainer-card';
import { Effect } from '../../../game/store/effects/effect';
import { MOVE_POKEMON_OFF_BOARD } from '../../../game/store/prefabs/prefabs';
import { WAS_TRAINER_USED } from '../../../game/store/prefabs/trainer-prefabs';
import { ChoosePokemonPrompt } from '../../../game/store/prompts/choose-pokemon-prompt';
import { State } from '../../../game/store/state/state';
import { StoreLike } from '../../../game/store/store-like';

export class Acerola extends TrainerCard {
  protected _trainerType: TrainerType = TrainerType.SUPPORTER;
  public set: string = 'BUS';
  public cardImage: string = 'assets/cardback.png';
  public setNumber: string = '112';
  public name: string = 'Acerola';
  public fullName: string = 'Acerola BUS';
  public text: string =
    'Put 1 of your Pokémon that has any damage counters on it and all cards attached to it into your hand.';

  public canPlay(store: StoreLike, state: State, player: Player): boolean {
    if (player.supporterTurn > 0) {
      return false;
    }
    let pokemonWithDamage = 0;
    player.forEachPokemon(PlayerType.BOTTOM_PLAYER, (list) => {
      if (list.damage > 0) {
        pokemonWithDamage += 1;
      }
    });
    return pokemonWithDamage > 0;
  }

  public reduceEffect(store: StoreLike, state: State, effect: Effect): State {
    if (WAS_TRAINER_USED(effect, this)) {
      const player = effect.player;

      if (player.supporterTurn > 0) {
        throw new GameError(GameMessage.SUPPORTER_ALREADY_PLAYED);
      }

      const blocked: CardTarget[] = [];
      let pokemonWithDamage = 0;

      player.forEachPokemon(PlayerType.BOTTOM_PLAYER, (list, card, target) => {
        if (list.damage === 0) {
          blocked.push(target);
        } else {
          pokemonWithDamage += 1;
        }
      });

      if (!pokemonWithDamage) {
        throw new GameError(GameMessage.CANNOT_PLAY_THIS_CARD);
      }

      return store.prompt(
        state,
        new ChoosePokemonPrompt(
          player.id,
          GameMessage.CHOOSE_POKEMON_TO_PICK_UP,
          PlayerType.BOTTOM_PLAYER,
          [SlotType.ACTIVE, SlotType.BENCH],
          { allowCancel: false, blocked },
        ),
        (result) => {
          const cardList = result.length > 0 ? result[0] : null;
          if (cardList !== null) {
            MOVE_POKEMON_OFF_BOARD(store, state, cardList, {
              pokemonDestination: player.hand,
              sourceCard: this,
            });
          }
        },
      );
    }
    return state;
  }
}
