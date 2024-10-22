import { PokemonCard, Stage, CardType, PowerType, State, StoreLike, GameError, GameMessage, CardList } from '../../game';
import { Effect } from '../../game/store/effects/effect';
import { PowerEffect } from '../../game/store/effects/game-effects';
import { EndTurnEffect } from '../../game/store/effects/game-phase-effects';


export class Pyukumuku extends PokemonCard {

  public stage: Stage = Stage.BASIC;

  public cardType: CardType = CardType.WATER;

  public hp = 80;

  public weakness = [{ type: CardType.LIGHTNING }];

  public retreat = [CardType.COLORLESS];

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

  public regulationMark = 'E';

  public cardImage: string = 'assets/cardback.png';

  public setNumber: string = '77';

  public name: string = 'Pyukumuku';

  public fullName: string = 'Pyukumuku FST';

  public readonly PYUK_MARKER = 'PYUK_MARKER';

  public reduceEffect(store: StoreLike, state: State, effect: Effect): State {

    if (effect instanceof EndTurnEffect && effect.player.marker.hasMarker(this.PYUK_MARKER, this)) {
      effect.player.marker.removeMarker(this.PYUK_MARKER, this);
    }

    if (effect instanceof PowerEffect && effect.power === this.powers[0]) {
      const player = effect.player;

      if (player.marker.hasMarker(this.PYUK_MARKER, this)) {
        throw new GameError(GameMessage.CANNOT_USE_POWER);
      }

      const deckBottom = new CardList();
      player.marker.addMarker(this.PYUK_MARKER, this);
      player.hand.moveCardTo(this, deckBottom);
      deckBottom.moveTo(player.deck);
      player.deck.moveTo(player.hand, 1);
    }

    return state;
  }

}
