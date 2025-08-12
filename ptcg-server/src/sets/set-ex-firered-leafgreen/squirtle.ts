import { PokemonCard } from '../../game/store/card/pokemon-card';
import { Stage, CardType } from '../../game/store/card/card-types';
import { StoreLike } from '../../game/store/store-like';
import { State } from '../../game/store/state/state';
import { Effect } from '../../game/store/effects/effect';
import { ADD_PARALYZED_TO_PLAYER_ACTIVE, AFTER_ATTACK, COIN_FLIP_PROMPT, SWITCH_ACTIVE_WITH_BENCHED } from '../../game/store/prefabs/prefabs';

export class Squirtle extends PokemonCard {
  public stage: Stage = Stage.BASIC;
  public cardType: CardType = W;
  public hp: number = 50;
  public weakness = [{ type: L }];
  public retreat = [C];

  public attacks = [{
    name: 'Bubble',
    cost: [C],
    damage: 0,
    text: 'Flip a coin. If heads, the Defending Pokémon is now Paralyzed.'
  },
  {
    name: 'Smash Turn',
    cost: [W, C],
    damage: 20,
    text: 'After your attack, you may switch Squirtle with 1 of your Benched Pokémon.'
  }];

  public set: string = 'RG';
  public cardImage: string = 'assets/cardback.png';
  public setNumber: string = '83';
  public name: string = 'Squirtle';
  public fullName: string = 'Squirtle RG';

  public reduceEffect(store: StoreLike, state: State, effect: Effect): State {

    if (AFTER_ATTACK(effect, 0, this)) {
      COIN_FLIP_PROMPT(store, state, effect.player, result => {
        if (result) {
          ADD_PARALYZED_TO_PLAYER_ACTIVE(store, state, effect.opponent, this);
        }
      });
    }

    if (AFTER_ATTACK(effect, 1, this)) {
      const player = effect.player;
      SWITCH_ACTIVE_WITH_BENCHED(store, state, player);
    }

    return state;
  }

}