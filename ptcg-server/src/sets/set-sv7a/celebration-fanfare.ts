import { HealEffect } from '../../game/store/effects/game-effects';
import { TrainerCard } from '../../game/store/card/trainer-card';
import { TrainerType } from '../../game/store/card/card-types';
import { UseStadiumEffect } from '../../game/store/effects/game-effects';
import { StoreLike } from '../../game/store/store-like';
import { State } from '../../game/store/state/state';
import { PlayerType } from '../../game/store/actions/play-card-action';
import { EndTurnEffect } from '../../game/store/effects/game-phase-effects';

export class CelebrationFanfare extends TrainerCard {

  public trainerType = TrainerType.STADIUM;

  public set = 'SVP';

  public regulationMark = 'H';

  public cardImage: string = 'assets/cardback.png';

  public setNumber: string = '174';

  public name = 'Celebration Fanfare';

  public fullName = 'Celebration Fanfare SVP';

  public text = 'Once during each player\'s turn, that player may heal 10 damage from each of their Pokémon.If they do, that player\'s turn ends.';

  useStadium(store: StoreLike, state: State, effect: UseStadiumEffect): State {

    const player = effect.player;

    player.forEachPokemon(PlayerType.BOTTOM_PLAYER, (cardList) => {
      const healEffect = new HealEffect(player, cardList, 10);
      state = store.reduceEffect(state, healEffect);
      const endTurnEffect = new EndTurnEffect(player);
      store.reduceEffect(state, endTurnEffect);
      return state;
    });

    return state;
  }
}
