import { PokemonCard } from '../../game/store/card/pokemon-card';
import { Stage, CardType } from '../../game/store/card/card-types';
import { State } from '../../game/store/state/state';

import { StoreLike } from '../../game/store/store-like';
import { Effect } from '../../game/store/effects/effect';
import { DealDamageEffect } from '../../game/store/effects/attack-effects';
import { PlayerType } from '../../game';
import { WAS_ATTACK_USED } from '../../game/store/prefabs/prefabs';

export class PaldeanTauros extends PokemonCard {
  public stage: Stage = Stage.BASIC;
  public cardType: CardType = F;
  public hp: number = 130;
  public weakness = [{ type: P }];
  public resistance = [];
  public retreat = [C, C];

  public attacks = [{
    name: 'Raging Charge',
    cost: [F],
    damage: 0,
    text: 'This attack does 40 damage for each damage counter on all of your Pokemon with "Tauros" in their name in play.',
  },
  {
    name: 'Double Edge',
    cost: [F, F],
    damage: 70,
    text: 'This Pokemon does 20 damage to itself.',
  }];

  public regulationMark = 'I';
  public set: string = 'PFL';
  public cardImage: string = 'assets/cardback.png';
  public setNumber: string = '48';
  public name: string = 'Paldean Tauros';
  public fullName: string = 'Paldean Tauros M2';

  public reduceEffect(store: StoreLike, state: State, effect: Effect): State {
    if (WAS_ATTACK_USED(effect, 0, this)) {
      const player = effect.player;
      let totalDamage = 0;

      // Count damage counters on all Pokemon with "Tauros" in their name
      player.forEachPokemon(PlayerType.BOTTOM_PLAYER, (cardList, card) => {
        if (card && card.name.includes('Tauros')) {
          totalDamage += cardList.damage;
        }
      });

      // Set damage to 40x the total damage counters
      effect.damage = totalDamage * 40;
    }

    if (WAS_ATTACK_USED(effect, 1, this)) {
      const player = effect.player;

      // Deal 20 damage to this Pokemon
      const damageEffect = new DealDamageEffect(effect, 20);
      damageEffect.target = player.active;
      return store.reduceEffect(state, damageEffect);
    }

    return state;
  }
}
