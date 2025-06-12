import { PokemonCard } from '../../game/store/card/pokemon-card';
import { Stage, CardType } from '../../game/store/card/card-types';
import { StoreLike } from '../../game/store/store-like';
import { State } from '../../game/store/state/state';
import { Effect } from '../../game/store/effects/effect';
import { COIN_FLIP_PROMPT, CONFIRMATION_PROMPT, SWITCH_ACTIVE_WITH_BENCHED, WAS_ATTACK_USED } from '../../game/store/prefabs/prefabs';
import { AfterAttackEffect } from '../../game/store/effects/game-phase-effects';
import { GameMessage } from '../../game';

export class SamiyasBuizel2 extends PokemonCard {
  public stage: Stage = Stage.BASIC;
  public cardType: CardType = W;
  public hp: number = 60;
  public weakness = [{ type: L }];
  public retreat = [C];

  public attacks = [{
    name: 'Razor Wind',
    cost: [C],
    damage: 20,
    text: 'Flip a coin. If tails, this attack does nothing.'
  },
  {
    name: 'Smash Turn',
    cost: [W, C],
    damage: 20,
    text: 'After your attack, you may switch Samiya\'s Buizel with 1 of your Benched Pokémon.'
  }];

  public set: string = 'PCGP';
  public name: string = 'Samiya\'s Buizel';
  public fullName: string = 'Samiya\'s Buizel PCGP 151';
  public cardImage: string = 'assets/cardback.png';
  public setNumber: string = '151';

  private usedSmashTurn: boolean = false;

  public reduceEffect(store: StoreLike, state: State, effect: Effect): State {

    if (WAS_ATTACK_USED(effect, 0, this)) {
      COIN_FLIP_PROMPT(store, state, effect.player, result => {
        if (!result) {
          effect.damage = 0;
        }
      });
    }

    if (WAS_ATTACK_USED(effect, 1, this)) {
      this.usedSmashTurn = true;
    }

    if (effect instanceof AfterAttackEffect && this.usedSmashTurn) {
      CONFIRMATION_PROMPT(store, state, effect.player, result => {
        if (result) {
          SWITCH_ACTIVE_WITH_BENCHED(store, state, effect.player);
        }
      }, GameMessage.WANT_TO_SWITCH_POKEMON);

      this.usedSmashTurn = false;
    }

    return state;
  }

}
