import { TrainerCard } from '../../../game/store/card/trainer-card';
import { TrainerType } from '../../../game/store/card/card-types';
import {
  StoreLike,
  State,
  GameMessage,
  ChoosePokemonPrompt,
  PlayerType,
  SlotType,
  Player,
} from '../../../game';
import { Effect } from '../../../game/store/effects/effect';
import { WAS_TRAINER_USED } from '../../../game/store/prefabs/trainer-prefabs';
import { FLIP_UNTIL_TAILS_AND_COUNT_HEADS } from '../../../game/store/prefabs/prefabs';
import { HealEffect } from '../../../game/store/effects/game-effects';

export class SweetHoney extends TrainerCard {
  protected _trainerType: TrainerType = TrainerType.ITEM;
  public regulationMark: string = 'F';
  public set: string = 'ASR';
  public cardImage: string = 'assets/cardback.png';
  public setNumber: string = '153';
  public name: string = 'Sweet Honey';
  public fullName: string = 'Sweet Honey ASR 153';
  public text: string =
    'Choose 1 of your Pokémon, and then flip a coin until you get tails. For each heads, heal 40 damage from that Pokémon. You may play any number of Item cards during your turn.';

  public canPlay(_store: StoreLike, _state: State, _player: Player): boolean {
    return true;
  }

  public reduceEffect(store: StoreLike, state: State, effect: Effect): State {
    if (WAS_TRAINER_USED(effect, this)) {
      const player = effect.player;

      return store.prompt(
        state,
        new ChoosePokemonPrompt(
          player.id,
          GameMessage.CHOOSE_POKEMON_TO_HEAL,
          PlayerType.BOTTOM_PLAYER,
          [SlotType.ACTIVE, SlotType.BENCH],
          { min: 1, max: 1, allowCancel: false },
        ),
        (targets) => {
          const target = targets && targets.length > 0 ? targets[0] : null;
          if (!target) {
            return;
          }

          FLIP_UNTIL_TAILS_AND_COUNT_HEADS(store, state, player, (heads) => {
            if (heads > 0) {
              const healEffect = new HealEffect(player, target, heads * 40);
              store.reduceEffect(state, healEffect);
            }
          });
        },
      );
    }

    return state;
  }
}
