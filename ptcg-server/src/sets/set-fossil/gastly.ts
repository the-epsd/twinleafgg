import { PokemonCard } from '../../game/store/card/pokemon-card';
import { Stage, CardType, SpecialCondition, SuperType } from '../../game/store/card/card-types';
import { StoreLike, State, CoinFlipPrompt, GameMessage, ChooseCardsPrompt, EnergyCard } from '../../game';
import { Effect } from '../../game/store/effects/effect';
import { AddSpecialConditionsEffect, DealDamageEffect } from '../../game/store/effects/attack-effects';
import { AttackEffect } from '../../game/store/effects/game-effects';

export class Gastly extends PokemonCard {
  public stage: Stage = Stage.BASIC;
  public cardType: CardType = CardType.PSYCHIC;
  public hp: number = 50;
  public resistance = [{ type: CardType.FIGHTING, value: -30 }];

  public attacks = [{
    name: 'Lick',
    cost: [P],
    damage: 10,
    text: 'Flip a coin. If heads, the Defending Pokémon is now Paralyzed'
  },
  {
    name: 'Energy Conversion',
    cost: [P, P],
    damage: 0,
    text: 'Put up to 2 Energy cards from your discard pile into your hand. Gastly does 10 damage to itself.'
  }];

  public set: string = 'FO';
  public cardImage: string = 'assets/cardback.png';
  public setNumber: string = '33';
  public name: string = 'Gastly';
  public fullName: string = 'Gastly FO';

  public reduceEffect(store: StoreLike, state: State, effect: Effect): State {

    if (effect instanceof AttackEffect && effect.attack === this.attacks[0]) {
      const player = effect.player;
      state = store.prompt(state, [
        new CoinFlipPrompt(player.id, GameMessage.COIN_FLIP)
      ], results => {
        if (results) {
          const specialConditionEffect = new AddSpecialConditionsEffect(effect, [SpecialCondition.PARALYZED]);
          store.reduceEffect(state, specialConditionEffect);
        }
      });
      return state;
    }

    if (effect instanceof AttackEffect && effect.attack === this.attacks[1]) {
      const player = effect.player;

      let energyCards = 0;
      player.discard.cards.forEach(c => {
        if (c instanceof EnergyCard) {
          energyCards++;
        }
      });

      if (energyCards === 0) {
        return state;
      }

      const min = Math.min(energyCards, 2);
      state = store.prompt(state, new ChooseCardsPrompt(
        player,
        GameMessage.CHOOSE_CARD_TO_HAND,
        player.discard,
        { superType: SuperType.ENERGY },
        { min, max: min, allowCancel: true }
      ), cards => {
        cards = cards || [];
        if (cards.length > 0) {
          // Recover discarded Pokemon
          player.discard.moveCardsTo(cards, player.hand);
        }
      });

      const dealDamage = new DealDamageEffect(effect, 10);
      dealDamage.target = player.active;
      return store.reduceEffect(state, dealDamage);
    }

    return state;
  }
}