import { ADD_SLEEP_TO_PLAYER_ACTIVE, AFTER_ATTACK, WAS_ATTACK_USED } from '../../game/store/prefabs/prefabs';
import { CardType, SpecialCondition, Stage } from '../../game/store/card/card-types';
import { PokemonCard } from '../../game/store/card/pokemon-card';
import { Effect } from '../../game/store/effects/effect';
import { State, StoreLike } from '../../game';

export class Haunter extends PokemonCard {
  public stage: Stage = Stage.STAGE_1;
  public evolvesFrom = 'Gastly';
  public cardType: CardType = P;
  public hp: number = 70;
  public weakness = [{ type: D }];
  public resistance = [{ type: F, value: -30 }];
  public retreat = [C];

  public attacks = [{
    name: 'Nightmare',
    cost: [P, C],
    damage: 20,
    text: 'The Defending Pokémon is now Asleep.'
  },
  {
    name: 'Dream Eater',
    cost: [P, C],
    damage: 50,
    text: 'If the Defending Pokémon isn\'t Asleep, this attack does nothing.'
  }];

  public set: string = 'EX';
  public cardImage: string = 'assets/cardback.png';
  public setNumber: string = '80';
  public name: string = 'Haunter';
  public fullName: string = 'Haunter EX';

  public reduceEffect(store: StoreLike, state: State, effect: Effect): State {

    if (AFTER_ATTACK(effect, 0, this)) {
      ADD_SLEEP_TO_PLAYER_ACTIVE(store, state, effect.opponent, this);
    }

    if (WAS_ATTACK_USED(effect, 1, this)) {
      if (!effect.opponent.active.specialConditions.includes(SpecialCondition.ASLEEP)) {
        effect.damage = 0;
      }
    }

    return state;
  }
}