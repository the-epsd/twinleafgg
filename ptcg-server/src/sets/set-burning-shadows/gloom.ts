import { PokemonCard, Stage, CardType, Resistance, StoreLike, State, StateUtils } from '../../game';
import { Effect } from '../../game/store/effects/effect';
import { ADD_CONFUSION_TO_PLAYER_ACTIVE, AFTER_ATTACK } from '../../game/store/prefabs/prefabs';

export class Gloom extends PokemonCard {
  public stage: Stage = Stage.STAGE_1;
  public evolvesFrom = 'Oddish';
  public cardType: CardType = CardType.GRASS;
  public hp: number = 80;
  public weakness = [{ type: CardType.FIRE }];
  public resistance: Resistance[] = [];
  public retreat = [CardType.COLORLESS, CardType.COLORLESS];

  public attacks = [
    {
      name: 'Stinky Scent',
      cost: [CardType.GRASS],
      damage: 0,
      text: 'Your opponent\'s Active Pokémon is now Confused.'
    },
    {
      name: 'Razor Leaf',
      cost: [CardType.GRASS, CardType.COLORLESS],
      damage: 30,
      text: ''
    }
  ];

  public set: string = 'BUS';

  public name: string = 'Gloom';

  public fullName: string = 'Gloom BUS';

  public cardImage: string = 'assets/cardback.png';

  public setNumber: string = '5';

  public reduceEffect(store: StoreLike, state: State, effect: Effect): State {
    if (AFTER_ATTACK(effect, 0, this)) {
      ADD_CONFUSION_TO_PLAYER_ACTIVE(store, state, StateUtils.getOpponent(state, effect.player), this);
    }
    return state;
  }
}