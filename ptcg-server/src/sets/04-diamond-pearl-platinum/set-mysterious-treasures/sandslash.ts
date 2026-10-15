import { PokemonCard } from '../../../game/store/card/pokemon-card';
import { CardType, Stage } from '../../../game/store/card/card-types';
import { State, StoreLike } from '../../../game';
import { Effect } from '../../../game/store/effects/effect';
import { ADD_POISON_TO_PLAYER_ACTIVE, WAS_ATTACK_USED } from '../../../game/store/prefabs/prefabs';
import { THIS_POKEMON_RETALIATES_ON_DAMAGE_DURING_OPPONENTS_NEXT_TURN } from '../../../game/store/prefabs/effect-of-attack-prefabs';

export class Sandslash extends PokemonCard {
  public stage: Stage = Stage.STAGE_1;
  public evolvesFrom: string = 'Sandshrew';
  public hp: number = 90;
  public cardType: CardType[] = [F];
  public weakness = [{ type: W, value: 20 }];
  public resistance = [{ type: L, value: -20 }];
  public retreat = [C];

  public attacks = [{
    name: 'Spike Armor',
    cost: [C],
    damage: 0,
    text: 'During your opponent\'s next turn, if Sandslash is damaged by an opponent\'s attack (even if Sandslash is Knocked Out), put 4 damage counters on the Attacking Pokémon.'
  },
{
    name: 'Poison Spike',
    cost: [F, F, C],
    damage: 60,
    text: 'If the Defending Pokémon already has any damage counters on it, that Pokémon is now Poisoned.'
  }];

  public set: string = 'MT';
  public cardImage: string = 'assets/cardback.png';
  public setNumber: string = '61';
  public name: string = 'Sandslash';
  public fullName: string = 'Sandslash MT';

  public reduceEffect(store: StoreLike, state: State, effect: Effect): State {
    // Spike Armor
    if (WAS_ATTACK_USED(effect, 0, this)) {
      return THIS_POKEMON_RETALIATES_ON_DAMAGE_DURING_OPPONENTS_NEXT_TURN(store, state, effect, this, { damage: 50 });
    }

    // Poison Spike
    if (WAS_ATTACK_USED(effect, 1, this)) {
      ADD_POISON_TO_PLAYER_ACTIVE(store, state, effect.opponent, this);
    }

    return state;
  }
}
