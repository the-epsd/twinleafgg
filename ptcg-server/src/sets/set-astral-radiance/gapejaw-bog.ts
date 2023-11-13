import { TrainerCard } from '../../game/store/card/trainer-card';
import { TrainerType } from '../../game/store/card/card-types';
import { StoreLike, State, StateUtils, GameError, GameMessage } from '../../game';
import { Effect } from '../../game/store/effects/effect';
import { AttackEffect, UseStadiumEffect } from '../../game/store/effects/game-effects';
import { PlayPokemonEffect } from '../../game/store/effects/play-card-effects';
import { PutDamageEffect } from '../../game/store/effects/attack-effects';

export class GapejawBog extends TrainerCard {

  public regulationMark = 'F';

  public set2: string = 'astralradiance';

  public setNumber: string = '142';
  
  public trainerType = TrainerType.STADIUM;

  public set = 'ASR';

  public name = 'Gapejaw Bog';

  public fullName = 'Gapejaw Bog ASR';

  public text = '';

  reduceEffect(store: StoreLike, state: State, effect: Effect): State {
    if (effect instanceof UseStadiumEffect && StateUtils.getStadiumCard(state) === this) {
      throw new GameError(GameMessage.CANNOT_USE_STADIUM);
    }

    if (effect instanceof PlayPokemonEffect) {
      const target = effect.target as unknown as AttackEffect;
      const player = effect.player;
      const opponent = StateUtils.getOpponent(state, player);
      const targetPlayer = StateUtils.findOwner(state, effect.target);

      if (player === targetPlayer) {
        const damageEffect = new PutDamageEffect(target, 20);
        damageEffect.player = player;
        store.reduceEffect(state, damageEffect);
      }

      if (opponent === targetPlayer) {
        const damageEffect = new PutDamageEffect(target, 20);
        damageEffect.player = player;
        store.reduceEffect(state, damageEffect);
      }
    }

    return state;
  }


}