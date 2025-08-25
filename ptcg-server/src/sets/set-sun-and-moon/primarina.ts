import { State, StoreLike } from '../../game';
import { CardType, Stage } from '../../game/store/card/card-types';
import { PokemonCard } from '../../game/store/card/pokemon-card';
import { Effect } from '../../game/store/effects/effect';
import { ADD_CONFUSION_TO_PLAYER_ACTIVE, AFTER_ATTACK, HEAL_X_DAMAGE_FROM_THIS_POKEMON, WAS_ATTACK_USED } from '../../game/store/prefabs/prefabs';

export class Primarina extends PokemonCard {
  public stage: Stage = Stage.STAGE_2;
  public cardType: CardType = W;
  public hp: number = 150;
  public weakness = [{ type: G }];
  public retreat = [C, C];

  public attacks = [{
    name: 'Disarming Voice',
    cost: [W, C],
    damage: 30,
    text: 'Your opponent\'s Active Pokémon is now Confused.'
  },
  {
    name: 'Sparkling Aria',
    cost: [W, W, C],
    damage: 100,
    text: 'Heal 30 damage from this Pokémon.'
  }];

  public set: string = 'SUM';
  public cardImage: string = 'assets/cardback.png';
  public setNumber: string = '41';
  public name: string = 'Primarina';
  public fullName: string = 'Primarina SUM';

  public reduceEffect(store: StoreLike, state: State, effect: Effect): State {

    if (AFTER_ATTACK(effect, 0, this)) {
      ADD_CONFUSION_TO_PLAYER_ACTIVE(store, state, effect.opponent, this);
    }

    if (WAS_ATTACK_USED(effect, 1, this)) {
      HEAL_X_DAMAGE_FROM_THIS_POKEMON(effect, store, state, 30);
    }

    return state;
  }
} 