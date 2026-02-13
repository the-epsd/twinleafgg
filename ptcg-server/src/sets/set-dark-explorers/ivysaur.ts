import { PokemonCard } from '../../game/store/card/pokemon-card';
import { CardType, Stage } from '../../game/store/card/card-types';
import { StoreLike, State, StateUtils } from '../../game';
import { Effect } from '../../game/store/effects/effect';
import { ADD_POISON_TO_PLAYER_ACTIVE, ADD_SLEEP_TO_PLAYER_ACTIVE, AFTER_ATTACK } from '../../game/store/prefabs/prefabs';

export class Ivysaur extends PokemonCard {

  public stage: Stage = Stage.STAGE_1;

  public evolvesFrom = 'Bulbasaur';

  public cardType: CardType = G;

  public hp: number = 90;

  public weakness = [{ type: R }];

  public resistance = [{ type: W, value: -20 }];

  public retreat = [C, C, C];

  public attacks = [
    {
      name: 'Sleep Powder',
      cost: [G, C],
      damage: 30,
      text: 'The Defending Pokémon is now Asleep.',
    },
    {
      name: 'Poison Powder',
      cost: [G, G, C],
      damage: 80,
      text: 'The Defending Pokémon is now Poisoned.',
    }
  ];

  public set: string = 'DEX';

  public cardImage: string = 'assets/cardback.png';

  public setNumber: string = '2';

  public name: string = 'Ivysaur';

  public fullName: string = 'Ivysaur DEX';

  public reduceEffect(store: StoreLike, state: State, effect: Effect): State {

    if (AFTER_ATTACK(effect, 0, this)) {
      ADD_SLEEP_TO_PLAYER_ACTIVE(store, state, StateUtils.getOpponent(state, effect.player), this);
    }

    if (AFTER_ATTACK(effect, 1, this)) {
      ADD_POISON_TO_PLAYER_ACTIVE(store, state, StateUtils.getOpponent(state, effect.player), this);
    }
    return state;
  }
}