import { PokemonCard } from '../../game/store/card/pokemon-card';
import { Stage, CardType } from '../../game/store/card/card-types';
import { StoreLike, State } from '../../game';
import { Effect } from '../../game/store/effects/effect';
import { ADD_SLEEP_TO_PLAYER_ACTIVE, OPPONENTS_POKEMON_CANNOT_USE_THAT_ATTACK, WAS_ATTACK_USED } from '../../game/store/prefabs/prefabs';
import { YOUR_OPPPONENTS_ACTIVE_POKEMON_IS_NOW_ASLEEP } from '../../game/store/prefabs/attack-effects';

export class Bibarel extends PokemonCard {
  public stage: Stage = Stage.STAGE_1;
  public evolvesFrom: string = 'Bidoof';
  public cardType: CardType = C;
  public hp: number = 100;
  public weakness = [{ type: F }];
  public retreat = [C, C];

  public attacks = [{
    name: 'Amnesia',
    cost: [C, C, C],
    damage: 40,
    text: 'Choose 1 of the Defending Pokémon\'s attacks. That Pokémon can\'t use that attack during your opponent\'s next turn.'
  },
  {
    name: 'Tumbling Tackle',
    cost: [C, C, C, C],
    damage: 60,
    text: 'Both this Pokémon and the Defending Pokémon are now Asleep.'
  }];

  public set: string = 'DRX';
  public setNumber: string = '107';
  public cardImage: string = 'assets/cardback.png';
  public name: string = 'Bibarel';
  public fullName: string = 'Bibarel DRX';

  public reduceEffect(store: StoreLike, state: State, effect: Effect): State {
    if (WAS_ATTACK_USED(effect, 0, this)) {
      return OPPONENTS_POKEMON_CANNOT_USE_THAT_ATTACK(store, state, effect, this);
    }

    if (WAS_ATTACK_USED(effect, 1, this)) {
      YOUR_OPPPONENTS_ACTIVE_POKEMON_IS_NOW_ASLEEP(store, state, effect);
      ADD_SLEEP_TO_PLAYER_ACTIVE(store, state, effect.player, this);
    }

    return state;
  }
}
