import { PokemonCard } from '../../game/store/card/pokemon-card';
import { CardType, Stage, SuperType } from '../../game/store/card/card-types';
import { StoreLike, State, PowerType, PlayerType, StateUtils, EnergyCard } from '../../game';
import { Effect } from '../../game/store/effects/effect';
import { CheckPokemonTypeEffect, CheckProvidedEnergyEffect } from '../../game/store/effects/check-effects';
import { ADD_POISON_TO_PLAYER_ACTIVE, ADD_SLEEP_TO_PLAYER_ACTIVE, AFTER_ATTACK, IS_POKEBODY_BLOCKED, WAS_ATTACK_USED } from '../../game/store/prefabs/prefabs';

export class Venusaur extends PokemonCard {
  public stage: Stage = Stage.STAGE_2;
  public evolvesFrom = 'Ivysaur';
  public cardType: CardType = G;
  public hp: number = 110;
  public weakness = [{ type: R }];
  public retreat = [C, C, C];

  public powers = [{
    name: 'Chlorophyll',
    powerType: PowerType.POKEBODY,
    text: 'All Energy cards that provide only [C] Energy attached to your [G] Pokémon provide [G] Energy instead.'
  }];

  public attacks = [{
    name: 'Green Blast',
    cost: [C, C],
    damage: 20,
    damageCalculation: '+',
    text: 'Does 20 damage plus 10 more damage for each [G] Energy attached to all of your Pokémon.'
  },
  {
    name: 'Toxic Sleep',
    cost: [G, G, C],
    damage: 0,
    text: 'The Defending Pokémon is now Asleep and Poisoned. Put 2 damage counters instead of 1 on the Defending Pokémon between turns.'
  }];

  public set: string = 'CG';
  public cardImage: string = 'assets/cardback.png';
  public setNumber: string = '28';
  public name: string = 'Venusaur';
  public fullName: string = 'Venusaur CG';

  public reduceEffect(store: StoreLike, state: State, effect: Effect): State {

    if (effect instanceof CheckProvidedEnergyEffect) {
      const player = effect.player;

      if (!StateUtils.isPokemonInPlay(player, this)) {
        return state;
      }

      if (IS_POKEBODY_BLOCKED(store, state, player, this)) {
        return state;
      }

      const checkType = new CheckPokemonTypeEffect(effect.source);
      store.reduceEffect(state, checkType);
      if (!checkType.cardTypes.includes(CardType.GRASS)) {
        return state;
      }

      effect.energyMap.forEach(energy => {
        if (energy.card.superType !== SuperType.ENERGY || energy.provides.length === 0) {
          return;
        }
        if (!energy.provides.every(type => type === CardType.COLORLESS)) {
          return;
        }
        energy.provides = energy.provides.map(() => CardType.GRASS);
      });

      // CheckProvidedEnergyEffect runs before the default energy-map population reducer,
      // so add transformed entries for attached energy cards that are not yet mapped.
      effect.source.cards.forEach(card => {
        if (!(card instanceof EnergyCard) || effect.energyMap.some(e => e.card === card)) {
          return;
        }

        // Some special energies (e.g. Rainbow) define their own CheckProvidedEnergyEffect
        // mapping. If we also push here, the same card can be counted twice.
        const probe = new CheckProvidedEnergyEffect(effect.player, effect.source);
        card.reduceEffect(store, state, probe);
        if (probe.energyMap.some(e => e.card === card)) {
          return;
        }

        const provides = card.provides.every(type => type === CardType.COLORLESS)
          ? card.provides.map(() => CardType.GRASS)
          : card.provides;

        effect.energyMap.push({ card, provides });
      });
    }

    if (WAS_ATTACK_USED(effect, 0, this)) {
      const player = effect.player;

      let energyCount = 0;
      player.forEachPokemon(PlayerType.BOTTOM_PLAYER, (cardList, card) => {

        const checkProvidedEnergyEffect = new CheckProvidedEnergyEffect(player, cardList);
        store.reduceEffect(state, checkProvidedEnergyEffect);

        checkProvidedEnergyEffect.energyMap.forEach(em => {
          energyCount += em.provides.filter(cardType => {
            return cardType === CardType.GRASS || cardType === CardType.ANY;
          }).length;
        });
      });
      effect.damage += energyCount * 10;
      return state;
    }

    if (AFTER_ATTACK(effect, 1, this)) {
      ADD_SLEEP_TO_PLAYER_ACTIVE(store, state, effect.opponent, this);
      ADD_POISON_TO_PLAYER_ACTIVE(store, state, effect.opponent, this, 20);
    }

    return state;
  }
}