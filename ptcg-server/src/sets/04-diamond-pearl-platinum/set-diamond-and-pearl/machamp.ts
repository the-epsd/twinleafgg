import { PokemonCard } from '../../../game/store/card/pokemon-card';
import { CardType, Stage } from '../../../game/store/card/card-types';
import { State, StoreLike } from '../../../game';
import { Effect } from '../../../game/store/effects/effect';
import { COIN_FLIP_PROMPT, WAS_ATTACK_USED, WAS_POKEMON_KNOCKED_OUT_DURING_OPPONENTS_LAST_TURN } from '../../../game/store/prefabs/prefabs';
import { YOUR_OPPPONENTS_ACTIVE_POKEMON_IS_NOW_CONFUSED } from '../../../game/store/prefabs/attack-effects';

export class Machamp extends PokemonCard {
  public stage: Stage = Stage.STAGE_2;
  public evolvesFrom: string = 'Machoke';
  public hp: number = 130;
  public cardType: CardType[] = [F];
  public weakness = [{ type: P, value: 30 }];
  public retreat = [C, C, C];

  public attacks = [{
    name: 'Revenge',
    cost: [F],
    damage: 20,
    damageCalculation: '+',
    text: 'If any of your Pokémon were Knocked Out by damage from an opponent\'s attack during his or her last turn, this attack does 20 damage plus 50 more damage.'
  },
  {
    name: 'Dynamic Punch',
    cost: [F, F, F],
    damage: 60,
    damageCalculation: '+',
    text: 'Flip a coin. If heads, this attack does 60 damage plus 30 more damage and the Defending Pokémon is now Confused.'
  }];

  public set: string = 'DP';
  public cardImage: string = 'assets/cardback.png';
  public setNumber: string = '31';
  public name: string = 'Machamp';
  public fullName: string = 'Machamp DP';

  public reduceEffect(store: StoreLike, state: State, effect: Effect): State {
    // Revenge
    if (WAS_ATTACK_USED(effect, 0, this)) {
      if (WAS_POKEMON_KNOCKED_OUT_DURING_OPPONENTS_LAST_TURN(effect.player, { byAttackDamage: true })) {
        effect.damage += 50;
      }
    }

    // Dynamic Punch
    if (WAS_ATTACK_USED(effect, 1, this)) {
      const player = effect.player;
      COIN_FLIP_PROMPT(store, state, player, (result) => {
        if (result) {
          effect.damage += 30;
          YOUR_OPPPONENTS_ACTIVE_POKEMON_IS_NOW_CONFUSED(store, state, effect);
        }
      });
    }

    return state;
  }
}
