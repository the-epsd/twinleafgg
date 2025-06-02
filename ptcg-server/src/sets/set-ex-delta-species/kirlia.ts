import { CardType, Stage } from '../../game/store/card/card-types';
import { StoreLike } from '../../game/store/store-like';
import { State } from '../../game/store/state/state';
import { Effect } from '../../game/store/effects/effect';
import { Card, PlayerType, PokemonCard } from '../../game';
import { HEAL_X_DAMAGE_FROM_THIS_POKEMON, WAS_ATTACK_USED } from '../../game/store/prefabs/prefabs';
import { CheckProvidedEnergyEffect } from '../../game/store/effects/check-effects';

export class Kirlia extends PokemonCard {
  public stage: Stage = Stage.STAGE_1;
  public evolvesFrom: string = 'Ralts';
  public hp = 70;
  public cardType: CardType = P;
  public weakness = [{ type: P }];
  public retreat = [C];

  public attacks = [{
    name: 'Calm Mind',
    cost: [C],
    damage: 0,
    text: 'Remove 3 damage counters from Kirlia.'
  },
  {
    name: 'Psychic Boom',
    cost: [P, C],
    damage: 20,
    damageCalculation: '+',
    text: 'Does 20 damage plus 10 more damage for each Energy attached to the Defending Pokémon.'
  }];

  public set: string = 'DS';
  public cardImage: string = 'assets/cardback.png';
  public setNumber: string = '47';
  public name: string = 'Kirlia';
  public fullName: string = 'Kirlia DS';

  public reduceEffect(store: StoreLike, state: State, effect: Effect): State {

    if (WAS_ATTACK_USED(effect, 0, this)) {
      HEAL_X_DAMAGE_FROM_THIS_POKEMON(effect, store, state, 30);
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
          effect.damage += checkProvidedEnergy.energyMap.length * damagePerEnergy;
        }
      });

    }

    return state;
  }

}