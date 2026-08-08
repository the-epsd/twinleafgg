import { PokemonCard } from '../../game/store/card/pokemon-card';
import { CardTag, CardType, Stage } from '../../game/store/card/card-types';
import { State, StoreLike } from '../../game';
import { Effect } from '../../game/store/effects/effect';
import { CheckAttackCostEffect, CheckProvidedEnergyEffect } from '../../game/store/effects/check-effects';
import { COIN_FLIP_PROMPT, PREVENT_DAMAGE, THIS_POKEMON_DOES_DAMAGE_TO_ITSELF, WAS_ATTACK_USED } from '../../game/store/prefabs/prefabs';

export class DarkBlastoise extends PokemonCard {
  public tags = [CardTag.DARK];
  public stage: Stage = Stage.STAGE_2;
  public evolvesFrom: string = 'Dark Wartortle';
  public hp: number = 70;
  public cardType: CardType = W;
  public weakness = [{ type: L }];
  public retreat = [C, C];

  public attacks = [{
    name: 'Hydrocannon',
    cost: [W, W],
    damage: 30,
    damageCalculation: '+',
    text: 'Does 30 damage plus 20 more damage for each Water Energy attached to Dark Blastoise but not used to pay for this attack. You can\'t add more than 40 damage in this way.'
  }, {
    name: 'Rocket Tackle',
    cost: [W, C, C],
    damage: 40,
    text: 'Dark Blastoise does 10 damage to itself. Flip a coin. If heads, prevent all damage done to Dark Blastoise during your opponent\'s next turn. (Any other effects of attacks still happen.)'
  }];

  public set: string = 'TR';
  public cardImage: string = 'assets/cardback.png';
  public setNumber: string = '3';
  public name: string = 'Dark Blastoise';
  public fullName: string = 'Dark Blastoise TR';

  public reduceEffect(store: StoreLike, state: State, effect: Effect): State {
    // Hydrocannon
    if (WAS_ATTACK_USED(effect, 0, this)) {
      const player = effect.player;

      const checkCost = new CheckAttackCostEffect(player, this.attacks[0]);
      state = store.reduceEffect(state, checkCost);

      const checkEnergy = new CheckProvidedEnergyEffect(player);
      state = store.reduceEffect(state, checkEnergy);

      const waterEnergy = checkEnergy.energyMap.filter(e =>
        e.provides.includes(CardType.WATER));
      const extraWaterEnergy = waterEnergy.length - checkCost.cost.length;
      if (extraWaterEnergy == 1) effect.damage += 20;
      if (extraWaterEnergy >= 2) effect.damage += 40;
    }

    // Rocket Tackle
    if (WAS_ATTACK_USED(effect, 1, this)) {
      THIS_POKEMON_DOES_DAMAGE_TO_ITSELF(store, state, effect, 10);
      COIN_FLIP_PROMPT(store, state, effect.player, result => {
        if (result) {
          PREVENT_DAMAGE(store, state, effect, this);
        }
      });
    }

    return state;
  }
}
