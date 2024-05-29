import { PokemonCard } from '../../game/store/card/pokemon-card';
import { CardType, Stage } from '../../game/store/card/card-types';
import { StoreLike, State, PowerType, StateUtils, PlayerType } from '../../game';
import { Effect } from '../../game/store/effects/effect';
import { CheckProvidedEnergyEffect, CheckTableStateEffect } from '../../game/store/effects/check-effects';
import { PowerEffect } from '../../game/store/effects/game-effects';

export class Venusaur extends PokemonCard {
  
  public stage: Stage = Stage.BASIC;

  public regulationMark: string = 'F';

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

    if (effect instanceof CheckTableStateEffect) {
      state.players.forEach(player => {
        if (player.active.specialConditions.length === 0) {
          return;
        }

        let hasVenusaurInPlay = false;
        player.forEachPokemon(PlayerType.BOTTOM_PLAYER, (cardList, card) => {
          if (card === this) {
            hasVenusaurInPlay = true;
          }
        });

        if (!hasVenusaurInPlay) {
          return state;
        }

        const checkProvidedEnergyEffect = new CheckProvidedEnergyEffect(player);
        store.reduceEffect(state, checkProvidedEnergyEffect);

        const energyMap = checkProvidedEnergyEffect.energyMap;
        const hasGrassEnergy = StateUtils.checkEnoughEnergy(energyMap, [ CardType.GRASS ]);

        if (hasGrassEnergy) {
          // Try to reduce PowerEffect, to check if something is blocking our ability
          try {
            const powerEffect = new PowerEffect(player, this.powers[0], this);
            store.reduceEffect(state, powerEffect);
          } catch {
            return state;
          }

          energyMap.forEach(energy => {
            if (Array.isArray(energy.provides) && energy.provides.includes(CardType.GRASS)) {
              energy.provides = [CardType.GRASS, CardType.GRASS];
            }
          });
        }
      });
    }

    return state;
  }

}
