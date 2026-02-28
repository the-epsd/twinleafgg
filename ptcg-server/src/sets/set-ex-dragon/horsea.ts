import { State, StoreLike } from '../../game';
import { CardType, Stage } from '../../game/store/card/card-types';
import { PokemonCard } from '../../game/store/card/pokemon-card';
import { Effect } from '../../game/store/effects/effect';
import { ADD_PARALYZED_TO_PLAYER_ACTIVE, AFTER_ATTACK, COIN_FLIP_PROMPT } from '../../game/store/prefabs/prefabs';

export class Horsea extends PokemonCard {
  public stage: Stage = Stage.BASIC;
  public cardType: CardType = W;
  public hp: number = 50;
  public weakness = [{ type: L }];
  public retreat = [C];

  public attacks = [{
    name: 'Paralyzing Gaze',
    cost: [C],
    damage: 0,
    text: 'Flip a coin. If heads, the Defending Pokémon is now Paralyzed.'
  },
  {
    name: 'Wave Splash',
    cost: [C, C],
    damage: 20,
    text: ''
  }];

  public set: string = 'DR';
  public cardImage: string = 'assets/cardback.png';
  public setNumber: string = '58';
  public name: string = 'Horsea';
  public fullName: string = 'Horsea DR';

  public reduceEffect(store: StoreLike, state: State, effect: Effect): State {

    if (AFTER_ATTACK(effect, 0, this)) {
      COIN_FLIP_PROMPT(store, state, effect.player, result => {
        if (result) {
          ADD_PARALYZED_TO_PLAYER_ACTIVE(store, state, effect.opponent, this);
        }
      });
    }

    return state;
  }
}