import { TrainerType } from '../../../game/store/card/card-types';
import { Effect } from '../../../game/store/effects/effect';
import { HealEffect } from '../../../game/store/effects/game-effects';
import { ChoosePokemonPrompt } from '../../../game/store/prompts/choose-pokemon-prompt';
import { State, StoreLike, TrainerCard, GameMessage, Player, PlayerType, SlotType } from '../../../game';
import { COIN_FLIP_PROMPT } from '../../../game/store/prefabs/prefabs';
import { WAS_TRAINER_USED } from '../../../game/store/prefabs/trainer-prefabs';

export class LifeHerb extends TrainerCard {
  protected _trainerType: TrainerType = TrainerType.ITEM;
  public set: string = 'CES';
  public cardImage: string = 'assets/cardback.png';
  public setNumber: string = '136';
  public name: string = 'Life Herb';
  public fullName: string = 'Life Herb CES';
  public text: string =
    'Flip a coin. If heads, heal 60 damage and remove all Special Conditions from 1 of your Pokémon.';

  public canPlay(store: StoreLike, state: State, player: Player): boolean {
    return true;
  }

  public reduceEffect(store: StoreLike, state: State, effect: Effect): State {
    if (WAS_TRAINER_USED(effect, this)) {
      const player = effect.player;

      COIN_FLIP_PROMPT(store, state, player, (result) => {
        if (result) {
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
              const healEffect = new HealEffect(player, target, 60);
              store.reduceEffect(state, healEffect);
              target.specialConditions = [];
            },
          );
        }
      });
    }

    return state;
  }
}
