import { PokemonCard } from '../../../game/store/card/pokemon-card';
import { Stage, CardType } from '../../../game/store/card/card-types';
import { StoreLike, State } from '../../../game';
import { Effect } from '../../../game/store/effects/effect';
import { HealEffect } from '../../../game/store/effects/game-effects';
import { WAS_ATTACK_USED, COIN_FLIP_PROMPT } from '../../../game/store/prefabs/prefabs';

export class Slakoth extends PokemonCard {
  public stage: Stage = Stage.BASIC;
  public cardType: CardType[] = [C];
  public hp: number = 60;
  public weakness = [{ type: F }];
  public retreat = [C];

  public attacks = [{
    name: 'Claw',
    cost: [C],
    damage: 20,
    text: 'Flip a coin. If tails, this attack does nothing. '
  }, {
    name: 'Slack Off',
    cost: [C, C],
    damage: 0,
    text: 'Heal all damage from this Pokémon. It can\'t attack during your next turn.'
  }];

  public set: string = 'CES';
  public setNumber: string = '113';
  public cardImage: string = 'assets/cardback.png';
  public name: string = 'Slakoth';
  public fullName: string = 'Slakoth CES';

  public reduceEffect(store: StoreLike, state: State, effect: Effect): State {

    if (WAS_ATTACK_USED(effect, 0, this)) {
      return COIN_FLIP_PROMPT(store, state, effect.player, heads => {
        if (heads) {
          effect.damage = 0;
        }
      });
    }

    // Slack Off
    if (WAS_ATTACK_USED(effect, 1, this)) {
      const player = effect.player;
      player.active.cannotAttackNextTurnPending = true;

      const healEffect = new HealEffect(player, player.active, player.active.damage);
      state = store.reduceEffect(state, healEffect);
    }

    return state;
  }
}