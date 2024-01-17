import { TrainerCard } from '../../game/store/card/trainer-card';
import { CardType, TrainerType } from '../../game/store/card/card-types';
import { StoreLike, State, StateUtils, GameError, GameMessage } from '../../game';
import { Effect } from '../../game/store/effects/effect';
import { AttackEffect, UseStadiumEffect } from '../../game/store/effects/game-effects';
import { AttachEnergyEffect } from '../../game/store/effects/play-card-effects';
import { PutDamageEffect } from '../../game/store/effects/attack-effects';

export class OldCemetery extends TrainerCard {

  public regulationMark = 'E';

  public cardImage: string = 'assets/cardback.png';

  public setNumber: string = '147';
  
  public trainerType = TrainerType.STADIUM;

  public set = 'CRE';

  public name = 'Old Cemetery';

  public fullName = 'Old Cemetery CRE 147';

  public text = '';

  reduceEffect(store: StoreLike, state: State, effect: Effect): State {
    if (effect instanceof UseStadiumEffect && StateUtils.getStadiumCard(state) === this) {
      throw new GameError(GameMessage.CANNOT_USE_STADIUM);
    }

    if (effect instanceof AttachEnergyEffect && effect.target.getPokemons().some(p => p.cardType !== CardType.PSYCHIC)) {
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