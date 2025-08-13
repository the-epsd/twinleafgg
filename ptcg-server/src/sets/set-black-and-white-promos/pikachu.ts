import { PokemonCard } from '../../game/store/card/pokemon-card';
import { Stage, CardType } from '../../game/store/card/card-types';
import { StoreLike, State } from '../../game';
import { COIN_FLIP_PROMPT, THIS_ATTACK_DOES_X_MORE_DAMAGE, WAS_ATTACK_USED } from '../../game/store/prefabs/prefabs';
import { Effect } from '../../game/store/effects/effect';

export class Pikachu extends PokemonCard {

  public stage: Stage = Stage.BASIC;
  public cardType: CardType = CardType.LIGHTNING;
  public hp: number = 60;
  public weakness = [{ type: CardType.FIGHTING }];
  public retreat = [CardType.COLORLESS];

  public attacks = [
    {
      name: 'Quick Attack',
      cost: [CardType.LIGHTNING],
      damage: 10,
      text: 'Flip a coin. If heads, this attack does 10 more damage.'
    },
    {
      name: 'Electro Ball',
      cost: [CardType.LIGHTNING, CardType.LIGHTNING, CardType.COLORLESS],
      damage: 50,
      text: ''
    }
  ];

  public set: string = 'BWP';
  public fullName: string = 'Pikachu BWP';
  public name: string = 'Pikachu';
  public setNumber: string = '54';
  public cardImage: string = 'assets/cardback.png';

  public reduceEffect(store: StoreLike, state: State, effect: Effect): State {
    if (WAS_ATTACK_USED(effect, 0, this)) {
      return COIN_FLIP_PROMPT(store, state, effect.player, result => {
        if (result) {
          THIS_ATTACK_DOES_X_MORE_DAMAGE(effect, store, state, 10);
        }
      });
    }
    return state;
  }
}
