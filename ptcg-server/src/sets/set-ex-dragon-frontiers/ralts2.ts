import { PokemonCard } from '../../game/store/card/pokemon-card';
import { Stage, CardType } from '../../game/store/card/card-types';
import { StoreLike, State, PlayerType, Card } from '../../game';
import { Effect } from '../../game/store/effects/effect';
import { WAS_ATTACK_USED } from '../../game/store/prefabs/prefabs';
import { YOUR_OPPPONENTS_ACTIVE_POKEMON_IS_NOW_ASLEEP } from '../../game/store/prefabs/attack-effects';
import { CheckProvidedEnergyEffect } from '../../game/store/effects/check-effects';

export class Ralts2 extends PokemonCard {
  public stage: Stage = Stage.BASIC;
  public cardType: CardType = P;
  public hp: number = 50;
  public weakness = [{ type: P }];
  public retreat = [C];

  public attacks = [{
    name: 'Hypnosis',
    cost: [C],
    damage: 0,
    text: 'The Defending Pokémon is now Asleep.'
  },
  {
    name: 'Psychic Boom',
    cost: [P],
    damage: 10,
    damageCalculation: 'x',
    text: 'Does 10 damage times the amount of Energy attached to the Defending Pokémon.'
  }];

  public set: string = 'DF';
  public cardImage: string = 'assets/cardback.png';
  public setNumber: string = '60';
  public name: string = 'Ralts';
  public fullName: string = 'Ralts DF 60';

  public reduceEffect(store: StoreLike, state: State, effect: Effect): State {

    if (WAS_ATTACK_USED(effect, 0, this)) {
      YOUR_OPPPONENTS_ACTIVE_POKEMON_IS_NOW_ASLEEP(store, state, effect);
    }

    if (WAS_ATTACK_USED(effect, 1, this)) {
      const opponent = effect.opponent;

      opponent.forEachPokemon(PlayerType.TOP_PLAYER, (cardList, card, target) => {
        if (cardList === opponent.active) {
          const checkProvidedEnergy = new CheckProvidedEnergyEffect(opponent, cardList);
          store.reduceEffect(state, checkProvidedEnergy);

          const blockedCards: Card[] = [];

          checkProvidedEnergy.energyMap.forEach(em => {
            if (!em.provides.includes(CardType.ANY)) {
              blockedCards.push(em.card);
            }
          });

          const damagePerEnergy = 10;
          effect.damage = checkProvidedEnergy.energyMap.length * damagePerEnergy;
        }
      });

      return state;
    }

    return state;
  }
}