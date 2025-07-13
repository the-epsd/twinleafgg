import { CardType, PokemonCard, Stage, State, StateUtils, StoreLike } from '../../game';
import { Effect } from '../../game/store/effects/effect';
import { ADD_CONFUSION_TO_PLAYER_ACTIVE, ADD_POISON_TO_PLAYER_ACTIVE, AFTER_ATTACK, SWITCH_ACTIVE_WITH_BENCHED } from '../../game/store/prefabs/prefabs';

export class Accelgor extends PokemonCard {
  public stage: Stage = Stage.STAGE_1;
  public evolvesFrom: string = 'Shelmet';
  public cardType: CardType = G;
  public hp: number = 100;
  public weakness = [{ type: R }];
  public retreat = [C];

  public attacks = [{
    name: 'Poisonous Ploy',
    cost: [G, C],
    damage: 70,
    text: 'Your opponent\'s Active Pokémon is now Confused and Poisoned. Switch this Pokémon with 1 of your Benched Pokémon.'
  }];

  public regulationMark: string = 'I';
  public set: string = 'JTG';
  public cardImage: string = 'assets/cardback.png';
  public setNumber: string = '13';
  public name: string = 'Accelgor';
  public fullName: string = 'Accelgor JTG';

  public reduceEffect(store: StoreLike, state: State, effect: Effect): State {

    if (AFTER_ATTACK(effect, 0, this)) {
      const player = effect.player;
      const opponent = StateUtils.getOpponent(state, player);
      ADD_POISON_TO_PLAYER_ACTIVE(store, state, opponent, this);
      ADD_CONFUSION_TO_PLAYER_ACTIVE(store, state, opponent, this);
      SWITCH_ACTIVE_WITH_BENCHED(store, state, player);
    }

    return state;
  }
}