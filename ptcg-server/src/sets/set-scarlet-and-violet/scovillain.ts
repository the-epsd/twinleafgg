import { PokemonCard } from '../../game/store/card/pokemon-card';
import { Stage, CardType, SpecialCondition } from '../../game/store/card/card-types';
import { AttackEffect } from '../../game/store/effects/game-effects';
import { CheckProvidedEnergyEffect } from '../../game/store/effects/check-effects';
import { State } from '../../game/store/state/state';
import { StoreLike } from '../../game/store/store-like';
import { EnergyCard } from '../../game';
import { Effect } from '../../game/store/effects/effect';
import { AddSpecialConditionsEffect } from '../../game/store/effects/attack-effects';

export class Scovillain extends PokemonCard {

  public stage: Stage = Stage.STAGE_1;

  public evolvesFrom = 'Capsakid';

  public regulationMark = 'G';

  public cardType: CardType = CardType.GRASS;

  public hp: number = 110;

  public weakness = [{ type: CardType.FIRE }];

  public retreat = [CardType.COLORLESS];

  public attacks = [
    {
      name: 'Hot Bite',
      cost: [CardType.COLORLESS],
      damage: 20,
      text: 'Your opponent\'s Active Pokémon is now Burned.'
    },
    {
      name: 'Super Spicy Breath',
      cost: [CardType.GRASS, CardType.COLORLESS, CardType.COLORLESS],
      damage: 90,
      damageCalculation: '+',
      text: 'If this Pokémon has any [R] Energy attached, this attack does 90 more damage.'
    }
  ];

  public set: string = 'SVI';

  public cardImage: string = 'assets/cardback.png';

  public setNumber: string = '29';

  public name: string = 'Scovillain';

  public fullName: string = 'Scovillain SVI';


  reduceEffect(store: StoreLike, state: State, effect: Effect) {

    if (effect instanceof AttackEffect && effect.attack === this.attacks[0]) {
      const specialConditionEffect = new AddSpecialConditionsEffect(effect, [SpecialCondition.BURNED]);
      store.reduceEffect(state, specialConditionEffect);
    }

    if (effect instanceof AttackEffect && effect.attack === this.attacks[1]) {

      const player = effect.player;
      const pokemon = player.active;

      const checkEnergy = new CheckProvidedEnergyEffect(player, pokemon);
      store.reduceEffect(state, checkEnergy);

      let damage = 90;

      checkEnergy.energyMap.forEach(em => {
        const energyCard = em.card;
        if (energyCard instanceof EnergyCard &&
          (energyCard.provides.includes(CardType.FIRE) ||
            energyCard.provides.includes(CardType.ANY) ||
            energyCard.blendedEnergies?.includes(CardType.FIRE))
        ) {
          damage += 90;
        }
      });

      effect.damage = damage;

    }
    return state;
  }
}