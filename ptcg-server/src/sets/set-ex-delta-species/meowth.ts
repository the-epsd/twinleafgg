import { PokemonCard, State, StoreLike, SuperType } from '../../game';
import { Effect } from '../../game/store/effects/effect';
import { AFTER_ATTACK, SEARCH_DISCARD_PILE_FOR_CARDS_TO_HAND } from '../../game/store/prefabs/prefabs';

export class Meowth extends PokemonCard {

  public cardType = C;
  public hp = 50;
  public weakness = [{ type: F }];
  public retreat = [C];

  public attacks = [
    {
      name: 'Pickup Power',
      cost: [C],
      damage: 0,
      text: 'Put an Energy card from your discard pile into your hand.'
    },
    {
      name: 'Bite',
      cost: [C],
      damage: 10,
      text: ''
    }
  ];

  public set = 'DS';
  public setNumber = '77';
  public cardImage = 'assets/cardback.png';
  public name = 'Meowth';
  public fullName = 'Meowth DS';

  public reduceEffect(store: StoreLike, state: State, effect: Effect): State {

    if (AFTER_ATTACK(effect, 0, this)) {
      SEARCH_DISCARD_PILE_FOR_CARDS_TO_HAND(store, state, effect.player, this, { superType: SuperType.ENERGY }, { min: 0, max: 1, allowCancel: false }, this.attacks[0]);
    }

    return state;
  }
}