import { PokemonCard } from '../../../game/store/card/pokemon-card';
import { CardType, Stage } from '../../../game/store/card/card-types';
import { State, StoreLike } from '../../../game';
import { Effect } from '../../../game/store/effects/effect';
import { COIN_FLIP_PROMPT, WAS_ATTACK_USED } from '../../../game/store/prefabs/prefabs';
import { YOUR_OPPPONENTS_ACTIVE_POKEMON_IS_NOW_POISIONED } from '../../../game/store/prefabs/attack-effects';

export class Shroomish extends PokemonCard {
  public stage: Stage = Stage.BASIC;
  public hp: number = 50;
  public cardType: CardType[] = [G];
  public weakness = [{ type: R, value: 10 }];
  public resistance = [{ type: W, value: -20 }];
  public retreat = [C];

  public attacks = [{
    name: 'Headbutt',
    cost: [C],
    damage: 10,
    text: ''
  },
{
    name: 'Toxic Spore',
    cost: [G, C],
    damage: 20,
    text: 'Flip a coin. If heads, the Defending Pokémon is now Poisoned.'
  }];

  public set: string = 'SW';
  public cardImage: string = 'assets/cardback.png';
  public setNumber: string = '108';
  public name: string = 'Shroomish';
  public fullName: string = 'Shroomish SW';

  public reduceEffect(store: StoreLike, state: State, effect: Effect): State {
    // Toxic Spore
    if (WAS_ATTACK_USED(effect, 1, this)) {
      const player = effect.player;
      COIN_FLIP_PROMPT(store, state, player, result => {
        if (result) {
          YOUR_OPPPONENTS_ACTIVE_POKEMON_IS_NOW_POISIONED(store, state, effect);
        }
      });
    }

    return state;
  }
}
