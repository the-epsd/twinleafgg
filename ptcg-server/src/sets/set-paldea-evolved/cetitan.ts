import { PokemonCard } from '../../game/store/card/pokemon-card';
import { Stage, CardType, EnergyType } from '../../game/store/card/card-types';
import { AttackEffect } from '../../game/store/effects/game-effects';
import { CheckProvidedEnergyEffect } from '../../game/store/effects/check-effects';
import { State } from '../../game/store/state/state';
import { StoreLike } from '../../game/store/store-like';
import { EnergyCard } from '../../game';
import { Effect } from '../../game/store/effects/effect';

export class Cetitan extends PokemonCard {

  public stage: Stage = Stage.STAGE_1;

  public evolvesFrom = 'Cetoddle';

  public regulationMark = 'G';

  public cardType: CardType = CardType.WATER;

  public hp: number = 180;

  public weakness = [{ type: CardType.METAL }];

  public retreat = [CardType.COLORLESS, CardType.COLORLESS, CardType.COLORLESS];

  public attacks = [
    {
      name: 'Icicle Missile',
      cost: [CardType.WATER, CardType.COLORLESS],
      damage: 50,
      text: ''
    },
    {
      name: 'Special Horn',
      cost: [CardType.WATER, CardType.WATER, CardType.COLORLESS],
      damage: 80,
      damageCalculation: '+',
      text: 'If this Pokémon has any Special Energy attached, this attack does 140 more damage.'
    }
  ];

  public set: string = 'PAL';

  public cardImage: string = 'assets/cardback.png';

  public setNumber: string = '55';

  public name: string = 'Cetitan';

  public fullName: string = 'Cetitan PAL';


  reduceEffect(store: StoreLike, state: State, effect: Effect) {
    if (effect instanceof AttackEffect && effect.attack === this.attacks[1]) {

      const player = effect.player;
      const pokemon = player.active;

      const checkEnergy = new CheckProvidedEnergyEffect(player, pokemon);
      store.reduceEffect(state, checkEnergy);

      let damage = 80;

      checkEnergy.energyMap.forEach(em => {
        const energyCard = em.card;
        if (energyCard instanceof EnergyCard && energyCard.energyType === EnergyType.SPECIAL) {
          damage += 140;
        }
      });

      effect.damage = damage;

    }
    return state;
  }
}