import { PokemonCard } from '../../game/store/card/pokemon-card';
import { Stage, CardType, CardTag } from '../../game/store/card/card-types';
import { State, StoreLike } from '../../game';
import { Effect } from '../../game/store/effects/effect';
import { ADD_PARALYZED_TO_PLAYER_ACTIVE, AFTER_ATTACK, COIN_FLIP_PROMPT } from '../../game/store/prefabs/prefabs';

export class Dratini2 extends PokemonCard {
  public stage: Stage = Stage.BASIC;
  public tags = [CardTag.DELTA_SPECIES];
  public cardType: CardType = L;
  public hp: number = 50;
  public weakness = [{ type: C }];
  public resistance = [{ type: G, value: -30 }, { type: F, value: -30 }];
  public retreat = [C];

  public attacks = [{
    name: 'Thunder Wave',
    cost: [L],
    damage: 10,
    text: 'Flip a coin. If heads, the Defending Pokémon is now Paralyzed.'
  }];

  public set: string = 'DS';
  public cardImage: string = 'assets/cardback.png';
  public setNumber: string = '66';
  public name: string = 'Dratini';
  public fullName: string = 'Dratini DS 66';

  public reduceEffect(store: StoreLike, state: State, effect: Effect): State {

    if (AFTER_ATTACK(effect, 0, this)) {
      COIN_FLIP_PROMPT(store, state, effect.player, (result) => {
        if (result) {
          ADD_PARALYZED_TO_PLAYER_ACTIVE(store, state, effect.opponent, this);
        }
      });
    }

    return state;
  }
}
