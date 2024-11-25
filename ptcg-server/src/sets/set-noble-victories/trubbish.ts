import { PokemonCard } from '../../game/store/card/pokemon-card';
import { Stage, CardType } from '../../game/store/card/card-types';
import { StoreLike } from '../../game/store/store-like';
import { State } from '../../game/store/state/state';
import { Effect } from '../../game/store/effects/effect';
import { AttackEffect } from '../../game/store/effects/game-effects';
import { CardList, ChooseCardsPrompt, GameMessage } from '../../game';


export class Trubbish extends PokemonCard {

  public stage: Stage = Stage.BASIC;

  public cardType: CardType = CardType.PSYCHIC;

  public hp: number = 60;

  public weakness = [{ type: CardType.PSYCHIC }];

  public retreat = [CardType.COLORLESS];

  public attacks = [{
    name: 'Garbage Collection',
    cost: [CardType.COLORLESS],
    damage: 0,
    text: 'Put a card from your discard pile on top of your deck.'
  }, {
    name: 'Sludge Bomb',
    cost: [CardType.PSYCHIC, CardType.COLORLESS],
    damage: 20,
    text: ''
  }];

  public set: string = 'NVI';

  public name: string = 'Trubbish';

  public fullName: string = 'Trubbish NVI';

  public cardImage: string = 'assets/cardback.png';

  public setNumber: string = '48';

  public reduceEffect(store: StoreLike, state: State, effect: Effect): State {

    if (effect instanceof AttackEffect && effect.attack === this.attacks[0]) {
      const player = effect.player;
      const deckTop = new CardList();

      state = store.prompt(state, new ChooseCardsPrompt(
        player,
        GameMessage.CHOOSE_CARD_TO_HAND,
        player.discard,
        {},
        { min: 1, max: 1, allowCancel: false }
      ), selected => {
        const cards = selected || [];

        if (cards === null) {
          return state;
        }

        player.discard.moveCardsTo(cards, deckTop);

        deckTop.moveToTopOfDestination(player.deck);
      });
    }
    return state;
  }

}
