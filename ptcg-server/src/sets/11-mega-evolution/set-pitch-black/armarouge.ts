import { PokemonCard } from '../../../game/store/card/pokemon-card';
import { Stage, CardType } from '../../../game/store/card/card-types';
import { State, StoreLike } from '../../../game';
import { Effect } from '../../../game/store/effects/effect';
import { CheckProvidedEnergyEffect } from '../../../game/store/effects/check-effects';
import { WAS_ATTACK_USED } from '../../../game/store/prefabs/prefabs';

export class Armarouge extends PokemonCard {
  public stage: Stage = Stage.STAGE_1;
  public evolvesFrom: string = 'Charcadet';
  public cardType: CardType = R;
  public hp: number = 140;
  public weakness = [{ type: W }];
  public retreat = [C, C];

  public attacks = [{
    name: 'Flame Legion',
    cost: [R],
    damage: 40,
    damageCalculation: '+',
    text: 'This attack does 40 more damage for each Benched Pokémon that has an [R] Energy attached.',
  }];

  public set: string = 'M5';
  public setNumber: string = '11';
  public regulationMark: string = 'J';
  public cardImage: string = 'assets/cardback.png';
  public name: string = 'Armarouge';
  public fullName: string = 'Armarouge M5';

  public reduceEffect(store: StoreLike, state: State, effect: Effect): State {
    // Ref: set-chaos-rising/mega-pyroar-ex.ts (+40 benches with energy type via CheckProvidedEnergyEffect)
    if (WAS_ATTACK_USED(effect, 0, this)) {
      let benchesWithFire = 0;
      effect.player.bench.forEach(slot => {
        if (slot.cards.length === 0) {
          return;
        }
        const checkEnergy = new CheckProvidedEnergyEffect(effect.player, slot);
        store.reduceEffect(state, checkEnergy);
        const hasFireEnergy = checkEnergy.energyMap.some((em) =>
          em.provides.some(
            (t) =>
              t === CardType.FIRE ||
              t === CardType.ANY ||
              t === CardType.GRPD ||
              t === CardType.GRW,
          ),
        );
        if (hasFireEnergy) {
          benchesWithFire += 1;
        }
      });
      effect.damage += 40 * benchesWithFire;
    }
    return state;
  }
}
