import { PokemonCard } from '../../../game/store/card/pokemon-card';
import { CardType, Stage } from '../../../game/store/card/card-types';
import { State, StateUtils, StoreLike } from '../../../game';
import { Effect } from '../../../game/store/effects/effect';
import { CheckProvidedEnergyEffect } from '../../../game/store/effects/check-effects';
import { DRAW_CARDS, MOVE_CARDS, SHOW_CARDS_TO_PLAYER, WAS_ATTACK_USED } from '../../../game/store/prefabs/prefabs';

export class Luvdisc extends PokemonCard {
  public stage: Stage = Stage.BASIC;
  public hp: number = 60;
  public cardType: CardType[] = [W];
  public weakness = [{ type: L, value: +10 }];
  public retreat = [C];

  public attacks = [{
    name: 'Rendezvous',
    cost: [C],
    damage: 0,
    text: 'Reveal the top card of your deck and put it into your hand. If that card is a Pokémon, draw 2 cards.'
  },
  {
    name: 'Synchro Dance',
    cost: [W],
    damage: 10,
    damageCalculation: '+',
    text: 'If Luvdisc and the Defending Pokémon have the same amount of Energy attached to them, this attack does 10 damage plus 20 more damage.'
  }];

  public set: string = 'GE';
  public cardImage: string = 'assets/cardback.png';
  public setNumber: string = '77';
  public name: string = 'Luvdisc';
  public fullName: string = 'Luvdisc GE';

  public reduceEffect(store: StoreLike, state: State, effect: Effect): State {
    // Rendezvous
    if (WAS_ATTACK_USED(effect, 0, this)) {
      const player = effect.player;
      const opponent = StateUtils.getOpponent(state, player);
      if (player.deck.cards.length === 0) {
        return state;
      }
      const topCard = player.deck.cards[0];
      SHOW_CARDS_TO_PLAYER(store, state, opponent, [topCard]);
      MOVE_CARDS(store, state, player.deck, player.hand, { cards: [topCard], sourceCard: this });
      if (topCard instanceof PokemonCard) {
        DRAW_CARDS(store, state, player, 2);
      }
    }

    // Synchro Dance
    if (WAS_ATTACK_USED(effect, 1, this)) {
      const player = effect.player;
      const opponent = effect.opponent;
      const checkSelf = new CheckProvidedEnergyEffect(player);
      store.reduceEffect(state, checkSelf);
      const checkOpp = new CheckProvidedEnergyEffect(opponent, opponent.active);
      store.reduceEffect(state, checkOpp);
      const selfCount = checkSelf.energyMap.reduce((sum, em) => sum + em.provides.length, 0);
      const oppCount = checkOpp.energyMap.reduce((sum, em) => sum + em.provides.length, 0);
      if (selfCount === oppCount) {
        effect.damage += 20;
      }
    }

    return state;
  }
}
