import { PokemonCard } from '../../../game/store/card/pokemon-card';
import { Stage, CardType, EnergyType, CardTag } from '../../../game/store/card/card-types';
import { StoreLike } from '../../../game/store/store-like';
import { GamePhase, State } from '../../../game/store/state/state';
import { Effect } from '../../../game/store/effects/effect';
import { PowerType } from '../../../game/store/card/pokemon-types';
import { StateUtils } from '../../../game/store/state-utils';
import { CheckProvidedEnergyEffect } from '../../../game/store/effects/check-effects';
import { EnergyCard } from '../../../game';
import { PutDamageEffect } from '../../../game/store/effects/attack-effects';
import { IS_POKEBODY_BLOCKED, WAS_ATTACK_USED } from '../../../game/store/prefabs/prefabs';

export class Scizor extends PokemonCard {
  public stage: Stage = Stage.STAGE_1;
  public tags = [CardTag.PRIME];
  public evolvesFrom = 'Scyther';
  public cardType: CardType = M;
  public hp: number = 100;
  public weakness = [{ type: R }];
  public resistance = [{ type: P, value: -20 }];
  public retreat = [C, C];

  public powers = [{
    name: 'Skyscraper',
    powerType: PowerType.POKEBODY,
    text: 'Prevent all damage done to Scizor by attacks from your opponent\'s Pokémon that have any Special Energy cards attached to them.'
  }];

  public attacks = [{
    name: 'Metal Scizors',
    cost: [M, C],
    damage: 30,
    damageCalculation: '+',
    text: 'Does 30 damage plus 20 more damage for each [M] Energy attached to Scizor.'
  }];

  public set: string = 'UD';
  public cardImage: string = 'assets/cardback.png';
  public setNumber: string = '84';
  public name: string = 'Scizor';
  public fullName: string = 'Scizor UD';

  public reduceEffect(store: StoreLike, state: State, effect: Effect): State {

    if (WAS_ATTACK_USED(effect, 0, this)) {
      const player = effect.player;

      const checkProvidedEnergyEffect = new CheckProvidedEnergyEffect(player);
      store.reduceEffect(state, checkProvidedEnergyEffect);

      let energyCount = 0;
      checkProvidedEnergyEffect.energyMap.forEach(em => {
        energyCount += em.provides.filter(cardType => {
          return cardType === CardType.METAL || cardType === CardType.ANY;
        }).length;
      });
      effect.damage += energyCount * 20;
    }

    if (effect instanceof PutDamageEffect && effect.target.cards.includes(this) && state.phase === GamePhase.ATTACK) {
      const player = StateUtils.findOwner(state, effect.target);

      if (IS_POKEBODY_BLOCKED(store, state, player, this)) {
        return state;
      }

      const hasSpecialEnergy = effect.source.cards.some(c =>
        c instanceof EnergyCard && c.energyType === EnergyType.SPECIAL
      );

      if (hasSpecialEnergy) {
        effect.preventDefault = true;
      }
    }
    return state;
  }

}
