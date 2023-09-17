import { PokemonCard } from '../../store/card/pokemon-card';
import { State, StateUtils } from '../..';
import { Effect } from '../effects/effect';
import { AttackEffect, PowerEffect } from '../effects/game-effects';
import { DiscardCardsEffect } from '../effects/attack-effects';
import { CheckProvidedEnergyEffect } from '../effects/check-effects';
import { StoreLike, Card, ChooseEnergyPrompt, GameMessage } from '../../../game';
import {CardType} from "../card/card-types";

export function WAS_ATTACK_USED(effect: Effect, index: number, user: PokemonCard): effect is AttackEffect{
  return effect instanceof AttackEffect && effect.attack === user.attacks[0]
}

export function WAS_ABILITY_USED(effect: Effect, index: number, user: PokemonCard): effect is PowerEffect{
  return effect instanceof PowerEffect && effect.power === user.powers[0]
}

export function DISCARD_STADIUM_IN_PLAY(state: State){
    const stadiumCard = StateUtils.getStadiumCard(state);
      if (stadiumCard !== undefined) {
  
  
        // Discard Stadium
        const cardList = StateUtils.findCardList(state, stadiumCard);
        const player = StateUtils.findOwner(state, cardList);
        cardList.moveTo(player.discard);
        return state;
      }
      return state;
}

export function DISCARD_ENERGY_FROM_THIS_POKEMON(state: State, effect: AttackEffect, store: StoreLike, type: CardType, amount: number){
  const player = effect.player;
  const checkProvidedEnergy = new CheckProvidedEnergyEffect(player);
  state = store.reduceEffect(state, checkProvidedEnergy);

  let energyList: CardType[] = [];
  for(let i = 0; i < amount; i++){
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
}

export function FLIP_IF_HEADS(){

}

export function HEAL_FROM_THIS_POKEMON(){

}

export function THIS_POKEMON_HAS_DAMAGE_COUNTERS(effect: AttackEffect, user: PokemonCard){
  // TODO: Would like to check if Pokemon has damage without needing the effect
  const player = effect.player;
  const source = player.active;
  
    // Check if source Pokemon has damage
    const damage = source.damage;
    if (damage > 0) {
      return true;
    }
    return false;
}