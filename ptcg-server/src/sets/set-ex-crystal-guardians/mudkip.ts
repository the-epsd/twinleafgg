import { PokemonCard } from '../../game/store/card/pokemon-card';
import { Stage, CardType } from '../../game/store/card/card-types';
import { StoreLike } from '../../game/store/store-like';
import { State } from '../../game/store/state/state';
import { Effect } from '../../game/store/effects/effect';
import { PowerType } from '../../game/store/card/pokemon-types';
import { StateUtils } from '../../game/store/state-utils';
import { PutDamageEffect } from '../../game/store/effects/attack-effects';
import { IS_POKEBODY_BLOCKED } from '../../game/store/prefabs/prefabs';

export class Mudkip extends PokemonCard {
  public stage: Stage = Stage.BASIC;
  public cardType: CardType = W;
  public hp: number = 50;
  public weakness = [{ type: G }];
  public retreat = [C];

  public powers = [{
    name: 'Submerge',
    powerType: PowerType.POKEBODY,
    text: 'As long as Mudkip is on your Bench, prevent all damage done to Mudkip by attacks (both yours and your opponent\'s).'
  }];

  public attacks = [{
    name: 'Mud Slap',
    cost: [C],
    damage: 10,
    text: ''
  }];

  public set: string = 'CG';
  public name: string = 'Mudkip';
  public fullName: string = 'Mudkip CG';
  public cardImage: string = 'assets/cardback.png';
  public setNumber: string = '57';

  public reduceEffect(store: StoreLike, state: State, effect: Effect): State {

    if (effect instanceof PutDamageEffect) {
      const player = effect.player;
      const opponent = StateUtils.getOpponent(state, player);

      // Target is not Active
      if (effect.target === player.active || effect.target === opponent.active) {
        return state;
      }

      if (IS_POKEBODY_BLOCKED(store, state, player, this)) {
        return state;
      }

      // Target is this Mudkip
      if (effect.target.cards.includes(this) && effect.target.getPokemonCard() === this) {
        effect.preventDefault = true;
      }
    }

    return state;
  }

}
