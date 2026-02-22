import { PokemonCard } from '../../game/store/card/pokemon-card';
import { Stage, CardType, SuperType, EnergyType } from '../../game/store/card/card-types';
import { PowerType } from '../../game/store/card/pokemon-types';
import { StoreLike, State, GameError, GameMessage, ChooseCardsPrompt, Card, ShuffleDeckPrompt } from '../../game';
import { Effect } from '../../game/store/effects/effect';

import { MOVE_CARDS, WAS_ATTACK_USED, WAS_POWER_USED } from '../../game/store/prefabs/prefabs';

export class Feraligatr extends PokemonCard {
  public stage: Stage = Stage.BASIC;
  public cardType: CardType = CardType.WATER;
  public hp: number = 160;
  public weakness = [{ type: CardType.GRASS }];
  public retreat = [CardType.COLORLESS, CardType.COLORLESS, CardType.COLORLESS];
  public evolvesFrom = 'Croconaw';

  public powers = [{
    name: 'Downpour',
    useWhenInPlay: true,
    powerType: PowerType.ABILITY,
    text: 'As often as you like during your turn (before your attack), you may discard a [W] Energy card from your hand. '
  }];

  public attacks = [{
    name: 'Riptide',
    cost: [CardType.WATER, CardType.WATER],
    damage: 10,
    text: 'This attack does 20 more damage for each [W] Energy card in your discard pile. Then, shuffle those cards into your deck.'
  }];

  public set: string = 'DRM';
  public cardImage: string = 'assets/cardback.png';
  public setNumber: string = '24';
  public name: string = 'Feraligatr';
  public fullName: string = 'Feraligatr DRM';

  public reduceEffect(store: StoreLike, state: State, effect: Effect): State {

    if (WAS_POWER_USED(effect, 0, this)) {
      const player = effect.player;

      const hasEnergyInHand = player.hand.cards.some(c => {
        return c.superType === SuperType.ENERGY && c.name === 'Water Energy';
      });

      if (!hasEnergyInHand) {
        throw new GameError(GameMessage.CANNOT_USE_POWER);
      }

      state = store.prompt(state, new ChooseCardsPrompt(
        player,
        GameMessage.CHOOSE_CARD_TO_DISCARD,
        player.hand,
        { superType: SuperType.ENERGY, energyType: EnergyType.BASIC, name: 'Water Energy' },
        { allowCancel: true }
      ), cards => {
        cards = cards || [];
        if (cards.length === 0) {
          return;
        }

        MOVE_CARDS(store, state, player.hand, player.discard, { cards: cards, sourceCard: this, sourceEffect: this.powers[0] });

      });
      return state;
    }

    if (WAS_ATTACK_USED(effect, 0, this)) {
      const player = effect.player;

      let energyInDiscard: number = 0;
      const blocked: number[] = [];
      const basicEnergyCards: Card[] = [];
      player.discard.cards.forEach((c, index) => {
        const isBasicWaterEnergy = c.superType === SuperType.ENERGY && c.energyType === EnergyType.BASIC && c.name === 'Water Energy';
        if (isBasicWaterEnergy) {
          energyInDiscard += 1;
          basicEnergyCards.push(c);
        } else {
          blocked.push(index);
        }
      });

      effect.damage += energyInDiscard * 20;

      player.discard.cards.forEach(cards => {
        if (cards.superType === SuperType.ENERGY && cards.energyType === EnergyType.BASIC && cards.name === 'Water Energy') {
          MOVE_CARDS(store, state, player.discard, player.deck, { cards: basicEnergyCards, sourceCard: this, sourceEffect: this.attacks[0] });
        }
      });

      return store.prompt(state, new ShuffleDeckPrompt(player.id), order => {
        player.deck.applyOrder(order);
      });

    }

    return state;
  }
}