import { CardType, Stage } from '../../game/store/card/card-types';
import { PokemonCard } from '../../game/store/card/pokemon-card';
import { Effect } from '../../game/store/effects/effect';
import { PUT_X_DAMAGE_COUNTERS_ON_YOUR_OPPONENTS_ACTIVE_POKEMON } from '../../game/store/prefabs/attack-effects';
import { COIN_FLIP_PROMPT, OPPONENTS_POKEMON_CANNOT_USE_THAT_ATTACK, WAS_ATTACK_USED } from '../../game/store/prefabs/prefabs';
import { State } from '../../game/store/state/state';
import { StoreLike } from '../../game/store/store-like';

export class Shuppet extends PokemonCard {
  public stage: Stage = Stage.BASIC;
  public cardType: CardType = P;
  public hp: number = 60;
  public weakness = [{ type: D }];
  public resistance = [{ type: C, value: -30 }];
  public retreat = [C];

  public attacks = [{
    name: 'Disable',
    cost: [C],
    damage: 10,
    text: 'Flip a coin. If heads, choose 1 of the Defending Pokémon\'s attacks. That Pokémon can\'t use that attack during your opponent\'s next turn.'
  },
  {
    name: 'Haunt',
    cost: [P],
    damage: 0,
    text: 'Put 1 damage counter on the Defending Pokémon.'
  }];

  public set: string = 'TM';
  public cardImage: string = 'assets/cardback.png';
  public setNumber: string = '75';
  public name: string = 'Shuppet';
  public fullName: string = 'Shuppet TM';

  public reduceEffect(store: StoreLike, state: State, effect: Effect): State {
    if (WAS_ATTACK_USED(effect, 0, this)) {
      const player = effect.player;
      COIN_FLIP_PROMPT(store, state, player, result => {
        if (result) {
          OPPONENTS_POKEMON_CANNOT_USE_THAT_ATTACK(store, state, effect, this);
        }
      });

      return state;
    }

    if (WAS_ATTACK_USED(effect, 1, this)) {
      PUT_X_DAMAGE_COUNTERS_ON_YOUR_OPPONENTS_ACTIVE_POKEMON(1, store, state, effect);
    }

    return state;
  }
}
