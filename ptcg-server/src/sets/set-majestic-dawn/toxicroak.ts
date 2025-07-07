import { State, StateUtils, StoreLike } from '../../game';
import { CardType, Stage } from '../../game/store/card/card-types';
import { PokemonCard } from '../../game/store/card/pokemon-card';
import { Effect } from '../../game/store/effects/effect';
import { AfterAttackEffect } from '../../game/store/effects/game-phase-effects';
import { ADD_PARALYZED_TO_PLAYER_ACTIVE, ADD_POISON_TO_PLAYER_ACTIVE, COIN_FLIP_PROMPT, WAS_ATTACK_USED } from '../../game/store/prefabs/prefabs';

export class Toxicroak extends PokemonCard {
  public stage: Stage = Stage.STAGE_1;
  public evolvesFrom: string = 'Croagunk';
  public cardType: CardType = P;
  public hp: number = 90;
  public weakness = [{ type: P, value: +20 }];
  public retreat = [C];

  public attacks = [{
    name: 'Paralyze Poison',
    cost: [P],
    damage: 20,
    text: 'The Defending Pokémon is now Poisoned. Flip a coin. If heads, the Defending Pokémon is now Paralyzed and Poisoned.'
  },
  {
    name: 'Slash',
    cost: [P, C, C],
    damage: 60,
    text: ''
  }];

  public set: string = 'MD';
  public cardImage: string = 'assets/cardback.png';
  public setNumber: string = '31';
  public name: string = 'Toxicroak';
  public fullName: string = 'Toxicroak MD';

  public usedParalyzePoison = false;

  public reduceEffect(store: StoreLike, state: State, effect: Effect): State {

    if (WAS_ATTACK_USED(effect, 0, this)) {
      this.usedParalyzePoison = true;
    }

    if (effect instanceof AfterAttackEffect && this.usedParalyzePoison) {
      this.usedParalyzePoison = false;
      ADD_POISON_TO_PLAYER_ACTIVE(store, state, StateUtils.getOpponent(state, effect.player), this);
      COIN_FLIP_PROMPT(store, state, effect.player, result => {
        if (result) {
          ADD_PARALYZED_TO_PLAYER_ACTIVE(store, state, StateUtils.getOpponent(state, effect.player), this);
        }
      });
    }

    return state;
  }
}