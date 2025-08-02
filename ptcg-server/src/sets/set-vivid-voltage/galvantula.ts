import { State, StoreLike, PokemonCard, Stage, CardType, StateUtils } from '../../game';
import { Effect } from '../../game/store/effects/effect';
import { WAS_ATTACK_USED, THIS_ATTACK_DOES_X_MORE_DAMAGE, ADD_PARALYZED_TO_PLAYER_ACTIVE, COIN_FLIP_PROMPT, } from '../../game/store/prefabs/prefabs';

export class Galvantula extends PokemonCard {
  public stage: Stage = Stage.STAGE_1;
  public evolvesFrom = 'Joltik';
  public cardType: CardType = L;
  public hp: number = 90;
  public weakness = [{ type: F }];
  public retreat = [C];

  public attacks = [
    {
      name: 'Stun Needle',
      cost: [L],
      damage: 20,

      text: 'Flip a coin. If heads, your opponent\'s Active Pokemon is now Paralyzed.',
    },

    {
      name: 'Shocking Pursuit',
      cost: [L, C],
      damage: 0,
      damageCalculation: 'x',
      text: 'This attack does 20 damage for each damage counter on your opponent\'s Active Pokemon.'


    }
  ];

  public set: string = 'VIV';
  public regulationMark: string = 'D';
  public cardImage: string = 'assets/cardback.png';
  public setNumber: string = '56';
  public name: string = 'Galvantula';
  public fullName: string = 'Galvantula VIV';

  public reduceEffect(store: StoreLike, state: State, effect: Effect): State {
    // Stun Needle
    if (WAS_ATTACK_USED(effect, 0, this)) {
      COIN_FLIP_PROMPT(store, state, effect.player, result => {
        if (result) { ADD_PARALYZED_TO_PLAYER_ACTIVE(store, state, effect.opponent, this); }
      });
    }

    {
      // Shocking Pursuit
      if (WAS_ATTACK_USED(effect, 1, this)) {
        const opponent = StateUtils.getOpponent(state, effect.player);
        THIS_ATTACK_DOES_X_MORE_DAMAGE(effect, store, state, 2 * opponent.active.damage);
      }

      return state;
    }
  }
}