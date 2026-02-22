import { PokemonCard } from '../../game/store/card/pokemon-card';
import { Stage, CardType } from '../../game/store/card/card-types';
import { StoreLike, State, StateUtils, PlayerType } from '../../game';

import { Effect } from '../../game/store/effects/effect';
import { MOVE_CARDS, WAS_ATTACK_USED } from '../../game/store/prefabs/prefabs';

export class Durant extends PokemonCard {
  public stage: Stage = Stage.BASIC;
  public cardType: CardType = CardType.GRASS;
  public hp: number = 90;
  public weakness = [{ type: CardType.FIRE }];
  public resistance = [];
  public retreat = [CardType.COLORLESS];

  public attacks = [{
    name: 'Vise Grip',
    cost: [CardType.GRASS],
    damage: 20,
    text: ''
  },
  {
    name: 'Devour',
    cost: [CardType.COLORLESS, CardType.COLORLESS],
    damage: 0,
    text: 'For each of your Durant in play, discard the top card of ' +
      'your opponent\'s deck.'
  }];

  public regulationMark = 'E';
  public set: string = 'BST';
  public cardImage: string = 'assets/cardback.png';
  public setNumber: string = '10';
  public name: string = 'Durant';
  public fullName: string = 'Durant BST';

  public reduceEffect(store: StoreLike, state: State, effect: Effect): State {
    if (WAS_ATTACK_USED(effect, 1, this)) {
      const player = effect.player;
      const opponent = StateUtils.getOpponent(state, player);

      let durantsInPlay = 0;

      player.forEachPokemon(PlayerType.BOTTOM_PLAYER, (cardList, card, target) => {
        if (card.name === this.name) {
          durantsInPlay++;
        }
      });

      MOVE_CARDS(store, state, opponent.deck, opponent.discard, { count: durantsInPlay, sourceCard: this, sourceEffect: this.attacks[1] });
    }
    return state;
  }
}
