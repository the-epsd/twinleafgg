import { PokemonCard } from '../../../game/store/card/pokemon-card';
import { Stage, CardType } from '../../../game/store/card/card-types';
import { StoreLike, State, StateUtils } from '../../../game';
import { CheckProvidedEnergyEffect } from '../../../game/store/effects/check-effects';
import { Effect } from '../../../game/store/effects/effect';
import { WAS_ATTACK_USED } from '../../../game/store/prefabs/prefabs';
import { PREVENT_DAMAGE, PREVENT_EFFECTS_OF_ATTACKS } from '../../../game/store/prefabs/effect-of-attack-prefabs';

export class Mewtwo extends PokemonCard {
  public stage: Stage = Stage.BASIC;
  public cardType: CardType = P;
  public hp: number = 130;
  public weakness = [{ type: P }];
  public retreat = [C, C];

  public attacks = [{
    name: 'Psychic',
    cost: [C, C],
    damage: 20,
    damageCalculation: '+',
    text: 'This attack does 20 more damage for each Energy attached to your opponent\'s Active Pok\u00e9mon.'
  },
  {
    name: 'Barrier',
    cost: [P, P],
    damage: 0,
    text: 'During your opponent\'s next turn, prevent all effects of attacks, including damage, done to this Pok\u00e9mon. If 1 of your Pok\u00e9mon used Barrier during your last turn, this attack can\'t be used.'
  }];

  public set: string = 'EVO';
  public setNumber: string = '51';
  public cardImage: string = 'assets/cardback.png';
  public name: string = 'Mewtwo';
  public fullName: string = 'Mewtwo EVO';

  public reduceEffect(store: StoreLike, state: State, effect: Effect): State {
    // Psychic
    if (WAS_ATTACK_USED(effect, 0, this)) {
      const opponent = StateUtils.getOpponent(state, effect.player);
      const checkProvidedEnergyEffect = new CheckProvidedEnergyEffect(opponent);
      store.reduceEffect(state, checkProvidedEnergyEffect);
      const energyCount = checkProvidedEnergyEffect.energyMap.reduce((total, p) => total + p.provides.length, 0);
      effect.damage += energyCount * 20;
    }

    // Barrier
    if (WAS_ATTACK_USED(effect, 1, this)) {
      PREVENT_DAMAGE(store, state, effect, this);
      PREVENT_EFFECTS_OF_ATTACKS(store, state, effect, this);
      effect.player.active.cannotUseAttacksNextTurnPending.push('Barrier');
    }

    return state;
  }
}
