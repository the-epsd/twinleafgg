import { PokemonCard } from '../../game/store/card/pokemon-card';
import { Stage, CardType } from '../../game/store/card/card-types';
import { StoreLike } from '../../game/store/store-like';
import { State } from '../../game/store/state/state';
import { Effect } from '../../game/store/effects/effect';
import { COIN_FLIP_PROMPT, WAS_ATTACK_USED } from '../../game/store/prefabs/prefabs';
import { DISCARD_X_ENERGY_FROM_THIS_POKEMON } from '../../game/store/prefabs/costs';
import { YOUR_OPPPONENTS_ACTIVE_POKEMON_IS_NOW_PARALYZED } from '../../game/store/prefabs/attack-effects';

export class Zeraora extends PokemonCard {

  public stage: Stage = Stage.BASIC;
  public cardType: CardType = L;
  public hp: number = 120;
  public weakness = [{ type: F }];
  public retreat = [C];

  public attacks = [
    {
      name: 'Shocking Knuckle',
      cost: [C],
      damage: 20,
      text: 'Flip a coin. If heads, your opponent\'s Active Pokémon is now Paralyzed.'
    },
    {
      name: 'Strong Volt',
      cost: [L, L, C],
      damage: 120,
      text: 'Discard an Energy from this Pokémon.'
    }
  ];

  public set: string = 'TEF';
  public regulationMark = 'H';
  public cardImage: string = 'assets/cardback.png';
  public setNumber: string = '57';
  public name: string = 'Zeraora';
  public fullName: string = 'Zeraora TEF';

  public reduceEffect(store: StoreLike, state: State, effect: Effect): State {

    if (WAS_ATTACK_USED(effect, 0, this)) {

      const player = effect.player;
      COIN_FLIP_PROMPT(store, state, player, flipResult => {
        if (flipResult) {
          YOUR_OPPPONENTS_ACTIVE_POKEMON_IS_NOW_PARALYZED(store, state, effect);
        }
      });
      return state;
    }

    if (WAS_ATTACK_USED(effect, 1, this)) {
      DISCARD_X_ENERGY_FROM_THIS_POKEMON(store, state, effect, 1);
    }
    return state;
  }
}