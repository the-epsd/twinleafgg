import { PokemonCard } from '../../game/store/card/pokemon-card';
import { Stage, CardType, EnergyType, SuperType } from '../../game/store/card/card-types';
import { StoreLike } from '../../game/store/store-like';
import { State } from '../../game/store/state/state';
import { Effect } from '../../game/store/effects/effect';
import { AttackEffect } from '../../game/store/effects/game-effects';
import { Card, ChooseCardsPrompt, EnergyCard, GameMessage, ShuffleDeckPrompt, StateUtils } from '../..';
import { CheckProvidedEnergyEffect } from '../../game/store/effects/check-effects';

export class Victini extends PokemonCard {

  public stage: Stage = Stage.BASIC;

  public cardType: CardType = CardType.FIRE;

  public hp: number = 80;

  public weakness = [{ type: CardType.WATER }];

  public retreat = [CardType.COLORLESS];

  public attacks = [
    {
      name: 'Flippity Flap',
      cost: [CardType.COLORLESS],
      damage: 0,
      text: 'Shuffle your hand into your deck. Then, draw 6 cards.'
    },
    {
      name: 'Singe Off',
      cost: [CardType.FIRE],
      damage: 30,
      text: 'Discard a Special Energy from your opponent\'s Active Pokémon.'
    }
  ];

  public set: string = 'TEF';

  public regulationMark = 'H';

  public cardImage: string = 'assets/cardback.png';

  public setNumber: string = '30';

  public name: string = 'Victini';

  public fullName: string = 'Victini TEF';

  public reduceEffect(store: StoreLike, state: State, effect: Effect): State {

    if (effect instanceof AttackEffect && effect.attack === this.attacks[0]) {

      const player = effect.player;
      const cards = player.hand.cards.filter(c => c !== this);

      if (cards.length > 0) {
        player.hand.moveCardsTo(cards, player.deck);

        store.prompt(state, new ShuffleDeckPrompt(player.id), order => {
          player.deck.applyOrder(order);
        });
      }

      player.deck.moveTo(player.hand, 6);
      return state;
    }

    if (effect instanceof AttackEffect && effect.attack === this.attacks[1]) {

      const player = effect.player;
      const opponent = StateUtils.getOpponent(state, player);

      const oppActive = opponent.active;

      const checkEnergy = new CheckProvidedEnergyEffect(player, oppActive);
      store.reduceEffect(state, checkEnergy);

      checkEnergy.energyMap.forEach(em => {
        const energyCard = em.card;
        if (energyCard instanceof EnergyCard && energyCard.energyType === EnergyType.SPECIAL) {

          let cards: Card[] = [];
          store.prompt(state, new ChooseCardsPrompt(
            player,
            GameMessage.CHOOSE_CARD_TO_DISCARD,
            oppActive,
            { superType: SuperType.ENERGY, energyType: EnergyType.SPECIAL },
            { min: 1, max: 1, allowCancel: false }
          ), selected => {
            cards = selected;
          });
          oppActive.moveCardsTo(cards, opponent.discard);
        }
      });
    }
    return state;
  }
}