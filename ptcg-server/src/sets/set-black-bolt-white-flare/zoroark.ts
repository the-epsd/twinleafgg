import { PokemonCard, Stage, CardType, State, StoreLike, PlayerType } from '../../game';
import { Effect } from '../../game/store/effects/effect';
import { AttackEffect } from '../../game/store/effects/game-effects';
import { COPY_OPPONENT_ACTIVE_ATTACK, WAS_ATTACK_USED } from '../../game/store/prefabs/prefabs';

export class Zoroark extends PokemonCard {
  public stage: Stage = Stage.STAGE_1;
  public evolvesFrom = 'Zorua';
  public cardType: CardType = D;
  public hp: number = 120;
  public weakness = [{ type: G }];
  public retreat = [C];

  public attacks = [{
    name: 'Mind Jack',
    cost: [D],
    damage: 30,
    damageCalculation: 'x',
    text: 'This attack does 30 damage for each of your opponent\'s Benched Pokémon.'
  },
  {
    name: 'Foul Play',
    cost: [C, C, C],
    damage: 0,
    copycatAttack: true,
    text: 'Choose 1 of your opponent\'s Active Pokémon\'s attacks and use it as this attack.'
  }];

  public regulationMark = 'I';
  public set: string = 'WHT';
  public setNumber: string = '62';
  public cardImage: string = 'assets/cardback.png';
  public name: string = 'Zoroark';
  public fullName: string = 'Zoroark SV11W';

  public reduceEffect(store: StoreLike, state: State, effect: Effect): State {
    // Mind Jack
    if (WAS_ATTACK_USED(effect, 0, this)) {
      const opponent = effect.opponent;
      let benched = 0;

      opponent.forEachPokemon(PlayerType.BOTTOM_PLAYER, card => {
        if (card !== opponent.active) {
          benched++;
        }
      });

      effect.damage = benched * 30;
    }

    // Foul Play
    if (WAS_ATTACK_USED(effect, 1, this)) {
      return COPY_OPPONENT_ACTIVE_ATTACK(store, state, effect as AttackEffect);
    }

    return state;
  }
}
