import { PokemonCard } from '../../../game/store/card/pokemon-card';
import { CardType, SpecialCondition, Stage } from '../../../game/store/card/card-types';
import { PowerType, State, StateUtils, StoreLike } from '../../../game';
import { Effect } from '../../../game/store/effects/effect';
import { AttackEffect } from '../../../game/store/effects/game-effects';
import { COIN_FLIP_PROMPT, IS_POKEBODY_BLOCKED, WAS_ATTACK_USED } from '../../../game/store/prefabs/prefabs';

export class Primeape extends PokemonCard {
  public stage: Stage = Stage.STAGE_1;
  public evolvesFrom: string = 'Mankey';
  public hp: number = 90;
  public cardType: CardType[] = [F];
  public weakness = [{ type: P, value: +20 }];
  public retreat = [C];

  public powers = [{
    name: 'Anger Point',
    powerType: PowerType.POKEBODY,
    text: 'If Primeape has any damage counters on it, Primeape\'s attacks do 40 more damage to the Active Pokémon (before applying Weakness and Resistance).'
  }];

  public attacks = [{
    name: 'Whump',
    cost: [F, C, C],
    damage: 50,
    text: 'Primeape is now Confused. Flip a coin. If heads, the Defending Pokémon can\'t attack during your opponent\'s next turn.'
  }];

  public set: string = 'GE';
  public cardImage: string = 'assets/cardback.png';
  public setNumber: string = '27';
  public name: string = 'Primeape';
  public fullName: string = 'Primeape GE';

  public reduceEffect(store: StoreLike, state: State, effect: Effect): State {
    // Anger Point
    if (effect instanceof AttackEffect && effect.source.getPokemonCard() === this) {
      const player = effect.player;
      if (IS_POKEBODY_BLOCKED(store, state, player, this)) {
        return state;
      }
      if (effect.source.damage > 0 && effect.target === StateUtils.getOpponent(state, player).active) {
        effect.damage += 40;
      }
    }

    // Whump
    if (WAS_ATTACK_USED(effect, 0, this)) {
      effect.player.active.addSpecialCondition(SpecialCondition.CONFUSED);
      COIN_FLIP_PROMPT(store, state, effect.player, result => {
        if (result) {
          effect.opponent.active.cannotAttackNextTurnPending = true;
        }
      });
    }

    return state;
  }
}
