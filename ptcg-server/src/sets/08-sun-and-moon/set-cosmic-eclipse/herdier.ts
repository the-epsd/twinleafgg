import { PokemonCard, Stage, CardType, StoreLike, State } from "../../../game";
import { Effect } from "../../../game/store/effects/effect";
import { NEXT_TURN_ATTACK_BONUS_ALL_ATTACKS } from "../../../game/store/prefabs/attack-effects";

export class Herdier extends PokemonCard {
  public stage: Stage = Stage.STAGE_1;
  public evolvesFrom: string = 'Lillipup';
  public cardType: CardType = C;
  public hp: number = 100;
  public weakness = [{ type: F }];
  public retreat = [C, C];

  public attacks = [{
    name: 'Work Up',
    cost: [C],
    damage: 0,
    text: 'During your next turn, this Pokémon\'s attacks do 60 more damage to your opponent\'s Active Pokémon (before applying Weakness and Resistance).'
  },
  {
    name: 'Headbutt Bounce',
    cost: [C, C, C],
    damage: 60,
    text: ''
  }];

  public set: string = 'CEC';
  public setNumber: string = '175';
  public cardImage: string = 'assets/cardback.png';
  public name: string = 'Herdier';
  public fullName: string = 'Herdier CEC';

  public reduceEffect(store: StoreLike, state: State, effect: Effect): State {
    // Work Up
    NEXT_TURN_ATTACK_BONUS_ALL_ATTACKS(effect, {
      source: this,
      bonusDamage: 60,
      setupAttack: this.attacks[0],
    });

    return state;
  }
}
