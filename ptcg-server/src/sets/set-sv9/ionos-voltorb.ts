import { PokemonCard } from '../../game/store/card/pokemon-card';
import { Stage, CardType, CardTag } from '../../game/store/card/card-types';
import { StoreLike, State, PlayerType } from '../../game';
import { CheckProvidedEnergyEffect } from '../../game/store/effects/check-effects';
import { Effect } from '../../game/store/effects/effect';
import { AttackEffect } from '../../game/store/effects/game-effects';

export class IonosVoltorb extends PokemonCard {

  public tags = [CardTag.IONOS];

  public stage: Stage = Stage.BASIC;

  public cardType: CardType = L;

  public hp: number = 70;

  public weakness = [{ type: F }];

  public retreat = [C];

  public attacks = [
    {
      name: 'Chain Bolt',
      cost: [C, C],
      damage: 20,
      damageCalculation: '+',
      text: 'This attack does 20 more damage for each [L] Energy attached to your Iono\'s Pokémon.'
    }
  ];

  public regulationMark = 'I';

  public cardImage: string = 'assets/cardback.png';

  public set: string = 'SV9';

  public setNumber = '26';

  public name: string = 'Iono\'s Voltorb';

  public fullName: string = 'Iono\'s Voltorb SV9';


  public reduceEffect(store: StoreLike, state: State, effect: Effect): State {
    if (effect instanceof AttackEffect && effect.attack === this.attacks[0]) {
      const player = effect.player;

      let energies = 0;
      player.forEachPokemon(PlayerType.BOTTOM_PLAYER, (cardList, card) => {
        if (card.cardTag.includes(CardTag.IONOS)) {
          const checkProvidedEnergyEffect = new CheckProvidedEnergyEffect(player, cardList);
          store.reduceEffect(state, checkProvidedEnergyEffect);
          checkProvidedEnergyEffect.energyMap.forEach(energy => {
            if (energy.provides.includes(CardType.LIGHTNING) || energy.provides.includes(CardType.ANY)) {
              energies += 1;
            }
          });
        }
      });

      effect.damage = 20 + energies * 20;
    }

    return state;
  }

}