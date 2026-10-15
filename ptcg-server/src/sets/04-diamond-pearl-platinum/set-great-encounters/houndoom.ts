import { PokemonCard } from '../../../game/store/card/pokemon-card';
import { CardType, Stage, SuperType } from '../../../game/store/card/card-types';
import { ChooseCardsPrompt, EnergyCard, GameMessage, State, StateUtils, StoreLike } from '../../../game';
import { Effect } from '../../../game/store/effects/effect';
import { DiscardCardsEffect } from '../../../game/store/effects/attack-effects';
import { MOVE_CARDS, WAS_ATTACK_USED } from '../../../game/store/prefabs/prefabs';
import { YOUR_OPPPONENTS_ACTIVE_POKEMON_IS_NOW_BURNED } from '../../../game/store/prefabs/attack-effects';

export class Houndoom extends PokemonCard {
  public stage: Stage = Stage.STAGE_1;
  public evolvesFrom: string = 'Houndour';
  public hp: number = 90;
  public cardType: CardType[] = [D];
  public weakness = [{ type: W, value: +20 }];
  public resistance = [{ type: P, value: -20 }];
  public retreat = [C];

  public attacks = [{
    name: 'Dark Fang',
    cost: [D],
    damage: 20,
    text: 'Choose 1 card from your opponent\'s hand without looking and discard it.'
  },
  {
    name: 'Black Fire',
    cost: [R, C],
    damage: 40,
    damageCalculation: '+',
    text: 'You may discard a Fire or Darkness Energy attached to Houndoom. If you discard a Fire Energy, the Defending Pokémon is now Burned. If you discard a Darkness Energy, this attack does 40 damage plus 30 more damage.'
  }];

  public set: string = 'GE';
  public cardImage: string = 'assets/cardback.png';
  public setNumber: string = '18';
  public name: string = 'Houndoom';
  public fullName: string = 'Houndoom GE';

  public reduceEffect(store: StoreLike, state: State, effect: Effect): State {
    // Dark Fang
    if (WAS_ATTACK_USED(effect, 0, this)) {
      const opponent = StateUtils.getOpponent(state, effect.player);
      if (opponent.hand.cards.length === 0) {
        return state;
      }
      const randomIndex = Math.floor(Math.random() * opponent.hand.cards.length);
      const randomCard = opponent.hand.cards[randomIndex];
      MOVE_CARDS(store, state, opponent.hand, opponent.discard, {
        cards: [randomCard],
        sourceCard: this,
      });
    }

    // Black Fire
    if (WAS_ATTACK_USED(effect, 1, this)) {
      const player = effect.player;
      const attackEffect = effect;
      const blocked: number[] = [];
      player.active.cards.forEach((c, index) => {
        if (!(c instanceof EnergyCard)) {
          blocked.push(index);
          return;
        }
        const isFire = c.provides.includes(CardType.FIRE) || c.provides.includes(CardType.ANY);
        const isDark = c.provides.includes(CardType.DARK) || c.provides.includes(CardType.ANY);
        if (!isFire && !isDark) {
          blocked.push(index);
        }
      });

      if (!player.active.cards.some((_, index) => !blocked.includes(index))) {
        return state;
      }

      return store.prompt(state, new ChooseCardsPrompt(
        player,
        GameMessage.CHOOSE_CARD_TO_DISCARD,
        player.active,
        { superType: SuperType.ENERGY },
        { min: 0, max: 1, allowCancel: true, blocked }
      ), selected => {
        const cards = selected || [];
        if (cards.length === 0) {
          return;
        }
        const energy = cards[0] as EnergyCard;
        const discardEnergy = new DiscardCardsEffect(attackEffect, cards);
        discardEnergy.target = player.active;
        store.reduceEffect(state, discardEnergy);

        if (energy.provides.includes(CardType.FIRE) || energy.provides.includes(CardType.ANY)) {
          YOUR_OPPPONENTS_ACTIVE_POKEMON_IS_NOW_BURNED(store, state, attackEffect);
        }
        if (energy.provides.includes(CardType.DARK) || energy.provides.includes(CardType.ANY)) {
          attackEffect.damage += 30;
        }
      });
    }

    return state;
  }
}
