import { PokemonCard } from '../../../game/store/card/pokemon-card';
import { Stage, CardType } from '../../../game/store/card/card-types';
import { StoreLike, State } from '../../../game';
import { Effect } from '../../../game/store/effects/effect';
import { WAS_ATTACK_USED, COIN_FLIP_PROMPT } from '../../../game/store/prefabs/prefabs';
import { BLOCK_RETREAT } from '../../../game/store/prefabs/effect-of-attack-prefabs';

export class Murkrow extends PokemonCard {
  public stage: Stage = Stage.BASIC;
  public hp: number = 80;
  public cardType: CardType[] = [D];
  public weakness = [{ type: L }];
  public resistance = [{ type: F, value: -30 }];
  public retreat = [C];

  public attacks = [{
    name: 'Clumsily Clutch',
    cost: [D],
    damage: 20,
    text: 'Flip a coin. If heads, during your opponent\'s next turn, the Defending Pokémon can\'t retreat.'
  }];

  public regulationMark: string = 'J';
  public set: string = '30C';
  public cardImage: string = 'assets/cardback.png';
  public setNumber: string = '93';
  public name: string = 'Murkrow';
  public fullName: string = 'Murkrow 30C';

  public reduceEffect(store: StoreLike, state: State, effect: Effect): State {
    // Clumsily Clutch
    if (WAS_ATTACK_USED(effect, 0, this)) {
      COIN_FLIP_PROMPT(store, state, effect.player, result => {
        if (result) {
          return BLOCK_RETREAT(store, state, effect, this);
        }
      });
    }

    return state;
  }
}
