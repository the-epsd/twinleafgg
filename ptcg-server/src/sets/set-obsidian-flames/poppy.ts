import { Effect } from '../../game/store/effects/effect';
import { GameMessage } from '../../game/game-message';
import { TrainerEffect } from '../../game/store/effects/play-card-effects';
import { State } from '../../game/store/state/state';
import { StoreLike } from '../../game/store/store-like';
import { TrainerCard } from '../../game/store/card/trainer-card';
import { SuperType, TrainerType } from '../../game/store/card/card-types';
import { MoveEnergyPrompt, PlayerType, SlotType, StateUtils } from '../../game';

export class Poppy extends TrainerCard {

  public regulationMark = 'G';

  public trainerType: TrainerType = TrainerType.SUPPORTER;

  public set: string = 'OBF';

  public name: string = 'Poppy';

  public fullName: string = 'Poppy OBF';

  public text: string =
    'Move up to 2 Energy from 1 of your Pokémon to another ' +
    'of your Pokémon.';

  public reduceEffect(store: StoreLike, state: State, effect: Effect): State {
    if (effect instanceof TrainerEffect && effect.trainerCard === this) {
      const player = effect.player;
  
      return store.prompt(state, new MoveEnergyPrompt(
        effect.player.id,
        GameMessage.MOVE_ENERGY_CARDS,
        PlayerType.BOTTOM_PLAYER,
        [ SlotType.ACTIVE, SlotType.BENCH ],
        { superType: SuperType.ENERGY },
        { min: 0, max: 2, allowCancel: true }
      ), transfers => {
        if (transfers === null) {
          return;
        }
  
        for (const transfer of transfers) {
          const source = StateUtils.getTarget(state, player, transfer.from);
          const target = StateUtils.getTarget(state, player, transfer.to);
          source.moveCardTo(transfer.card, target);
        }
      });
    }
  
    return state;
  }

}
