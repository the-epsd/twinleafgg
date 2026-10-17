import { TrainerType } from '../../../game/store/card/card-types';
import { Effect } from '../../../game/store/effects/effect';
import { HealEffect } from '../../../game/store/effects/game-effects';
import { State, StoreLike, TrainerCard, GameMessage, Player, PlayerType, SlotType, ChoosePokemonPrompt } from '../../../game';
import { WAS_TRAINER_USED } from '../../../game/store/prefabs/trainer-prefabs';

export class PokemonCenterLady extends TrainerCard {
  protected _trainerType: TrainerType = TrainerType.SUPPORTER;
  public set: string = 'FLF';
  public cardImage: string = 'assets/cardback.png';
  public setNumber: string = '93';
  public name: string = 'Pokémon Center Lady';
  public fullName: string = 'Pokémon Center Lady FLF';
  public text: string =
    'Heal 60 damage and remove all Special Conditions from 1 of your Pokémon. You may play only 1 Supporter card during your turn (before your attack).';

  public canPlay(store: StoreLike, state: State, player: Player): boolean {
    return player.supporterTurn === 0;
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
          if (targets && targets.length > 0) {
            const target = targets[0];

            // Heal 60 damage
            const healEffect = new HealEffect(player, target, 60);
            store.reduceEffect(state, healEffect);

            // Remove all Special Conditions
            target.specialConditions = [];
          }
        },
      );
    }

    return state;
  }
}
