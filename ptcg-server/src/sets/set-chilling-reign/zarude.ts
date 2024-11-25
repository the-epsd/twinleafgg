import { PokemonCard } from '../../game/store/card/pokemon-card';
import { Stage, CardType, SuperType } from '../../game/store/card/card-types';
import { StoreLike, State, ChooseCardsPrompt, GameMessage, ShuffleDeckPrompt } from '../../game';
import { Effect } from '../../game/store/effects/effect';
import { AttackEffect } from '../../game/store/effects/game-effects';
import { CheckProvidedEnergyEffect } from '../../game/store/effects/check-effects';

export class Zarude extends PokemonCard {
  public stage: Stage = Stage.BASIC;
  public cardType: CardType = CardType.GRASS;
  public hp: number = 130;
  public weakness = [{ type: CardType.FIRE }];
  public retreat = [CardType.COLORLESS, CardType.COLORLESS];

  public attacks = [{
    name: 'Pack Call',
    cost: [CardType.GRASS],
    damage: 0,
    text: 'Search your deck for a [G] Pokemon, reveal it, and put it into your hand. If you go second'
      + ' and it\'s your first turn, search for up to 3 [G] Pokemon instead of 1. Then, shuffle your deck.'
  },
  {
    name: 'Repeated Whip',
    cost: [CardType.COLORLESS, CardType.COLORLESS, CardType.COLORLESS],
    damage: 60,
    text: 'This attack does 20 more damage for each [G] Energy attached to this Pokemon.'
  }];

  public regulationMark: string = 'E';
  public set: string = 'CRE';
  public cardImage: string = 'assets/cardback.png';
  public setNumber: string = '19';
  public name: string = 'Zarude';
  public fullName: string = 'Zarude CRE';

  public reduceEffect(store: StoreLike, state: State, effect: Effect): State {

    if (effect instanceof AttackEffect && effect.attack === this.attacks[0]) {
      const turn = state.turn;

      if (turn == 2) {
        const player = effect.player;
        return store.prompt(state, new ChooseCardsPrompt(
          player,
          GameMessage.CHOOSE_CARD_TO_HAND,
          player.deck,
          { superType: SuperType.POKEMON, cardType: CardType.GRASS },
          { min: 0, max: 3, allowCancel: true }
        ), cards => {
          player.deck.moveCardsTo(cards, player.hand);

          return store.prompt(state, new ShuffleDeckPrompt(player.id), order => {
            player.deck.applyOrder(order);
          });
        });
      }

      if (turn > 2) {
        const player = effect.player;
        return store.prompt(state, new ChooseCardsPrompt(
          player,
          GameMessage.CHOOSE_CARD_TO_HAND,
          player.deck,
          { superType: SuperType.POKEMON, cardType: CardType.GRASS },
          { min: 0, max: 1, allowCancel: true }
        ), cards => {
          player.deck.moveCardsTo(cards, player.hand);

          return store.prompt(state, new ShuffleDeckPrompt(player.id), order => {
            player.deck.applyOrder(order);
          });
        });
      }
    }

    if (effect instanceof AttackEffect && effect.attack === this.attacks[1]) {
      const player = effect.player;

      const checkProvidedEnergyEffect = new CheckProvidedEnergyEffect(player);
      store.reduceEffect(state, checkProvidedEnergyEffect);

      let energyCount = 0;
      checkProvidedEnergyEffect.energyMap.forEach(em => {
        energyCount += em.provides.filter(cardType => {
          return cardType === CardType.GRASS;
        }).length;
      });
      effect.damage += energyCount * 20;
    }

    return state;
  }


}