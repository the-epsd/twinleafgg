import { PokemonCard } from '../../../game/store/card/pokemon-card';
import { CardType, Stage } from '../../../game/store/card/card-types';
import { State, StoreLike } from '../../../game';
import { Effect } from '../../../game/store/effects/effect';
import { BLOCK_RETREAT } from '../../../game/store/prefabs/effect-of-attack-prefabs';
import { MULTIPLE_COIN_FLIPS_PROMPT, WAS_ATTACK_USED } from '../../../game/store/prefabs/prefabs';

export class Pinsir extends PokemonCard {
  public stage: Stage = Stage.BASIC;
  public hp: number = 80;
  public cardType: CardType[] = [G];
  public weakness = [{ type: R, value: +20 }];
  public retreat = [C];

  public attacks = [{
    name: 'Grip and Squeeze',
    cost: [G],
    damage: 20,
    text: 'The Defending Pokémon can\'t retreat during your opponent\'s next turn.'
  },
  {
    name: 'Power Guillotine',
    cost: [G, C, C],
    damage: 100,
    text: 'Flip 2 coins. If either of them is tails, this attack\'s base damage is 10 instead of 100.'
  }];

  public set: string = 'SW';
  public cardImage: string = 'assets/cardback.png';
  public setNumber: string = '59';
  public name: string = 'Pinsir';
  public fullName: string = 'Pinsir SW';

  public reduceEffect(store: StoreLike, state: State, effect: Effect): State {
    // Grip and Squeeze
    if (WAS_ATTACK_USED(effect, 0, this)) {
      return BLOCK_RETREAT(store, state, effect, this);
    }

    // Power Guillotine
    if (WAS_ATTACK_USED(effect, 1, this)) {
      MULTIPLE_COIN_FLIPS_PROMPT(store, state, effect.player, 2, results => {
        if (results.some(r => !r)) {
          effect.damage = 10;
        }
      });
    }

    return state;
  }
}
