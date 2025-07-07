import { PokemonCard } from '../../game/store/card/pokemon-card';
import { Stage, CardType } from '../../game/store/card/card-types';
import { StoreLike } from '../../game/store/store-like';
import { State } from '../../game/store/state/state';
import { Effect } from '../../game/store/effects/effect';
import { AfterAttackEffect } from '../../game/store/effects/game-phase-effects';
import { CONFIRMATION_PROMPT, SWITCH_ACTIVE_WITH_BENCHED, WAS_ATTACK_USED } from '../../game/store/prefabs/prefabs';
import { GameMessage } from '../../game';

export class Kirlia extends PokemonCard {
  public stage: Stage = Stage.STAGE_1;
  public evolvesFrom = 'Ralts';
  public cardType: CardType = P;
  public hp: number = 80;
  public weakness = [{ type: P, value: +20 }];
  public retreat = [C];

  public attacks = [{
    name: 'Teleportation Burst',
    cost: [P, C],
    damage: 30,
    text: 'You may switch Kirlia with 1 of your Benched Pokémon.'
  },
  {
    name: 'Super Psy Bolt',
    cost: [P, C, C],
    damage: 60,
    text: ''
  }];

  public set: string = 'PL';
  public cardImage: string = 'assets/cardback.png';
  public setNumber: string = '51';
  public name: string = 'Kirlia';
  public fullName: string = 'Kirlia PL';

  private usedTeleportationBurstTurn = false;

  public reduceEffect(store: StoreLike, state: State, effect: Effect): State {

    if (WAS_ATTACK_USED(effect, 0, this)) {
      CONFIRMATION_PROMPT(store, state, effect.player, result => {
        if (result) {
          this.usedTeleportationBurstTurn = true;
        }
      }, GameMessage.WANT_TO_SWITCH_POKEMON);
    }

    if (effect instanceof AfterAttackEffect && this.usedTeleportationBurstTurn) {
      const player = effect.player;
      SWITCH_ACTIVE_WITH_BENCHED(store, state, player);
      this.usedTeleportationBurstTurn = false;
    }

    return state;
  }

}