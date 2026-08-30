import { PokemonCard } from '../../../game/store/card/pokemon-card';
import { Stage, CardType } from '../../../game/store/card/card-types';
import { StoreLike, State } from '../../../game';
import { Effect } from '../../../game/store/effects/effect';
import { COIN_FLIP_PROMPT, WAS_ATTACK_USED } from '../../../game/store/prefabs/prefabs';
import { YOUR_OPPPONENTS_ACTIVE_POKEMON_IS_NOW_PARALYZED } from '../../../game/store/prefabs/attack-effects';

export class Azumarill extends PokemonCard {
  public stage: Stage = Stage.STAGE_1;
  public evolvesFrom: string = 'Marill';
  public hp: number = 130;
  public cardType: CardType[] = [P];
  public weakness = [{ type: M }];
  public retreat = [C, C];

  public attacks = [{
    name: 'Body Slam',
    cost: [P, P, C],
    damage: 90,
    text: 'Flip a coin. If heads, your opponent\'s Active Pokémon is now Paralyzed.'
  }];

  public regulationMark: string = 'J';
  public set: string = '30C';
  public cardImage: string = 'assets/cardback.png';
  public setNumber: string = '68';
  public name: string = 'Azumarill';
  public fullName: string = 'Azumarill 30C';

  public reduceEffect(store: StoreLike, state: State, effect: Effect): State {
    // Body Slam
    if (WAS_ATTACK_USED(effect, 0, this)) {
      return COIN_FLIP_PROMPT(store, state, effect.player, result => {
        if (result) {
          YOUR_OPPPONENTS_ACTIVE_POKEMON_IS_NOW_PARALYZED(store, state, effect);
        }
      });
    }

    return state;
  }
}
