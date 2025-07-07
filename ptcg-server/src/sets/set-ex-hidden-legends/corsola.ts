import { PokemonCard } from '../../game/store/card/pokemon-card';
import { Stage, CardType } from '../../game/store/card/card-types';
import { PlayerType, State, StoreLike } from '../../game';
import { Effect } from '../../game/store/effects/effect';
import { DRAW_UP_TO_X_CARDS, WAS_ATTACK_USED } from '../../game/store/prefabs/prefabs';

export class Corsola extends PokemonCard {
  public stage: Stage = Stage.BASIC;
  public cardType: CardType = W;
  public hp: number = 70;
  public weakness = [{ type: G }];
  public retreat = [C];

  public attacks = [{
    name: 'Coral Glow',
    cost: [C],
    damage: 0,
    text: 'Draw a number of cards up to the number of your opponent\'s Basic Pokémon in play. (You can\'t have more than 10 cards in your hand in this way.)'
  },
  {
    name: 'Surf',
    cost: [W, C, C],
    damage: 40,
    text: ''
  }];

  public set: string = 'HL';
  public cardImage: string = 'assets/cardback.png';
  public setNumber: string = '32';
  public name: string = 'Corsola';
  public fullName: string = 'Corsola HL';

  public reduceEffect(store: StoreLike, state: State, effect: Effect): State {

    if (WAS_ATTACK_USED(effect, 0, this)) {
      const player = effect.player;
      const opponent = effect.opponent;

      let cardsToDraw = 0;
      opponent.forEachPokemon(PlayerType.TOP_PLAYER, (cardList, card, target) => {
        if (card.stage === Stage.BASIC) {
          cardsToDraw++;
        }
      });
      cardsToDraw = Math.min(cardsToDraw, 10 - player.hand.cards.length);

      DRAW_UP_TO_X_CARDS(store, state, player, cardsToDraw);
    }

    return state;
  }
}
