import { ADD_BURN_TO_PLAYER_ACTIVE, AFTER_ATTACK, COIN_FLIP_PROMPT } from '../../game/store/prefabs/prefabs';
import { CardType, Stage } from '../../game/store/card/card-types';
import { PokemonCard } from '../../game/store/card/pokemon-card';
import { Effect } from '../../game/store/effects/effect';
import { State, StoreLike } from '../../game';
export class Charmander extends PokemonCard {
  public stage: Stage = Stage.BASIC;
  public cardType: CardType = R;
  public hp: number = 50;
  public weakness = [{ type: W }];
  public retreat = [C];

  public attacks = [{
    name: 'Gnaw',
    cost: [C],
    damage: 10,
    text: ''
  },
  {
    name: 'Searing Flame',
    cost: [R, C],
    damage: 10,
    text: 'Flip a coin. If heads, the Defending Pokémon is now Burned.'
  }];

  public set: string = 'EX';
  public cardImage: string = 'assets/cardback.png';
  public setNumber: string = '98';
  public name: string = 'Charmander';
  public fullName: string = 'Charmander EX';

  public reduceEffect(store: StoreLike, state: State, effect: Effect): State {

    if (AFTER_ATTACK(effect, 1, this)) {
      COIN_FLIP_PROMPT(store, state, effect.player, result => {
        if (result) {
          ADD_BURN_TO_PLAYER_ACTIVE(store, state, effect.opponent, this);
        }
      });
    }

    return state;
  }
}