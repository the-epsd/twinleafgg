import { PokemonCard } from '../../../game/store/card/pokemon-card';
import { Stage, CardType, CardTag } from '../../../game/store/card/card-types';
import { StoreLike, State } from '../../../game';
import { Effect } from '../../../game/store/effects/effect';
import { NEXT_TURN_ATTACK_BONUS_ALL_ATTACKS } from '../../../game/store/prefabs/attack-effects';

export class Centiskorch extends PokemonCard {
  protected _tags = [CardTag.RAPID_STRIKE];
  public stage: Stage = Stage.STAGE_1;
  public evolvesFrom: string = 'Sizzlipede';
  public cardType: CardType = R;
  public hp: number = 130;
  public weakness = [{ type: W }];
  public retreat = [C, C];

  public attacks = [
    {
      name: 'Coil',
      cost: [R, C],
      damage: 30,
      text: "During your next turn, this Pokémon's attacks do 90 more damage to your opponent's Active Pokémon (before applying Weakness and Resistance).",
    },
    {
      name: 'Burning Train',
      cost: [R, R, C],
      damage: 120,
      text: '',
    },
  ];

  public regulationMark: string = 'E';
  public set: string = 'FST';
  public setNumber: string = '48';
  public cardImage: string = 'assets/cardback.png';
  public name: string = 'Centiskorch';
  public fullName: string = 'Centiskorch FST 48';

  public reduceEffect(store: StoreLike, state: State, effect: Effect): State {
    NEXT_TURN_ATTACK_BONUS_ALL_ATTACKS(effect, {
      source: this,
      bonusDamage: 90,
      setupAttack: this.attacks[0],
    });

    return state;
  }
}
