import { PokemonCard } from '../../game/store/card/pokemon-card';
import { Stage, CardType } from '../../game/store/card/card-types';
import { StoreLike, State } from '../../game';
import { Effect } from '../../game/store/effects/effect';
import { DealDamageEffect } from '../../game/store/effects/attack-effects';
import { COIN_FLIP_PROMPT, WAS_ATTACK_USED } from '../../game/store/prefabs/prefabs';
import { PREVENT_DAMAGE } from '../../game/store/prefabs/effect-of-attack-prefabs';

export class Chansey extends PokemonCard {
  public stage: Stage = Stage.BASIC;
  public cardType: CardType[] = [C];
  public hp: number = 120;
  public weakness = [{ type: F }];
  public resistance = [{ type: P, value: -30 }];
  public retreat = [C];

  public attacks = [{
    name: 'Scrunch',
    cost: [C, C],
    damage: 0,
    text: 'Flip a coin. If heads, prevent all damage done to Chansey during your opponent\'s next turn. (Any other effects of attacks still happen.)'
  }, {
    name: 'Double-edge',
    cost: [C, C, C, C],
    damage: 80,
    text: 'Chansey does 80 damage to itself.'
  }];

  public set: string = 'BS';
  public fullName = 'Chansey BS';
  public name = 'Chansey';
  public cardImage: string = 'assets/cardback.png';
  public setNumber: string = '3';

  public reduceEffect(store: StoreLike, state: State, effect: Effect): State {
    // Scrunch
    // Ref: set-astral-radiance/hisuian-growlithe.ts (Defensive Posture)
    if (WAS_ATTACK_USED(effect, 0, this)) {
      COIN_FLIP_PROMPT(store, state, effect.player, result => {
        if (result) {
          PREVENT_DAMAGE(store, state, effect, this);
        }
      });
    }

    // Double-edge
    if (WAS_ATTACK_USED(effect, 1, this)) {
      const player = effect.player;
      const dealDamage = new DealDamageEffect(effect, 80);
      dealDamage.target = player.active;
      return store.reduceEffect(state, dealDamage);
    }

    return state;
  }
}
