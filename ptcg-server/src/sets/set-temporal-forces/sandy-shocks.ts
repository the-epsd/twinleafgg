import { PokemonCard } from '../../game/store/card/pokemon-card';
import { Stage, CardType, CardTag } from '../../game/store/card/card-types';
import { State } from '../../game/store/state/state';
import { AttackEffect } from '../../game/store/effects/game-effects';
import { StoreLike } from '../../game/store/store-like';
import { Effect } from '../../game/store/effects/effect';
import { CheckProvidedEnergyEffect } from '../../game/store/effects/check-effects';
import { PlayerType } from '../../game';

export class SandyShocks extends PokemonCard {

  public regulationMark = 'H';

  public tags = [CardTag.ANCIENT];

  public stage = Stage.BASIC;

  public cardType = CardType.FIGHTING;

  public hp = 120;

  public weakness = [{ type: CardType.GRASS }];

  public retreat = [CardType.COLORLESS, CardType.COLORLESS];

  public attacks = [
    {
      name: 'Magnetic Burst',
      cost: [CardType.FIGHTING],
      damage: 20,
      damageCalculation: '+',
      text: 'If you have 3 or more Energy in play, this attack does 70 more damage. This attack\'s damage isn\'t affected by Weakness.'
    },
    {
      name: 'Power Gem',
      cost: [CardType.FIGHTING, CardType.COLORLESS],
      damage: 60,
      text: ''
    }
  ];

  public set: string = 'TEF';

  public cardImage: string = 'assets/cardback.png';

  public setNumber: string = '98';

  public name: string = 'Sandy Shocks';

  public fullName: string = 'Sandy Shocks TEF';

  public reduceEffect(store: StoreLike, state: State, effect: Effect): State {

    if (effect instanceof AttackEffect && effect.attack === this.attacks[0]) {

      const player = effect.player;
      effect.ignoreWeakness = true;
      let energyCount = 0;
      player.forEachPokemon(PlayerType.BOTTOM_PLAYER, (cardList, card) => {
        const checkProvidedEnergyEffect = new CheckProvidedEnergyEffect(player, cardList);
        store.reduceEffect(state, checkProvidedEnergyEffect);
        checkProvidedEnergyEffect.energyMap.forEach(energy => {
          energyCount += energy.provides.length;
        });
      });

      if (energyCount >= 3) {
        effect.damage += 70;
      }

    }
    return state;
  }
}