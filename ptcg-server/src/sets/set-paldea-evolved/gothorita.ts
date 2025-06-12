import { PokemonCard } from '../../game/store/card/pokemon-card';
import { Stage, CardType } from '../../game/store/card/card-types';
import { StoreLike, State } from '../../game';
import { Effect } from '../../game/store/effects/effect';
import { ADD_CONFUSION_TO_PLAYER_ACTIVE, WAS_ATTACK_USED } from '../../game/store/prefabs/prefabs';

export class Gothorita extends PokemonCard {
  public regulationMark = 'G';
  public stage: Stage = Stage.STAGE_1;
  public evolvesFrom = 'Gothita';
  public cardType: CardType = P;
  public hp: number = 90;
  public weakness = [{ type: D }];
  public resistance = [{ type: F, value: -30 }];
  public retreat = [ C ];

  public attacks = [
    {
      name: 'Mind Bend',
      cost: [ C ],
      damage: 20,
      text: 'Your opponent\'s Active Pokémon is now Confused.'
    },
    {
      name: 'Super Psy Bolt',
      cost: [ P, C ],
      damage: 40,
      text: ''
    },
    
  ];

  public set: string = 'PAL';
  public cardImage: string = 'assets/cardback.png';
  public setNumber: string = '91';
  public name: string = 'Gothorita';
  public fullName: string = 'Gothorita PAL';

  public reduceEffect(store: StoreLike, state: State, effect: Effect): State {
    // Mind Bend
    if (WAS_ATTACK_USED(effect, 0, this)){
      ADD_CONFUSION_TO_PLAYER_ACTIVE(store, state, effect.opponent, this);
    }
    
    return state;
  }
}