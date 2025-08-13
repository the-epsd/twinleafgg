import { PokemonCard } from '../../game/store/card/pokemon-card';
import { Stage, CardType } from '../../game/store/card/card-types';
import { StoreLike, State, StateUtils } from '../../game';
import { Effect } from '../../game/store/effects/effect';
import { ADD_BURN_TO_PLAYER_ACTIVE, AFTER_ATTACK } from '../../game/store/prefabs/prefabs';

export class Combusken extends PokemonCard {
  public stage: Stage = Stage.STAGE_1;
  public cardType: CardType = CardType.FIRE;
  public hp: number = 90;
  public weakness = [{ type: CardType.WATER }];
  public retreat = [CardType.COLORLESS];
  public evolvesFrom = 'Torchic';

  public attacks = [{
    name: 'Smash Kick',
    cost: [CardType.FIRE],
    damage: 20,
    text: ''
  },
  {
    name: 'Heat Beak',
    cost: [CardType.FIRE, CardType.COLORLESS, CardType.COLORLESS],
    damage: 40,
    text: 'Your opponent\'s Active Pokémon is now Burned.'
  }];

  public regulationMark = 'D';
  public set = 'DAA';
  public cardImage: string = 'assets/cardback.png';
  public setNumber: string = '23';
  public name = 'Combusken';
  public fullName = 'Combusken DAA';

  public reduceEffect(store: StoreLike, state: State, effect: Effect): State {

    if (AFTER_ATTACK(effect, 1, this)) {
      ADD_BURN_TO_PLAYER_ACTIVE(store, state, StateUtils.getOpponent(state, effect.player), this);
    }

    return state;
  }

}