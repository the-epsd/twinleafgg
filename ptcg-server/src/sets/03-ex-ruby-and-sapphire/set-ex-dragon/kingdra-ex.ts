import { Card, State, StoreLike } from '../../../game';
import { CardType, Stage, SuperType } from '../../../game/store/card/card-types';
import { PokemonCard } from '../../../game/store/card/pokemon-card';
import { CheckAttackCostEffect, CheckProvidedEnergyEffect } from '../../../game/store/effects/check-effects';
import { Effect } from '../../../game/store/effects/effect';
import { AttackEffect } from '../../../game/store/effects/game-effects';
import { WAS_ATTACK_USED } from '../../../game/store/prefabs/prefabs';
import { COPY_ATTACK_FROM_POKEMON_LIST } from '../../../game/store/prefabs/copy-attack-prefabs';

export class Kingdraex extends PokemonCard {
  public stage: Stage = Stage.STAGE_2;
  public evolvesFrom = 'Seadra';
  public cardType: CardType[] = [W];
  public hp: number = 150;
  public weakness = [{ type: G }, { type: L }];
  public retreat = [C, C, C];

  public attacks = [{
    name: 'Genetic Memory',
    cost: [W],
    damage: 0,
    copycatAttack: true,
    text: 'Use any attack from Kingdra ex\'s Basic Pokémon card or Stage 1 Evolution card. (Kingdra ex doesn\'t have to pay for that attack\'s Energy cost.)'
  },
  {
    name: 'Hydrocannon',
    cost: [C, C, C],
    damage: 50,
    damageCalculation: '+',
    text: 'Does 50 damage plus 20 more damage for each [W] Energy attached to Kingdra ex but not used to pay for this attack\'s Energy cost. You can\'t add more than 40 damage in this way.'
  }];

  public set: string = 'DR';
  public cardImage: string = 'assets/cardback.png';
  public setNumber: string = '92';
  public name: string = 'Kingdra ex';
  public fullName: string = 'Kingdra ex DR';

  public reduceEffect(store: StoreLike, state: State, effect: Effect): State {

    if (WAS_ATTACK_USED(effect, 0, this)) {
      const player = effect.player;
      const evolutionCards: Card[] = [];
      for (const card of player.active.cards) {
        if (card.superType === SuperType.POKEMON && card !== this) {
          evolutionCards.push(card);
        }
      }

      if (evolutionCards.length === 0 || !evolutionCards.some(c => c.attacks && c.attacks.length > 0)) {
        return state;
      }

      return COPY_ATTACK_FROM_POKEMON_LIST(store, state, effect as AttackEffect, evolutionCards);
    }

    if (WAS_ATTACK_USED(effect, 1, this)) {
      const player = effect.player;

      const checkCost = new CheckAttackCostEffect(player, this.attacks[1]);
      state = store.reduceEffect(state, checkCost);

      const checkEnergy = new CheckProvidedEnergyEffect(player);
      state = store.reduceEffect(state, checkEnergy);

      const waterEnergy = checkEnergy.energyMap.filter(e =>
        e.provides.includes(CardType.WATER));

      const extraWaterEnergy = waterEnergy.length - checkCost.cost.length;

      effect.damage += Math.min(extraWaterEnergy, 4) * 20;
    }

    return state;
  }
}
