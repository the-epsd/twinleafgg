import { PokemonCard } from '../../game/store/card/pokemon-card';
import { Stage, CardType, CardTag } from '../../game/store/card/card-types';
import { StoreLike } from '../../game/store/store-like';
import { State } from '../../game/store/state/state';
import { Effect } from '../../game/store/effects/effect';
import { COIN_FLIP_PROMPT, THIS_POKEMON_DOES_DAMAGE_TO_ITSELF, WAS_ATTACK_USED } from '../../game/store/prefabs/prefabs';
import { YOUR_OPPPONENTS_ACTIVE_POKEMON_IS_NOW_CONFUSED } from '../../game/store/prefabs/attack-effects';

export class Raikouex extends PokemonCard {
  public stage: Stage = Stage.BASIC;
  public tags = [CardTag.POKEMON_ex];
  public cardType: CardType = L;
  public hp: number = 100;
  public weakness = [{ type: F }];
  public retreat = [C, C];

  public attacks = [{
    name: 'Dazzle Blast',
    cost: [L],
    damage: 10,
    text: 'Flip a coin. If heads, the Defending Pokémon is now Confused.'
  },
  {
    name: 'Lightning Tackle',
    cost: [L, L, C],
    damage: 70,
    text: 'Flip a coin. If tails, Raikou ex does 20 damage to itself.'
  }];

  public set: string = 'MA';
  public cardImage: string = 'assets/cardback.png';
  public setNumber: string = '92';
  public name: string = 'Raikou ex';
  public fullName: string = 'Raikou ex MA';

  public reduceEffect(store: StoreLike, state: State, effect: Effect): State {

    if (WAS_ATTACK_USED(effect, 0, this)) {
      COIN_FLIP_PROMPT(store, state, effect.player, result => {
        if (result) {
          YOUR_OPPPONENTS_ACTIVE_POKEMON_IS_NOW_CONFUSED(store, state, effect);
        }
      });
    }

    if (WAS_ATTACK_USED(effect, 1, this)) {
      COIN_FLIP_PROMPT(store, state, effect.player, result => {
        if (!result) {
          THIS_POKEMON_DOES_DAMAGE_TO_ITSELF(store, state, effect, 20);
        }
      });
    }

    return state;
  }
}