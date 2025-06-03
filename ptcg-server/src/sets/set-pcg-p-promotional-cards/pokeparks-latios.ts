import { PokemonCard } from '../../game/store/card/pokemon-card';
import { Stage, CardType } from '../../game/store/card/card-types';
import { StoreLike } from '../../game/store/store-like';
import { State } from '../../game/store/state/state';
import { Effect } from '../../game/store/effects/effect';
import { COIN_FLIP_PROMPT, WAS_ATTACK_USED } from '../../game/store/prefabs/prefabs';
import { YOUR_OPPPONENTS_ACTIVE_POKEMON_IS_NOW_PARALYZED } from '../../game/store/prefabs/attack-effects';
import { DISCARD_X_ENERGY_FROM_THIS_POKEMON } from '../../game/store/prefabs/costs';

export class PokeParksLatios extends PokemonCard {
  public stage: Stage = Stage.BASIC;
  public cardType: CardType = P;
  public hp: number = 80;
  public weakness = [{ type: P }];
  public retreat = [C, C];

  public attacks = [{
    name: 'Dragon Breath',
    cost: [G, C],
    damage: 30,
    text: 'Flip a coin. If heads, your opponent\'s Active Pokémon is now Paralyzed.If tails, this attack does nothing.'
  },
  {
    name: 'Luster Purge',
    cost: [L, C, C],
    damage: 60,
    text: 'Discard 3 Energy attached to this Pokémon.'
  }];

  public set: string = 'PCGP';
  public name: string = 'PokéPark\'s Latios';
  public fullName: string = 'PokéPark\'s Latios PCGP';
  public cardImage: string = 'assets/cardback.png';
  public setNumber: string = '45';

  public reduceEffect(store: StoreLike, state: State, effect: Effect): State {

    if (WAS_ATTACK_USED(effect, 0, this)) {
      COIN_FLIP_PROMPT(store, state, effect.player, result => {
        if (result) {
          YOUR_OPPPONENTS_ACTIVE_POKEMON_IS_NOW_PARALYZED(store, state, effect);
        } else {
          effect.damage = 0;
        }
      });
    }

    if (WAS_ATTACK_USED(effect, 1, this)) {
      DISCARD_X_ENERGY_FROM_THIS_POKEMON(store, state, effect, 3);
    }

    return state;
  }

}
