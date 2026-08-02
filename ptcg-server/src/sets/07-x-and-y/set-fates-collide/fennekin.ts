import { PokemonCard } from '../../../game/store/card/pokemon-card';
import { Stage, CardType } from '../../../game/store/card/card-types';
import { StoreLike } from '../../../game/store/store-like';
import { State } from '../../../game/store/state/state';
import { Effect } from '../../../game/store/effects/effect';
import { COIN_FLIP_PROMPT, DEFENDING_POKEMON_CANNOT_ATTACK, WAS_ATTACK_USED } from '../../../game/store/prefabs/prefabs';

export class Fennekin extends PokemonCard {
  public stage: Stage = Stage.BASIC;
  public cardType: CardType = CardType.FIRE;
  public hp: number = 60;
  public weakness = [{ type: CardType.FIRE }];
  public retreat = [CardType.COLORLESS];

  public attacks = [{
    name: 'Will-O-Wisp',
    cost: [CardType.FIRE],
    damage: 10,
    text: ''
  },
  {
    name: 'Tail Whip',
    cost: [CardType.COLORLESS, CardType.COLORLESS],
    damage: 0,
    text: 'Fliip a coin. If heads, the Defending Pokemon can\'t attack during your opponent\'s next turn.'
  }];

  public set: string = 'FCO';
  public setNumber: string = '10';
  public cardImage: string = 'assets/cardback.png';
  public name: string = 'Fennekin';
  public fullName: string = 'Fennekin FCO';

  public reduceEffect(store: StoreLike, state: State, effect: Effect): State {
    // Tail Whip (index 1) — batch coinFlip was false but attack text requires a flip
    if (WAS_ATTACK_USED(effect, 1, this)) {
      COIN_FLIP_PROMPT(store, state, effect.player, result => {
        if (result) {
          DEFENDING_POKEMON_CANNOT_ATTACK(store, state, effect, this);
        }
      });
    }

    return state;
  }
}
