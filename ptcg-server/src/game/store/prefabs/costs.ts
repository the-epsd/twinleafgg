import { State } from '../..';
import { AttackEffect } from '../effects/game-effects';
import { DiscardCardsEffect } from '../effects/attack-effects';
import { CheckProvidedEnergyEffect } from '../effects/check-effects';
import { StoreLike, Card, ChooseEnergyPrompt, GameMessage } from '../..';
import { CardType } from '../card/card-types';

/**
 * These prefabs are for "costs" that effects/attacks must pay.
 */

/**
 * 
 * @param state 
 * @param effect 
 * @param store 
 * @param type 
 * @param amount 
 * @returns 
 */
export function DISCARD_X_ENERGY_FROM_THIS_POKEMON(state: State, effect: AttackEffect, store: StoreLike, type: CardType, amount: number) {
  const player = effect.player;
  const checkProvidedEnergy = new CheckProvidedEnergyEffect(player);
  state = store.reduceEffect(state, checkProvidedEnergy);

  const energyList: CardType[] = [];
  for (let i = 0; i < amount; i++) {
    energyList.push(type);
  }

  state = store.prompt(state, new ChooseEnergyPrompt(
    player.id,
    GameMessage.CHOOSE_ENERGIES_TO_DISCARD,
    checkProvidedEnergy.energyMap,
    energyList,
    { allowCancel: false }
  ), energy => {
    const cards: Card[] = (energy || []).map(e => e.card);
    const discardEnergy = new DiscardCardsEffect(effect, cards);
    discardEnergy.target = player.active;
    return store.reduceEffect(state, discardEnergy);
  });
  return state;
}