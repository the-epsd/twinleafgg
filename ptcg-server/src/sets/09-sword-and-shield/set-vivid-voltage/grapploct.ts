import { PokemonCard, Stage, CardType, StoreLike, State } from "../../../game";
import { Effect } from "../../../game/store/effects/effect";
import { WAS_ATTACK_USED, BLOCK_RETREAT } from "../../../game/store/prefabs/prefabs";

export class Grapploct extends PokemonCard {
  public stage: Stage = Stage.STAGE_1;
  public evolvesFrom: string = 'Clobbopus';
  public cardType: CardType = F;
  public hp: number = 130;
  public weakness = [{ type: P }];
  public retreat = [C, C];

  public attacks = [{
    name: 'Full Nelson',
    cost: [F],
    damage: 30,
    text: 'During your opponent\'s next turn, the Defending Pokémon can\'t retreat.'
  },
  {
    name: 'Tentacle Buster',
    cost: [F, C],
    damage: 50,
    damageCalculation: '+',
    text: 'If this Pokémon used Full Nelson during your last turn, this attack does 120 more damage.'
  }];

  public regulationMark: string = 'D';
  public set: string = 'VIV';
  public setNumber: string = '101';
  public cardImage: string = 'assets/cardback.png';
  public name: string = 'Grapploct';
  public fullName: string = 'Grapploct VIV';

  public reduceEffect(store: StoreLike, state: State, effect: Effect): State {
    // Full Nelson
    if (WAS_ATTACK_USED(effect, 0, this)) {
      return BLOCK_RETREAT(store, state, effect, this);
    }

    // Tentacle Buster
    if (WAS_ATTACK_USED(effect, 1, this)) {
      const playerLastAttackInfo = state.playerLastAttack?.[effect.player.id];

      if (playerLastAttackInfo
        && playerLastAttackInfo.sourceCard === this
        && playerLastAttackInfo.attack.name === 'Full Nelson') {
        effect.damage += 120;
      }
    }

    return state;
  }
}
