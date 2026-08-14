import { PokemonCard, Stage, CardType, StoreLike, State } from "../../../game";
import { Effect } from "../../../game/store/effects/effect";
import { NEXT_TURN_ATTACK_BONUS_ALL_ATTACKS } from "../../../game/store/prefabs/attack-effects";

export class Sandaconda extends PokemonCard {
  public stage: Stage = Stage.STAGE_1;
  public evolvesFrom: string = 'Silicobra';
  public cardType: CardType = F;
  public hp: number = 140;
  public weakness = [{ type: G }];
  public retreat = [C, C];

  public attacks = [{
    name: 'Coil',
    cost: [C],
    damage: 10,
    text: 'During your next turn, this Pokémon\'s attacks do 120 more damage to your opponent\'s Active Pokémon (before applying Weakness and Resistance).'
  },
  {
    name: 'Skull Bash',
    cost: [F, C, C],
    damage: 100,
    text: ''
  }];

  public regulationMark: string = 'D';
  public set: string = 'SSH';
  public setNumber: string = '109';
  public cardImage: string = 'assets/cardback.png';
  public name: string = 'Sandaconda';
  public fullName: string = 'Sandaconda SSH';

  public reduceEffect(store: StoreLike, state: State, effect: Effect): State {
    // Coil
    NEXT_TURN_ATTACK_BONUS_ALL_ATTACKS(effect, {
      source: this,
      bonusDamage: 120,
      setupAttack: this.attacks[0],
    });

    return state;
  }
}
