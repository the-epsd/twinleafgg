import { PokemonCard, CardTag, Stage, CardType, Attack, State, StoreLike, SpecialCondition, Card, CardList, StateUtils } from '../../game';
import { AddSpecialConditionsEffect, DiscardCardsEffect, PutDamageEffect } from '../../game/store/effects/attack-effects';
import { CheckProvidedEnergyEffect } from '../../game/store/effects/check-effects';
import { Effect } from '../../game/store/effects/effect';

import { TAKE_X_PRIZES, WAS_ATTACK_USED } from '../../game/store/prefabs/prefabs';

export class Umbreonex extends PokemonCard {
  public tags = [CardTag.POKEMON_ex, CardTag.POKEMON_TERA];
  public stage: Stage = Stage.STAGE_1;
  public evolvesFrom = 'Eevee';
  public cardType: CardType = D;
  public hp: number = 280;
  public retreat = [C, C];
  public weakness = [{ type: G }];

  public attacks: Attack[] = [
    {
      name: 'Moon Mirage',
      cost: [D, C, C],
      damage: 160,
      text: 'Your opponent\'s Active Pokémon is now Confused.',
    },
    {
      name: 'Onyx',
      cost: [L, P, D],
      damage: 0,
      text: 'Discard all Energy from this Pokémon, and take a Prize card.',
    }
  ];

  public regulationMark: string = 'H';
  public set: string = 'PRE';
  public cardImage: string = 'assets/cardback.png';
  public setNumber: string = '60';
  public name: string = 'Umbreon ex';
  public fullName: string = 'Umbreon ex PRE';

  public reduceEffect(store: StoreLike, state: State, effect: Effect): State {

    if (WAS_ATTACK_USED(effect, 0, this)) {
      const specialConditionEffect = new AddSpecialConditionsEffect(effect, [SpecialCondition.CONFUSED]);
      store.reduceEffect(state, specialConditionEffect);
    }

    if (WAS_ATTACK_USED(effect, 1, this)) {
      const player = effect.player;

      const checkProvidedEnergy = new CheckProvidedEnergyEffect(player);
      state = store.reduceEffect(state, checkProvidedEnergy);

      const cards: Card[] = checkProvidedEnergy.energyMap.map(e => e.card);
      const discardEnergy = new DiscardCardsEffect(effect, cards);
      discardEnergy.target = player.active;
      store.reduceEffect(state, discardEnergy);

      return TAKE_X_PRIZES(store, state, player, 1);
    }

    if (effect instanceof PutDamageEffect && effect.target.cards.includes(this) && effect.target.getPokemonCard() === this) {
      const player = effect.player;
      const opponent = StateUtils.getOpponent(state, player);

      // Target is not Active
      if (effect.target === player.active || effect.target === opponent.active) {
        return state;
      }

      effect.preventDefault = true;
    }
    return state;
  }

  shuffleFaceDownPrizeCards(array: CardList[]): CardList[] {

    const faceDownPrizeCards = array.filter(p => p.isSecret && p.cards.length > 0);

    for (let i = faceDownPrizeCards.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      const temp = faceDownPrizeCards[i];
      faceDownPrizeCards[i] = faceDownPrizeCards[j];
      faceDownPrizeCards[j] = temp;
    }

    const prizePositions = [];

    for (let i = 0; i < array.length; i++) {
      if (array[i].cards.length === 0 || !array[i].isSecret) {
        prizePositions.push(array[i]);
        continue;
      }

      prizePositions.push(faceDownPrizeCards.splice(0, 1)[0]);
    }

    return prizePositions;
  }
}