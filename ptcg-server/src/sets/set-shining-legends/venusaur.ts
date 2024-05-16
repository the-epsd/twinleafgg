import { PokemonCard } from '../../game/store/card/pokemon-card';
import { CardType, Stage } from '../../game/store/card/card-types';
import { StoreLike, State, PowerType, EnergyCard } from '../../game';
import { PowerEffect } from '../../game/store/effects/game-effects';
import { Effect } from '../../game/store/effects/effect';
import { CheckProvidedEnergyEffect } from '../../game/store/effects/check-effects';

export class Venusaur extends PokemonCard {
  
  public stage: Stage = Stage.BASIC;

  public evolvesFrom = 'Ivysaur';

  public cardType: CardType = CardType.GRASS;

  public hp: number = 160;

  public weakness = [{ type: CardType.FIRE }];

  public retreat = [CardType.COLORLESS, CardType.COLORLESS, CardType.COLORLESS, CardType.COLORLESS];

  public powers = [{
    name: 'Jungle Totem',
    powerType: PowerType.ABILITY,
    text: 'Each basic [G] Energy attached to your Pokémon provides [G][G] Energy. You can\'t apply more than 1 Jungle Totem Ability at a time.'
  }];

  public attacks = [
    {
      name: 'Solar Beam',
      cost: [CardType.GRASS, CardType.GRASS, CardType.COLORLESS, CardType.COLORLESS],
      damage: 90,
      text: '',
    }
  ];

  public set: string = 'SLG';

  public cardImage: string = 'assets/cardback.png';

  public setNumber: string = '3';

  public name: string = 'Venusaur';

  public fullName: string = 'Venusaur SLG';
  
  public reduceEffect(store: StoreLike, state: State, effect: Effect): State {

    if (effect instanceof PowerEffect && effect.power === this.powers[0]) {

      const player = effect.player;
      const pokemon = player.active || player.bench.find(p => p.getPokemons());

      const checkEnergy = new CheckProvidedEnergyEffect(player, pokemon);
      store.reduceEffect(state, checkEnergy);

      checkEnergy.energyMap.forEach(em => {
        const energyCard = em.card;
        if (energyCard instanceof EnergyCard && energyCard.provides.includes(CardType.GRASS)) {
          energyCard.provides = [CardType.GRASS, CardType.GRASS];
        }
      });
    }
    return state;
  }
}