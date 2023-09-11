import { PokemonCard } from '../../game/store/card/pokemon-card';
import { Stage, CardType } from '../../game/store/card/card-types';
import { StoreLike } from '../../game/store/store-like';
import { State } from '../../game/store/state/state';
import { Effect } from '../../game/store/effects/effect';
import { PowerType } from '../../game/store/card/pokemon-types';
import { PowerEffect } from '../../game/store/effects/game-effects';
import { CardList } from '../../game';

export class Skwovet extends PokemonCard {

  public regulationMark = 'G';

  public stage: Stage = Stage.BASIC;

  public cardType: CardType = CardType.COLORLESS;

  public hp: number = 60;

  public weakness = [{ type: CardType.FIGHTING }];

  public retreat = [ CardType.COLORLESS ];

  public powers = [{
    name: 'Nest Stash',
    useWhenInPlay: true,
    powerType: PowerType.ABILITY,
    text: 'Once during your turn, you may shuffle your hand and put ' +
      'it on the bottom of your deck. If you put any cards on the ' +
      'bottom of your deck in this way, draw a card.'
  }];

  public attacks = [{
    name: 'Bite',
    cost: [ CardType.COLORLESS, CardType.COLORLESS ],
    damage: 20,
    text: ''
  }];

  public set: string = 'SVI';

  public name: string = 'Skwovet';

  public fullName: string = 'Skwovet SVI';

  public reduceEffect(store: StoreLike, state: State, effect: Effect): State {

    if (effect instanceof PowerEffect && effect.power === this.powers[0]) {
    
      const player = effect.player;
      const cards = player.hand.cards.filter(c => c !== this);
    
      // Create deckTop and move hand into it
      const deckTop = new CardList();
      player.hand.moveTo(deckTop, cards.length);
    
      // Later, move deckTop to player's deck
    
      deckTop.moveTo(player.deck, cards.length);
    
      player.deck.moveTo(player.hand, 1);
  
      return state;
    }
    return state;
  }

}