import { PokemonCard, Stage, CardType, SpecialCondition, State, StoreLike } from '../../game';
import { CheckProvidedEnergyEffect } from '../../game/store/effects/check-effects';
import { Effect } from '../../game/store/effects/effect';
import { AttackEffect } from '../../game/store/effects/game-effects';

export class HisuianArcanine extends PokemonCard {

  public stage: Stage = Stage.STAGE_1;

  public cardType = CardType.FIGHTING;

  public hp = 150;

  public evolvesFrom = 'Hisuian Growlithe';

  public weakness = [{ type: CardType.GRASS }];

  public retreat = [CardType.COLORLESS, CardType.COLORLESS];

  public attacks = [
    {
      name: 'Boulder Crush',
      cost: [CardType.FIGHTING, CardType.COLORLESS],
      damage: 50,
      text: ''
    },
    {
      name: 'Scorching Horn',
      cost: [CardType.FIGHTING, CardType.FIGHTING, CardType.COLORLESS],
      damage: 80,
      text: 'If this Pokémon has any [R] Energy attached, this attack does 80 more damage, and your opponent\'s Active Pokémon is now Burned.'
    }
  ];

  public set: string = 'ASR';

  public cardImage: string = 'assets/cardback.png';

  public setNumber: string = '71';

  public name: string = 'Hisuian Arcanine';

  public fullName: string = 'Hisuian Arcanine ASR';

  public reduceEffect(store: StoreLike, state: State, effect: Effect): State {

    if (effect instanceof AttackEffect && effect.attack === this.attacks[1]) {
      const player = effect.player;
  
      const checkProvidedEnergyEffect = new CheckProvidedEnergyEffect(player);
      store.reduceEffect(state, checkProvidedEnergyEffect);
  
      let energyCount = 0;
      checkProvidedEnergyEffect.energyMap.forEach(em => {
        energyCount += em.provides.filter(cardType => {
          return cardType === CardType.FIRE;
        }).length;
      });
      if (energyCount > 0) {
        effect.damage = effect.damage + 80;
        effect.target.specialConditions.push(SpecialCondition.BURNED);
      }
      return state;
    }
    return state;
  }
}