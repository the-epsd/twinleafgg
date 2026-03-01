import { PokemonCard } from '../../game/store/card/pokemon-card';
import { Stage, CardType } from '../../game/store/card/card-types';
import { ChoosePokemonPrompt, GameMessage, PlayerType, SlotType, State, StateUtils, StoreLike } from '../../game';
import { Effect } from '../../game/store/effects/effect';
import { PutDamageEffect } from '../../game/store/effects/attack-effects';
import { CheckAttackCostEffect, CheckProvidedEnergyEffect } from '../../game/store/effects/check-effects';
import { WAS_ATTACK_USED } from '../../game/store/prefabs/prefabs';

export class Deoxys2 extends PokemonCard {
  public stage: Stage = Stage.BASIC;
  public cardType: CardType = P;
  public hp: number = 120;
  public weakness = [{ type: D }];
  public resistance = [{ type: F, value: -30 }];
  public retreat = [C, C];

  public attacks = [
    {
      name: 'Psy Spear',
      cost: [P, P, P],
      damage: 120,
      text: 'If this Pokemon has at least 2 extra Energy attached to it, this attack also does 120 damage to 1 of your opponent\'s Benched Pokemon.'
    }
  ];

  public regulationMark: string = 'J';
  public set: string = 'M4';
  public cardImage: string = 'assets/cardback.png';
  public setNumber: string = '32';
  public name: string = 'Deoxys';
  public fullName: string = 'Deoxys M4 32';

  public reduceEffect(store: StoreLike, state: State, effect: Effect): State {
    // Attack: Psy Spear
    // Ref: set-fusion-strike/heatmor.ts (extra energy + bench damage)
    if (WAS_ATTACK_USED(effect, 0, this)) {
      const player = effect.player;
      const opponent = StateUtils.getOpponent(state, player);
      const hasBenched = opponent.bench.some(b => b.cards.length > 0);

      if (hasBenched) {
        const checkCost = new CheckAttackCostEffect(player, this.attacks[0]);
        state = store.reduceEffect(state, checkCost);

        const checkEnergy = new CheckProvidedEnergyEffect(player, player.active);
        store.reduceEffect(state, checkEnergy);

        const totalEnergy = checkEnergy.energyMap.reduce((sum, em) => sum + em.provides.length, 0);
        const extraEnergy = totalEnergy - 3; // [P][P][P] cost

        if (extraEnergy >= 2) {
          return store.prompt(state, new ChoosePokemonPrompt(
            player.id,
            GameMessage.CHOOSE_POKEMON_TO_DAMAGE,
            PlayerType.TOP_PLAYER,
            [SlotType.BENCH],
            { min: 1, max: 1, allowCancel: false }
          ), selected => {
            const targets = selected || [];
            targets.forEach(target => {
              const damageEffect = new PutDamageEffect(effect, 120);
              damageEffect.target = target;
              store.reduceEffect(state, damageEffect);
            });
            return state;
          });
        }
      }
    }
    return state;
  }
}
