import { PokemonCard } from '../../game/store/card/pokemon-card';
import { Stage, CardType } from '../../game/store/card/card-types';
import { State } from '../../game/store/state/state';
import { AttackEffect } from '../../game/store/effects/game-effects';
import { StoreLike } from '../../game/store/store-like';
import { Effect } from '../../game/store/effects/effect';
import { DealDamageEffect } from '../../game/store/effects/attack-effects';
import { StateUtils } from '../../game';

export class Zacian extends PokemonCard {
  public stage: Stage = Stage.BASIC;
  public cardType: CardType = P;
  public hp: number = 130;
  public weakness = [{ type: M }];
  public resistance = [];
  public retreat = [C, C];

  public attacks = [{
    name: 'Limit Break',
    cost: [P, C],
    damage: 50,
    text: 'If your opponent has 3 or fewer Prize cards remaining, this attack does 90 more damage.',
  }];

  public regulationMark = 'I';
  public set: string = 'M2';
  public cardImage: string = 'assets/cardback.png';
  public setNumber: string = '39';
  public name: string = 'Zacian';
  public fullName: string = 'Zacian M2';

  public reduceEffect(store: StoreLike, state: State, effect: Effect): State {
    if (effect instanceof AttackEffect && effect.attack === this.attacks[0]) {
      const player = effect.player;
      const opponent = StateUtils.getOpponent(state, player);

      if (opponent && opponent.getPrizeLeft() <= 3) {
        // Add 90 more damage if opponent has 3 or fewer Prize cards
        const damageEffect = new DealDamageEffect(effect, 90);
        damageEffect.target = effect.target;
        return store.reduceEffect(state, damageEffect);
      }
    }

    return state;
  }
}
