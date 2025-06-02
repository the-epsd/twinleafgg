import { PokemonCard } from '../../game/store/card/pokemon-card';
import { Stage, CardType, CardTag } from '../../game/store/card/card-types';
import { StoreLike, State } from '../../game';
import { Effect } from '../../game/store/effects/effect';
import { ADD_POISON_TO_PLAYER_ACTIVE, WAS_ATTACK_USED } from '../../game/store/prefabs/prefabs';

export class TeamRocketsNidokingex extends PokemonCard {
  public stage: Stage = Stage.STAGE_2;
  public evolvesFrom = 'Team Rocket\'s Nidorino';
  public tags = [CardTag.TEAM_ROCKET, CardTag.POKEMON_ex];
  public cardType: CardType = D;
  public hp: number = 330;
  public weakness = [{ type: F }];
  public retreat = [C, C, C];

  public attacks = [
    {
      name: 'Dirty Horns',
      cost: [D, D, C],
      damage: 100,
      text: 'Your opponent\'s Active Pokémon is now Poisoned. During Pokémon Checkup, put 8 damage counters on that Pokémon instead of 1.'
    },
    {
      name: 'King\'s Impact',
      cost: [D, D, D, C],
      damage: 240,
      text: ''
    }
  ];

  public regulationMark = 'I';
  public set: string = 'DRI';
  public setNumber: string = '119';
  public cardImage: string = 'assets/cardback.png';
  public name: string = 'Team Rocket\'s Nidoking ex';
  public fullName: string = 'Team Rocket\'s Nidoking ex DRI';

  public reduceEffect(store: StoreLike, state: State, effect: Effect): State {
    // Dirty Horns
    if (WAS_ATTACK_USED(effect, 0, this)) {
      ADD_POISON_TO_PLAYER_ACTIVE(store, state, effect.opponent, this, 80);
    }

    return state;
  }
}
