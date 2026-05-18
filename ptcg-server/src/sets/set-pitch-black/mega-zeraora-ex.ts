import { PokemonCard } from '../../game/store/card/pokemon-card';
import { CardTag, Stage, CardType } from '../../game/store/card/card-types';
import { State, StoreLike } from '../../game';
import { Effect } from '../../game/store/effects/effect';
import { CheckProvidedEnergyEffect } from '../../game/store/effects/check-effects';
import { AFTER_ATTACK, SWITCH_ACTIVE_WITH_BENCHED, WAS_ATTACK_USED } from '../../game/store/prefabs/prefabs';

export class MegaZeraoraex extends PokemonCard {
  public stage: Stage = Stage.BASIC;
  public tags = [CardTag.POKEMON_SV_MEGA, CardTag.POKEMON_ex];
  public hp: number = 270;
  public cardType: CardType = L;
  public weakness = [{ type: F }];
  public retreat = [C];

  public attacks = [{
    name: 'Thunder Fist',
    cost: [L],
    damage: 0,
    damageCalculation: 'x',
    text: 'This attack does 60 damage times the number of [L] Energy attached to this Pokémon.',
  },
  {
    name: 'Zepto Turn',
    cost: [L, L, L],
    damage: 150,
    text: 'Switch this Pokémon with 1 of your Benched Pokémon.',
  }];

  public set: string = 'M5';
  public setNumber: string = '26';
  public regulationMark: string = 'J';
  public cardImage: string = 'assets/cardback.png';
  public name: string = 'Mega Zeraora ex';
  public fullName: string = 'Mega Zeraora ex M5';

  public reduceEffect(store: StoreLike, state: State, effect: Effect): State {
    if (WAS_ATTACK_USED(effect, 0, this)) {
      const player = effect.player;
      const check = new CheckProvidedEnergyEffect(player);
      store.reduceEffect(state, check);
      let n = 0;
      check.energyMap.forEach(em => {
        n += em.provides.filter(t =>
          t === CardType.LIGHTNING || t === CardType.ANY || t === CardType.WLFM,
        ).length;
      });
      effect.damage += 60 * n;
    }
    // Ref: prefabs SWITCH after damage (AGENTS — AfterAttackEffect)
    if (AFTER_ATTACK(effect, 1, this)) {
      SWITCH_ACTIVE_WITH_BENCHED(store, state, effect.player);
    }
    return state;
  }
}
