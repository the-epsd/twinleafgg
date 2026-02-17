import { PokemonCard } from '../../game/store/card/pokemon-card';
import { Stage, CardType } from '../../game/store/card/card-types';
import { StoreLike, State } from '../../game';
import { Effect } from '../../game/store/effects/effect';
import { AttackEffect } from '../../game/store/effects/game-effects';
import { COPY_OPPONENT_ACTIVE_ATTACK, WAS_ATTACK_USED } from '../../game/store/prefabs/prefabs';

export class Krookodile extends PokemonCard {
  public stage: Stage = Stage.STAGE_2;
  public evolvesFrom: string = 'Krokorok';
  public cardType: CardType = F;
  public hp: number = 140;
  public weakness = [{ type: W }];
  public retreat = [C, C, C];

  public attacks = [
    {
      name: 'Foul Play',
      cost: [D],
      damage: 0,
      copycatAttack: true,
      text: 'Choose 1 of the Defending Pokémon\'s attacks and use it as this attack.'
    },
    {
      name: 'Bombast',
      cost: [D, D, C, C],
      damage: 40,
      damageCalculation: '+',
      text: 'Does 40 more damage for each Prize card you have taken.'
    }
  ];

  public set: string = 'BLW';
  public cardImage: string = 'assets/cardback.png';
  public setNumber: string = '65';
  public name: string = 'Krookodile';
  public fullName: string = 'Krookodile BLW';

  public reduceEffect(store: StoreLike, state: State, effect: Effect): State {
    if (WAS_ATTACK_USED(effect, 0, this)) {
      return COPY_OPPONENT_ACTIVE_ATTACK(store, state, effect as AttackEffect);
    }

    if (WAS_ATTACK_USED(effect, 1, this)) {
      const player = effect.player;
      const prizesTaken = 6 - player.getPrizeLeft();
      (effect as AttackEffect).damage += 40 * prizesTaken;
    }

    return state;
  }
}
