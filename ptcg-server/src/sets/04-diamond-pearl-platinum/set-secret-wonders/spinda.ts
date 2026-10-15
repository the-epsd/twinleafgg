import { PokemonCard } from '../../../game/store/card/pokemon-card';
import { CardType, EnergyType, Stage } from '../../../game/store/card/card-types';
import { EnergyCard, State, StateUtils, StoreLike } from '../../../game';
import { Effect } from '../../../game/store/effects/effect';
import { CheckProvidedEnergyEffect } from '../../../game/store/effects/check-effects';
import { MOVE_CARDS, WAS_ATTACK_USED } from '../../../game/store/prefabs/prefabs';

export class Spinda extends PokemonCard {
  public stage: Stage = Stage.BASIC;
  public hp: number = 70;
  public cardType: CardType[] = [C];
  public weakness = [{ type: F, value: +20 }];
  public retreat = [C];

  public attacks = [{
    name: 'Dish Out',
    cost: [C],
    damage: 0,
    text: 'Draw a card from the top and the bottom of your deck.'
  },
  {
    name: 'Synchro Punch',
    cost: [C],
    damage: 10,
    damageCalculation: '+',
    text: 'If any basic Energy card attached to Spinda is the same type as any Energy attached to the Defending Pokémon, this attack does 10 damage plus 30 more damage.'
  }];

  public set: string = 'SW';
  public cardImage: string = 'assets/cardback.png';
  public setNumber: string = '111';
  public name: string = 'Spinda';
  public fullName: string = 'Spinda SW';

  public reduceEffect(store: StoreLike, state: State, effect: Effect): State {
    // Dish Out
    if (WAS_ATTACK_USED(effect, 0, this)) {
      const player = effect.player;
      if (player.deck.cards.length > 0) {
        MOVE_CARDS(store, state, player.deck, player.hand, { cards: [player.deck.cards[0]], sourceCard: this });
      }
      if (player.deck.cards.length > 0) {
        const bottom = player.deck.cards[player.deck.cards.length - 1];
        MOVE_CARDS(store, state, player.deck, player.hand, { cards: [bottom], sourceCard: this });
      }
    }

    // Synchro Punch
    if (WAS_ATTACK_USED(effect, 1, this)) {
      const player = effect.player;
      const opponent = StateUtils.getOpponent(state, player);

      const myBasicTypes = new Set<CardType>();
      player.active.cards.forEach(c => {
        if (c instanceof EnergyCard && c.energyType === EnergyType.BASIC) {
          c.provides.forEach(t => myBasicTypes.add(t));
        }
      });

      const checkOpp = new CheckProvidedEnergyEffect(opponent, opponent.active);
      store.reduceEffect(state, checkOpp);
      const oppTypes = new Set<CardType>();
      checkOpp.energyMap.forEach(em => em.provides.forEach(t => oppTypes.add(t)));

      let match = false;
      myBasicTypes.forEach(t => {
        if (oppTypes.has(t) || oppTypes.has(CardType.ANY)) {
          match = true;
        }
        if (t === CardType.ANY && oppTypes.size > 0) {
          match = true;
        }
      });

      if (match) {
        effect.damage += 30;
      }
    }

    return state;
  }
}
