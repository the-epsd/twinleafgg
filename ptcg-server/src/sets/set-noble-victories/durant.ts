import { PokemonCard } from '../../game/store/card/pokemon-card';
import { Stage, CardType } from '../../game/store/card/card-types';
import { StoreLike, State, StateUtils, PlayerType } from '../../game';

import { Effect } from '../../game/store/effects/effect';
import { MOVE_CARDS, WAS_ATTACK_USED } from '../../game/store/prefabs/prefabs';

export class Durant extends PokemonCard {

  public stage: Stage = Stage.BASIC;

  public cardType: CardType = CardType.METAL;

  public hp: number = 70;

  public weakness = [{ type: CardType.FIRE }];

  public resistance = [{ type: CardType.PSYCHIC, value: -20 }];

  public retreat = [CardType.COLORLESS];

  public attacks = [
    {
      name: 'Devour',
      cost: [CardType.METAL],
      damage: 0,
      text: 'For each of your Durant in play, discard the top card of your ' +
        'opponent\'s deck.'
    },
    {
      name: 'Vice Grip',
      cost: [CardType.COLORLESS, CardType.COLORLESS],
      damage: 30,
      text: ''
    },
  ];

  public set: string = 'NVI';

  public name: string = 'Durant';

  public fullName: string = 'Durant NVI';

  public cardImage: string = 'assets/cardback.png';

  public setNumber: string = '83';

  public reduceEffect(store: StoreLike, state: State, effect: Effect): State {
    if (WAS_ATTACK_USED(effect, 0, this)) {
      const player = effect.player;
      const opponent = StateUtils.getOpponent(state, player);

      let durantsInPlay = 0;
      player.forEachPokemon(PlayerType.BOTTOM_PLAYER, (cardList, card, target) => {
        if (card.name === this.name) {
          durantsInPlay++;
        }
      });

      MOVE_CARDS(store, state, opponent.deck, opponent.discard, { count: durantsInPlay, sourceCard: this, sourceEffect: this.attacks[0] });
    }

    return state;
  }

}
