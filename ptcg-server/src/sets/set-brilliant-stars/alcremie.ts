import { PokemonCard } from '../../game/store/card/pokemon-card';
import { Stage, CardType, EnergyType } from '../../game/store/card/card-types';
import { StoreLike, State, PowerType, PlayerType } from '../../game';
import { Effect } from '../../game/store/effects/effect';
import { WAS_ATTACK_USED } from '../../game/store/prefabs/prefabs';
import { CheckProvidedEnergyEffect } from '../../game/store/effects/check-effects';

export class Alcremie extends PokemonCard {
  public regulationMark: string = 'E';
  public stage: Stage = Stage.STAGE_1;
  public evolvesFrom = 'Milcery';
  public cardType: CardType = P;
  public hp: number = 90;
  public weakness = [{ type: M }];
  public retreat = [C];

  public powers = [{
    name: 'Additional Order',
    powerType: PowerType.ABILITY,
    text: 'As long as this Pokémon is in the Active Spot, your turn does not end when you use Café Master.'
  }];

  public attacks = [{
    name: 'Rainbow Flavor',
    cost: [C, C],
    damage: 10,
    damageCalculation: '+',
    text: 'This attack does 40 more damage for each type of basic Energy attached to all of your Pokémon.'
  }];

  public set: string = 'BRS';
  public cardImage: string = 'assets/cardback.png';
  public setNumber: string = '71';
  public name: string = 'Alcremie';
  public fullName: string = 'Alcremie BRS';

  public reduceEffect(store: StoreLike, state: State, effect: Effect): State {

    if (WAS_ATTACK_USED(effect, 0, this)) {
      const player = effect.player;

      const uniqueTypes = new Set<CardType>();

      player.forEachPokemon(PlayerType.BOTTOM_PLAYER, pokemon => {
        const checkProvidedEnergyEffect = new CheckProvidedEnergyEffect(player, pokemon);
        store.reduceEffect(state, checkProvidedEnergyEffect);

        checkProvidedEnergyEffect.energyMap.forEach(em => {
          if (em.card.energyType === EnergyType.BASIC && em.provides.length > 0) {
            if (em.provides.includes(CardType.ANY)) {
              // Add all basic energy types if CardType.ANY is provided
              [
                CardType.FIRE,
                CardType.WATER,
                CardType.GRASS,
                CardType.LIGHTNING,
                CardType.PSYCHIC,
                CardType.FIGHTING,
                CardType.DARK,
                CardType.METAL,
                CardType.FAIRY
              ].forEach(type => uniqueTypes.add(type));
            } else {
              em.provides.forEach(type => uniqueTypes.add(type));
            }
          }
        });
      });

      console.log('Unique types:', uniqueTypes);
      // Set the damage based on the count of unique Pokémon types
      effect.damage += 40 * uniqueTypes.size;

      return state;
    }
    return state;
  }
}
