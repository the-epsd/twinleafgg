import { State, StateUtils, StoreLike } from '../../game';
import { CardType, Stage } from '../../game/store/card/card-types';
import { PokemonCard } from '../../game/store/card/pokemon-card';
import { Effect } from '../../game/store/effects/effect';
import { ADD_BURN_TO_PLAYER_ACTIVE, AFTER_ATTACK } from '../../game/store/prefabs/prefabs';

export class Numel extends PokemonCard {
  public stage: Stage = Stage.BASIC;
  public cardType: CardType = R;
  public hp: number = 80;
  public weakness = [{ type: W }];
  public retreat = [C, C, C];

  public attacks = [{
    name: 'Singe',
    cost: [R],
    damage: 0,
    text: 'Your opponent\'s Active Pokémon is now Burned.'
  },
  {
    name: 'Heat Blast',
    cost: [R, R, C],
    damage: 60,
    text: ''
  }];

  public set: string = 'PAF';
  public cardImage: string = 'assets/cardback.png';
  public setNumber: string = '11';
  public name: string = 'Numel';
  public fullName: string = 'Numel PAF';
  public regulationMark = 'G';

  public reduceEffect(store: StoreLike, state: State, effect: Effect): State {

    if (AFTER_ATTACK(effect, 0, this)) {
      const player = effect.player;
      const opponent = StateUtils.getOpponent(state, player);

      ADD_BURN_TO_PLAYER_ACTIVE(store, state, opponent, this);
    }

    return state;
  }
}