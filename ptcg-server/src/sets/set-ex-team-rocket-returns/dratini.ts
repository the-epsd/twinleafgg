import { ADD_SLEEP_TO_PLAYER_ACTIVE, AFTER_ATTACK, WAS_ATTACK_USED } from '../../game/store/prefabs/prefabs';
import { FLIP_A_COIN_IF_HEADS_DEAL_MORE_DAMAGE } from '../../game/store/prefabs/attack-effects';
import { CardType, Stage } from '../../game/store/card/card-types';
import { PokemonCard } from '../../game/store/card/pokemon-card';
import { Effect } from '../../game/store/effects/effect';
import { State, StoreLike } from '../../game';
export class Dratini extends PokemonCard {
  public stage: Stage = Stage.BASIC;
  public cardType: CardType = C;
  public hp: number = 50;
  public weakness = [{ type: C }];
  public resistance = [{ type: G, value: -30 }, { type: F, value: -30 }];
  public retreat = [C];

  public attacks = [{
    name: 'Dragon Song',
    cost: [C],
    damage: 0,
    text: 'Each Defending Pokémon is now Asleep.'
  },
  {
    name: 'Tail Strike',
    cost: [W, L],
    damage: 20,
    damageCaclulation: '+',
    text: 'Flip a coin. If heads, this attack does 20 damage plus 10 more damage.'
  }];

  public set: string = 'TRR';
  public cardImage: string = 'assets/cardback.png';
  public setNumber: string = '53';
  public name: string = 'Dratini';
  public fullName: string = 'Dratini TRR';

  public reduceEffect(store: StoreLike, state: State, effect: Effect): State {

    if (AFTER_ATTACK(effect, 0, this)) {
      ADD_SLEEP_TO_PLAYER_ACTIVE(store, state, effect.opponent, this);
    }

    if (WAS_ATTACK_USED(effect, 1, this)) {
      FLIP_A_COIN_IF_HEADS_DEAL_MORE_DAMAGE(store, state, effect, 10);
    }

    return state;
  }
}