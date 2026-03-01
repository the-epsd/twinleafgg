import { YOUR_OPPPONENTS_ACTIVE_POKEMON_IS_NOW_PARALYZED } from '../../game/store/prefabs/attack-effects';
import { ADD_POISON_TO_PLAYER_ACTIVE, AFTER_ATTACK, COIN_FLIP_PROMPT, WAS_ATTACK_USED } from '../../game/store/prefabs/prefabs';
import { CardType, Stage } from '../../game/store/card/card-types';
import { PokemonCard } from '../../game/store/card/pokemon-card';
import { Effect } from '../../game/store/effects/effect';
import { State, StoreLike } from '../../game';
export class Frillish extends PokemonCard {
  public stage: Stage = Stage.BASIC;
  public cardType: CardType = W;
  public hp: number = 80;
  public weakness = [{ type: L }];
  public retreat = [C, C];

  public attacks = [
    {
      name: 'Bubble',
      cost: [C],
      damage: 0,
      text: 'Flip a coin. If heads, the Defending Pokémon is now Paralyzed.'
    },
    {
      name: 'Spit Poison',
      cost: [W, C],
      damage: 0,
      text: 'The Defending Pokémon is now Poisoned.'
    }
  ];

  public set: string = 'NXD';
  public setNumber: string = '34';
  public cardImage: string = 'assets/cardback.png';
  public name: string = 'Frillish';
  public fullName: string = 'Frillish NXD';

  public reduceEffect(store: StoreLike, state: State, effect: Effect): State {
    // Bubble
    if (WAS_ATTACK_USED(effect, 0, this)) {
      return COIN_FLIP_PROMPT(store, state, effect.player, result => {
        if (result) {
          YOUR_OPPPONENTS_ACTIVE_POKEMON_IS_NOW_PARALYZED(store, state, effect);
        }
      });
    }

    // Spit Poison
    if (AFTER_ATTACK(effect, 1, this)) {
      ADD_POISON_TO_PLAYER_ACTIVE(store, state, effect.opponent, this);
    }

    return state;
  }
}
