import { GameError, GameMessage, PokemonCard, Stage, State, StateUtils, StoreLike } from '../../game';
import { Effect } from '../../game/store/effects/effect';
import { AfterAttackEffect } from '../../game/store/effects/game-phase-effects';
import { THIS_ATTACK_DOES_X_DAMAGE_TO_1_OF_YOUR_OPPONENTS_BENCHED_POKEMON } from '../../game/store/prefabs/attack-effects';
import { ADD_POISON_TO_PLAYER_ACTIVE, WAS_ATTACK_USED } from '../../game/store/prefabs/prefabs';

export class Venomoth extends PokemonCard {
  public cardType = G;
  public stage = Stage.STAGE_1;
  public evolvesFrom = 'Venonat';
  public hp = 90;
  public weakness = [{ type: R }];
  public retreat = [];

  public attacks = [{
    name: 'Assassin Flight',
    cost: [C],
    damage: 0,
    text: 'You can use this attack only if your opponent\'s Active Pokémon is affected by a Special Condition. This attack does 90 damage to 1 of your opponent\'s Benched Pokémon. (Don\'t apply Weakness and Resistance for Benched Pokémon.)'
  },
  {
    name: 'Poision Powder',
    cost: [G],
    damage: 30,
    text: ''
  }];

  public set = 'UNB';
  public setNumber = '11';
  public cardImage: string = 'assets/cardback.png';
  public name: string = 'Venomoth';
  public fullName = 'Venomoth UNB';

  public usedPoisonPowder = false;

  public reduceEffect(store: StoreLike, state: State, effect: Effect): State {

    if (WAS_ATTACK_USED(effect, 0, this)) {
      if (effect.opponent.active.specialConditions.length === 0) {
        throw new GameError(GameMessage.CANNOT_USE_ATTACK);
      }

      THIS_ATTACK_DOES_X_DAMAGE_TO_1_OF_YOUR_OPPONENTS_BENCHED_POKEMON(90, effect, store, state);
    }

    if (WAS_ATTACK_USED(effect, 1, this)) {
      this.usedPoisonPowder = true;
    }

    if (effect instanceof AfterAttackEffect && this.usedPoisonPowder === true) {
      this.usedPoisonPowder = false;
      ADD_POISON_TO_PLAYER_ACTIVE(store, state, StateUtils.getOpponent(state, effect.player), this);
    }

    return state;
  }
}