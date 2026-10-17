import { PokemonCard } from '../../../game/store/card/pokemon-card';
import { CardType, Stage } from '../../../game/store/card/card-types';
import { State, StoreLike } from '../../../game';
import { Effect } from '../../../game/store/effects/effect';
import { ADD_SLEEP_TO_PLAYER_ACTIVE, WAS_ATTACK_USED } from '../../../game/store/prefabs/prefabs';

export class Surskit extends PokemonCard {
  public stage: Stage = Stage.BASIC;
  public hp: number = 50;
  public cardType: CardType[] = [G];
  public weakness = [{ type: R, value: +10 }];
  public retreat = [C];

  public attacks = [{
    name: 'Sleep Inducer',
    cost: [G],
    damage: 0,
    text: 'Switch 1 of your opponent\'s Benched Pokémon with 1 of the Defending Pokémon. The new Defending Pokémon is now Asleep.'
  }];

  public set: string = 'MT';
  public cardImage: string = 'assets/cardback.png';
  public setNumber: string = '104';
  public name: string = 'Surskit';
  public fullName: string = 'Surskit MT';

  public reduceEffect(store: StoreLike, state: State, effect: Effect): State {
    // Sleep Inducer
    if (WAS_ATTACK_USED(effect, 0, this)) {
      const player = effect.player;
      ADD_SLEEP_TO_PLAYER_ACTIVE(store, state, player, this);
    }

    return state;
  }
}
