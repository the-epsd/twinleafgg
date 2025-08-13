import { StateUtils } from '../../game';
import { CardType, Stage } from '../../game/store/card/card-types';
import { PokemonCard } from '../../game/store/card/pokemon-card';
import { Attack } from '../../game/store/card/pokemon-types';
import { Effect } from '../../game/store/effects/effect';
import { ADD_CONFUSION_TO_PLAYER_ACTIVE, AFTER_ATTACK, COIN_FLIP_PROMPT } from '../../game/store/prefabs/prefabs';
import { State } from '../../game/store/state/state';
import { StoreLike } from '../../game/store/store-like';

export class Vulpix extends PokemonCard {

  public name = 'Vulpix';

  public cardImage: string = 'assets/cardback.png';

  public setNumber = '68';

  public set = 'BS';

  public fullName = 'Vulpix BS';

  public cardType = CardType.FIRE;

  public stage = Stage.BASIC;

  public evolvesInto = ['Ninetales', 'Ninetales ex', 'Light Ninetales'];

  public hp = 50;

  public weakness = [{ type: CardType.WATER }];

  public retreat = [CardType.COLORLESS];

  public attacks: Attack[] = [
    {
      name: 'Confuse Ray',
      cost: [CardType.FIRE, CardType.FIRE],
      damage: 10,
      text: 'Flip a coin. If heads, the Defending Pokémon is now Confused.'
    }
  ];

  public reduceEffect(store: StoreLike, state: State, effect: Effect): State {

    if (AFTER_ATTACK(effect, 0, this)) {
      COIN_FLIP_PROMPT(store, state, effect.player, (result) => {
        if (result) {
          ADD_CONFUSION_TO_PLAYER_ACTIVE(store, state, StateUtils.getOpponent(state, effect.player), this)
        }
      });
    }

    return state;
  }

}
