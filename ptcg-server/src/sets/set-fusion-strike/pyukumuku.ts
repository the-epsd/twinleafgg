import { PokemonCard, Stage, CardType, PowerType, State, StoreLike, CardList, GameError, GameMessage, Card } from '../../game';
import { Effect } from '../../game/store/effects/effect';
import { PowerEffect } from '../../game/store/effects/game-effects';


export class Pyukumuku extends PokemonCard {

  public stage: Stage = Stage.BASIC;

  public cardType: CardType = CardType.WATER;
  
  public hp = 80;
  
  public weakness = [{ type: CardType.LIGHTNING }];
  
  public retreat = [ CardType.COLORLESS ];

  public powers = [{
    name: 'Pitch a Pyukumuku',
    useFromHand: true,
    powerType: PowerType.ABILITY,
    text: 'Once during your turn, if this Pokémon is in your hand, you may reveal it and put it on the bottom of your deck. If you do, draw a card. You can\'t use more than 1 Pitch a Pyukumuku Ability each turn.'
  }];

  public attacks = [{
    name: ' Knuckle Punch',
    cost: [CardType.WATER, CardType.COLORLESS, CardType.COLORLESS],
    damage: 50,
    text: ''
  }];

  public set: string = 'FST';

  public cardImage: string = 'assets/cardback.png';

  public setNumber: string = '77';

  public name: string = 'Pyukumuku';

  public fullName: string = 'Pyukumuku FST';

  public reduceEffect(store: StoreLike, state: State, effect: Effect): State {

    if (effect instanceof PowerEffect && effect.power.name === 'Pitch a Pyukumuku') {
      const player = effect.player;

      const cards: Card[] = [this];
      const deckBottom = new CardList();

      if (player.deck.cards.length === 0) {
        throw new GameError(GameMessage.CANNOT_PLAY_THIS_CARD);
      }

      player.hand.moveCardsTo(cards, deckBottom);

      deckBottom.moveTo(player.deck);

      player.deck.moveTo(player.hand, 1);
    }

    return state;
  }

}
