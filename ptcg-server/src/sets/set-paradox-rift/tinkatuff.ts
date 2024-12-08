import { PokemonCard } from '../../game/store/card/pokemon-card';
import { Stage, CardType } from '../../game/store/card/card-types';
import { AttackEffect } from '../../game/store/effects/game-effects';
import { CheckProvidedEnergyEffect } from '../../game/store/effects/check-effects';
import { State } from '../../game/store/state/state';
import { StoreLike } from '../../game/store/store-like';
import { EnergyCard } from '../../game';
import { Effect } from '../../game/store/effects/effect';

export class Tinkatuff extends PokemonCard {

  public stage: Stage = Stage.STAGE_1;

  public regulationMark = 'G';

  public cardType: CardType = CardType.PSYCHIC;

  public hp: number = 80;

  public weakness = [{ type: CardType.METAL }];

  public retreat = [CardType.COLORLESS, CardType.COLORLESS];

  public attacks = [
    {
      name: 'Alloy Swing',
      cost: [CardType.PSYCHIC],
      damage: 20,
      damageCalculation: '+',
      text: 'If this Pokémon has any [M] Energy attached, this attack does 40 more damage.'
    }
  ];

  public set: string = 'PAR';

  public cardImage: string = 'assets/cardback.png';

  public setNumber: string = '84';

  public name: string = 'Tinkatuff';

  public fullName: string = 'Tinkatuff PAR';


  reduceEffect(store: StoreLike, state: State, effect: Effect) {

    if (effect instanceof AttackEffect && effect.attack === this.attacks[0]) {

      const player = effect.player;
      const pokemon = player.active;

      const checkEnergy = new CheckProvidedEnergyEffect(player, pokemon);
      store.reduceEffect(state, checkEnergy);

      let damage = 20;

      checkEnergy.energyMap.forEach(em => {
        const energyCard = em.card;
        if (energyCard instanceof EnergyCard &&
          (energyCard.provides.includes(CardType.METAL) ||
            energyCard.provides.includes(CardType.ANY) ||
            energyCard.blendedEnergies?.includes(CardType.METAL))
        ) {
          damage += 40;
        }
      });

      effect.damage = damage;

    }
    return state;
  }
}