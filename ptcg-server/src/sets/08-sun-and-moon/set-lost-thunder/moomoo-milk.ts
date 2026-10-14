import { TrainerType } from '../../../game/store/card/card-types';
import {
  StoreLike,
  State,
  GameMessage,
  PlayerType,
  SlotType,
  TrainerCard,
  Player,
  ChoosePokemonPrompt,
} from '../../../game';
import { Effect } from '../../../game/store/effects/effect';
import { HealEffect } from '../../../game/store/effects/game-effects';
import { WAS_TRAINER_USED } from '../../../game/store/prefabs/trainer-prefabs';
import { MULTIPLE_COIN_FLIPS_PROMPT } from '../../../game/store/prefabs/prefabs';

export class MoomooMilk extends TrainerCard {
  protected _trainerType: TrainerType = TrainerType.ITEM;
  public set: string = 'LOT';
  public cardImage: string = 'assets/cardback.png';
  public setNumber: string = '185';
  public name: string = 'Moomoo Milk';
  public fullName: string = 'Moomoo Milk LOT';
  public text: string =
    'Choose 1 of your Pokémon, and then flip 2 coins. For each heads, heal 30 damage from that Pokémon.';

  public canPlay(store: StoreLike, state: State, player: Player): boolean {
    return true;
  }

  public reduceEffect(store: StoreLike, state: State, effect: Effect): State {
    if (WAS_TRAINER_USED(effect, this)) {
      const player = effect.player;

      store.prompt(
        state,
        new ChoosePokemonPrompt(
          player.id,
          GameMessage.CHOOSE_POKEMON_TO_HEAL,
          PlayerType.BOTTOM_PLAYER,
          [SlotType.ACTIVE, SlotType.BENCH],
          { min: 1, max: 1, allowCancel: false },
        ),
        (targets) => {
          if (!targets || targets.length === 0) {
            return;
          }
          const target = targets[0];

          MULTIPLE_COIN_FLIPS_PROMPT(store, state, player, 2, (results) => {
            const heads = results.filter((r) => r).length;
            if (heads > 0) {
              const healEffect = new HealEffect(player, target, 30 * heads);
              store.reduceEffect(state, healEffect);
            }
          });
        },
      );
    }

    return state;
  }
}
