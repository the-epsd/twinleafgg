import { CardType, PokemonCard, Stage, State, StateUtils, StoreLike } from '../../game';
import { Effect } from '../../game/store/effects/effect';
import { ADD_CONFUSION_TO_PLAYER_ACTIVE, ADD_POISON_TO_PLAYER_ACTIVE, SWITCH_ACTIVE_WITH_BENCHED, WAS_ATTACK_USED } from '../../game/store/prefabs/prefabs';

export class Accelgor extends PokemonCard {
  public stage: Stage = Stage.STAGE_1;
  public evolvesFrom: string = 'Shelmet';
  public cardType: CardType = G;
  public hp: number = 100;
  public weakness = [{ type: R }];
  public retreat = [C];

  public attacks = [{
    name: 'Ephemeral Poison',
    cost: [G, C],
    damage: 70,
    text: 'Your opponent’s Active Pokémon is now Confused and Poisoned. Switch this Pokémon with 1 of your Benched Pokémon.'
  }];

  public regulationMark: string = 'I';
  public set: string = 'SV9';
  public cardImage: string = 'assets/cardback.png';
  public setNumber: string = '9';
  public name: string = 'Accelgor';
  public fullName: string = 'Accelgor SV9';

  public reduceEffect(store: StoreLike, state: State, effect: Effect): State {

    if (WAS_ATTACK_USED(effect, 0, this)) {
      const player = effect.player;
      const opponent = StateUtils.getOpponent(state, player);
      ADD_POISON_TO_PLAYER_ACTIVE(store, state, opponent, this);
      ADD_CONFUSION_TO_PLAYER_ACTIVE(store, state, opponent, this);
      SWITCH_ACTIVE_WITH_BENCHED(store, state, player);
    }

    return state;
  }
}