import { PokemonCard } from '../../game/store/card/pokemon-card';
import { Stage, CardType, TrainerType } from '../../game/store/card/card-types';
import { StoreLike, State, TrainerCard } from '../../game';
import { Effect } from '../../game/store/effects/effect';
import { WAS_ATTACK_USED } from '../../game/store/prefabs/prefabs';
import { PUT_X_CARDS_FROM_YOUR_DISCARD_PILE_INTO_YOUR_HAND } from '../../game/store/prefabs/attack-effects';

export class Lillipup extends PokemonCard {

  public stage: Stage = Stage.BASIC;

  public cardType: CardType = CardType.COLORLESS;

  public hp: number = 60;

  public weakness = [ { type: CardType.FIGHTING } ];

  public retreat = [ CardType.COLORLESS ];

  public attacks = [
    {
      name: 'Pickup',
      cost: [ CardType.COLORLESS ],
      damage: 0,
      text: 'Put an Item card from your discard pile into your hand.'
    },
    {
      name: 'Bite',
      cost: [ CardType.COLORLESS ],
      damage: 10,
      text: ''
    }
  ];

  public set: string = 'BLW';

  public name: string = 'Lillipup';

  public fullName: string = 'Lillipup BLW';

  public cardImage: string = 'assets/cardback.png';

  public setNumber: string = '80';

  public reduceEffect(store: StoreLike, state: State, effect: Effect): State {
    if (WAS_ATTACK_USED(effect, 0, this)) {
      PUT_X_CARDS_FROM_YOUR_DISCARD_PILE_INTO_YOUR_HAND(
        1, 
        c => c instanceof TrainerCard && c.trainerType === TrainerType.ITEM, 
        store, 
        state, 
        effect
      );
    }
    return state;
  }

}

// <3