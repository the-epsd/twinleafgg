import { PokemonCard } from '../../game/store/card/pokemon-card';
import { Stage, CardType } from '../../game/store/card/card-types';
import { StoreLike, State, StateUtils } from '../../game';
import { CheckHpEffect } from '../../game/store/effects/check-effects';
import { Effect } from '../../game/store/effects/effect';
import { BEFORE_DAMAGE, OPPONENTS_POKEMON_CANNOT_USE_THAT_ATTACK, WAS_ATTACK_USED } from '../../game/store/prefabs/prefabs';

export class Swalot extends PokemonCard {
  public stage: Stage = Stage.STAGE_1;
  public evolvesFrom: string = 'Gulpin';
  public cardType: CardType = P;
  public hp: number = 120;
  public weakness = [{ type: P }];
  public retreat = [C, C];

  public attacks = [{
    name: 'Amnesia',
    cost: [C],
    damage: 30,
    text: 'Choose 1 of your opponent\'s Active Pokémon\'s attacks. That Pokémon can\'t use that attack during your opponent\'s next turn.'
  },
  {
    name: 'Swallow Up',
    cost: [P, C, C],
    damage: 40,
    damageCalculation: '+',
    text: 'If, before doing damage, your opponent\'s Active Pokémon has less remaining HP than this Pokémon, this attack does 80 more damage.'
  }];

  public set: string = 'CES';
  public setNumber: string = '58';
  public cardImage: string = 'assets/cardback.png';
  public name: string = 'Swalot';
  public fullName: string = 'Swalot CES';

  public reduceEffect(store: StoreLike, state: State, effect: Effect): State {
    if (WAS_ATTACK_USED(effect, 0, this)) {
      return OPPONENTS_POKEMON_CANNOT_USE_THAT_ATTACK(store, state, effect, this);
    }

    if (BEFORE_DAMAGE(effect, 1, this)) {
      const player = effect.player;
      const opponent = StateUtils.getOpponent(state, player);

      const opponentCheckHp = new CheckHpEffect(opponent, opponent.active);
      store.reduceEffect(state, opponentCheckHp);
      const opponentRemainingHp = opponentCheckHp.hp - opponent.active.damage;

      const myCheckHp = new CheckHpEffect(player, player.active);
      store.reduceEffect(state, myCheckHp);
      const myRemainingHp = myCheckHp.hp - player.active.damage;

      if (opponentRemainingHp < myRemainingHp) {
        effect.attackEffect.damage += 80;
      }
    }

    return state;
  }
}
