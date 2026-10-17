import { PokemonCard } from '../../../game/store/card/pokemon-card';
import { CardType, Stage } from '../../../game/store/card/card-types';
import { State, StoreLike } from '../../../game';
import { Effect } from '../../../game/store/effects/effect';
import { NEXT_TURN_ATTACK_BONUS_ALL_ATTACKS, YOUR_OPPPONENTS_ACTIVE_POKEMON_IS_NOW_POISIONED } from '../../../game/store/prefabs/attack-effects';
import { WAS_ATTACK_USED } from '../../../game/store/prefabs/prefabs';

export class Nidorino extends PokemonCard {
  public stage: Stage = Stage.STAGE_1;
  public evolvesFrom: string = 'Nidoran ♂';
  public hp: number = 80;
  public cardType: CardType[] = [P];
  public weakness = [{ type: P, value: +20 }];
  public retreat = [C];

  public attacks = [{
    name: 'Spirited Drill',
    cost: [C, C],
    damage: 20,
    text: 'During your next turn, each of Nidorino\'s attacks does 20 more damage to the Defending Pokémon (before applying Weakness and Resistance).'
  },
  {
    name: 'Poison Horn',
    cost: [P, C, C],
    damage: 40,
    text: 'The Defending Pokémon is now Poisoned.'
  }];

  public set: string = 'SW';
  public cardImage: string = 'assets/cardback.png';
  public setNumber: string = '57';
  public name: string = 'Nidorino';
  public fullName: string = 'Nidorino SW';

  public reduceEffect(store: StoreLike, state: State, effect: Effect): State {
    // Spirited Drill
    NEXT_TURN_ATTACK_BONUS_ALL_ATTACKS(effect, {
      source: this,
      bonusDamage: 20,
      setupAttack: this.attacks[0],
    });

    // Poison Horn
    if (WAS_ATTACK_USED(effect, 1, this)) {
      YOUR_OPPPONENTS_ACTIVE_POKEMON_IS_NOW_POISIONED(store, state, effect);
    }

    return state;
  }
}
