import { ADD_BURN_TO_PLAYER_ACTIVE, AFTER_ATTACK } from '../../game/store/prefabs/prefabs';
import { CardType, Stage } from '../../game/store/card/card-types';
import { PokemonCard } from '../../game/store/card/pokemon-card';
import { Effect } from '../../game/store/effects/effect';
import { State, StoreLike } from '../../game';
export class Larvesta2 extends PokemonCard {
  public stage: Stage = Stage.BASIC;
  public cardType: CardType = R;
  public hp: number = 60;
  public weakness = [{ type: W }];
  public retreat = [C];

  public attacks = [
    {
      name: 'Super Singe',
      cost: [R, C],
      damage: 10,
      text: 'The Defending Pokémon is now Burned.'
    }
  ];

  public set: string = 'DEX';
  public setNumber: string = '21';
  public cardImage: string = 'assets/cardback.png';
  public name: string = 'Larvesta';
  public fullName: string = 'Larvesta DEX 21';

  public reduceEffect(store: StoreLike, state: State, effect: Effect): State {
    // Super Singe
    if (AFTER_ATTACK(effect, 0, this)) {
      ADD_BURN_TO_PLAYER_ACTIVE(store, state, effect.opponent, this);
    }

    return state;
  }
}
