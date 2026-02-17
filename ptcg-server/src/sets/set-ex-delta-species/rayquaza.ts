import { PokemonCard } from '../../game/store/card/pokemon-card';
import { Stage, CardType, CardTag, SuperType } from '../../game/store/card/card-types';
import { StoreLike, State, PowerType, PlayerType, Card } from '../../game';
import { Effect } from '../../game/store/effects/effect';
import { WAS_ATTACK_USED } from '../../game/store/prefabs/prefabs';
import { CheckProvidedEnergyEffect } from '../../game/store/effects/check-effects';

export class Rayquaza extends PokemonCard {
  public stage: Stage = Stage.BASIC;
  public tags = [CardTag.DELTA_SPECIES];
  public cardType: CardType = L;
  public additionalCardTypes = [M];
  public hp: number = 90;
  public weakness = [{ type: C }];
  public resistance = [{ type: W, value: -30 }, { type: F, value: -30 }];
  public retreat = [C, C, C];

  public powers = [{
    name: 'Delta Guard',
    powerType: PowerType.POKEBODY,
    text: 'As long as Rayquaza has any Holon Energy cards attached to it, ignore the effect of Rayquaza\'s Lightning Storm attack.'
  }];

  public attacks = [{
    name: 'Power Blow',
    cost: [L],
    damage: 10,
    damageCalculation: 'x',
    text: 'Does 10 damage times the amount of Energy attached to Rayquaza.'
  },
  {
    name: 'Lightning Storm',
    cost: [L, M, C, C],
    damage: 70,
    text: 'Put 7 damage counters on Rayquaza.'
  }];

  public set: string = 'DS';
  public cardImage: string = 'assets/cardback.png';
  public setNumber: string = '13';
  public name: string = 'Rayquaza';
  public fullName: string = 'Rayquaza DS';

  public reduceEffect(store: StoreLike, state: State, effect: Effect): State {

    if (WAS_ATTACK_USED(effect, 0, this)) {
      const player = effect.player;

      player.forEachPokemon(PlayerType.BOTTOM_PLAYER, (cardList, card, target) => {
        if (cardList.getPokemonCard() === this) {
          const checkProvidedEnergy = new CheckProvidedEnergyEffect(player, cardList);
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
    }

    if (WAS_ATTACK_USED(effect, 1, this)) {
      const player = effect.player;
      const energies = player.active.cards.filter(card => card.superType === SuperType.ENERGY && card.name.includes('Holon Energy'));

      if (energies.length === 0) {
        player.active.damage += 70;
      }
    }

    return state;
  }
}

