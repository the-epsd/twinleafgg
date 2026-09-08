import { PokemonCard } from '../../../game/store/card/pokemon-card';
import { Stage, CardType } from '../../../game/store/card/card-types';
import { StoreLike } from '../../../game/store/store-like';
import { State } from '../../../game/store/state/state';
import { Effect } from '../../../game/store/effects/effect';
import { PowerType } from '../../../game/store/card/pokemon-types';
import { GameMessage } from '../../../game/game-message';
import { ADD_POISON_TO_PLAYER_ACTIVE, AFTER_ATTACK, WAS_ATTACK_USED } from '../../../game/store/prefabs/prefabs';
import { BLOCK_RETREAT } from '../../../game/store/prefabs/effect-of-attack-prefabs';
import {
  CAN_APPLY_LOCKER_ABILITY,
  HANDLE_ABILITY_BLOCK,
  IS_ABILITY_LOCKER_ACTIVE,
  POKEPOWER_TYPES,
} from '../../../game/store/prefabs/ability-lock';

export class Muk extends PokemonCard {
  public stage: Stage = Stage.STAGE_1;
  public evolvesFrom: string = 'Grimer';
  public cardType: CardType[] = [G];
  public hp: number = 70;
  public weakness = [{ type: P }];
  public retreat = [C, C];

  public powers = [{
    name: 'Stench',
    powerType: PowerType.POKEBODY,
    text: 'As long as Muk is your Active Pokémon, each player\'s Pokémon can\'t use any Poké-Powers.'
  }];

  public attacks = [{
    name: 'Poison Ring',
    cost: [G, C],
    damage: 20,
    text: 'The Defending Pokémon is now Poisoned. The Defending Pokémon can\'t retreat during your opponent\'s next turn.'
  },
  {
    name: 'Sludge Toss',
    cost: [G, C, C],
    damage: 50,
    text: ''
  }];

  public set: string = 'LM';
  public cardImage: string = 'assets/cardback.png';
  public setNumber: string = '11';
  public name: string = 'Muk';
  public fullName: string = 'Muk LM';

  public readonly POISON_RING_MARKER: string = 'POISON_RING_MARKER';

  public reduceEffect(store: StoreLike, state: State, effect: Effect): State {

    HANDLE_ABILITY_BLOCK(effect, ({ player }) => {
      if (!IS_ABILITY_LOCKER_ACTIVE(state, player, this)) {
        return false;
      }
      return CAN_APPLY_LOCKER_ABILITY(store, state, player, this, this.powers[0]);
    }, {
      powerTypes: POKEPOWER_TYPES,
      error: GameMessage.BLOCKED_BY_ABILITY,
    });

    if (WAS_ATTACK_USED(effect, 0, this)) {
      return BLOCK_RETREAT(store, state, effect, this);
    }

    if (AFTER_ATTACK(effect, 0, this)) {
      ADD_POISON_TO_PLAYER_ACTIVE(store, state, effect.opponent, this);
    }
    return state;
  }
}
