import { PokemonCard } from '../../game/store/card/pokemon-card';
import { Stage, CardType, SuperType, EnergyType } from '../../game/store/card/card-types';
import { StoreLike, State, GameMessage, ChooseCardsPrompt } from '../../game';
import { Effect } from '../../game/store/effects/effect';
import { AttackEffect } from '../../game/store/effects/game-effects';

export class Decidueye extends PokemonCard {

  public regulationMark = 'H';

  public stage: Stage = Stage.STAGE_2;

  public evolvesFrom = 'Dartrix';

  public cardType: CardType = CardType.GRASS;

  public hp: number = 150;

  public weakness = [{ type: CardType.FIRE }];

  public retreat = [CardType.COLORLESS, CardType.COLORLESS];

  public attacks = [
    {
      name: 'Stock Up on Feathers',
      cost: [CardType.COLORLESS],
      damage: 0,
      text: 'Draw cards until you have 7 cards in your hand.'
    },
    {
      name: 'Strong Shot',
      cost: [CardType.GRASS],
      damage: 170,
      text: 'Discard 1 Basic Grass Energy from your hand. If you can\'t, this attack does nothing.'
    }
  ];

  public set: string = 'SFA';

  public cardImage: string = 'assets/cardback.png';

  public setNumber: string = '5';

  public name: string = 'Decidueye';

  public fullName: string = 'Decidueye SFA';

  public reduceEffect(store: StoreLike, state: State, effect: Effect): State {

    if (effect instanceof AttackEffect && effect.attack === this.attacks[0]) {
      const player = effect.player;

      while (player.hand.cards.length < 7) {
        if (player.deck.cards.length === 0) {
          break;
        }
        player.deck.moveTo(player.hand, 1);
      }
    }

    if (effect instanceof AttackEffect && effect.attack === this.attacks[1]) {
      const player = effect.player;

      // Prompt player to choose cards to discard 
      return store.prompt(state, new ChooseCardsPrompt(
        player,
        GameMessage.CHOOSE_CARD_TO_DISCARD,
        player.hand,
        { superType: SuperType.ENERGY, energyType: EnergyType.BASIC, name: 'Grass Energy' },
        { allowCancel: false, min: 0, max: 1 }
      ), cards => {
        cards = cards || [];
        if (cards.length === 0) {
          effect.damage = 0;
          return state;
        }
        player.hand.moveCardsTo(cards, player.discard);
        return state;
      });
    }
    return state;
  }
}