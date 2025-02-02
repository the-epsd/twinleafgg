import { CoinFlipPrompt, GameMessage, State, StoreLike } from '../../game';
import { CardType, EnergyType, SpecialCondition, Stage } from '../../game/store/card/card-types';
import { PokemonCard } from '../../game/store/card/pokemon-card';
import { AddSpecialConditionsEffect } from '../../game/store/effects/attack-effects';
import { CheckProvidedEnergyEffect } from '../../game/store/effects/check-effects';
import { Effect } from '../../game/store/effects/effect';
import { AttackEffect } from '../../game/store/effects/game-effects';


export class Electivire extends PokemonCard {

  public stage: Stage = Stage.STAGE_1;

  public evolvesFrom = 'Electabuzz';

  public cardType: CardType = L;

  public hp: number = 140;

  public weakness = [{ type: F }];

  public retreat = [C, C, C];

  public attacks = [
    {
      name: 'Thunder Shock',
      cost: [L, C],
      damage: 50,
      text: 'Flip a coin. If heads, your opponent\'s Active Pokémon is now Paralyzed.'
    },
    {
      name: 'Electrified Bolt',
      cost: [L, L, C],
      damage: 90,
      damageCalculation: '+',
      text: 'If this Pokémon has any Special Energy attached, this attack does 90 more damage.'
    }
  ];

  public set: string = 'RCL';

  public regulationMark = 'D';

  public cardImage: string = 'assets/cardback.png';

  public setNumber: string = '59';

  public name: string = 'Electivire';

  public fullName: string = 'Electivire RCL';

  public reduceEffect(store: StoreLike, state: State, effect: Effect): State {

    if (effect instanceof AttackEffect && effect.attack === this.attacks[0]) {
      const player = effect.player;

      return store.prompt(state, [
        new CoinFlipPrompt(player.id, GameMessage.COIN_FLIP)
      ], result => {
        if (result === true) {
          const specialConditionEffect = new AddSpecialConditionsEffect(effect, [SpecialCondition.PARALYZED]);
          store.reduceEffect(state, specialConditionEffect);
        }
      });
    }

    if (effect instanceof AttackEffect && effect.attack === this.attacks[1]) {
      const player = effect.player;

      const checkProvidedEnergyEffect = new CheckProvidedEnergyEffect(player, player.active);
      store.reduceEffect(state, checkProvidedEnergyEffect);

      let hasSpecialEnergy = false;
      checkProvidedEnergyEffect.energyMap.forEach(energy => {
        if (energy.card.energyType === EnergyType.SPECIAL) {
          hasSpecialEnergy = true;
        }
      });

      if (hasSpecialEnergy) {
        effect.damage += 90;
      }
    }

    return state;
  }
}
