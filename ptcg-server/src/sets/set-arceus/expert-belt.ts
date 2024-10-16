import { TrainerCard } from '../../game/store/card/trainer-card';
import { TrainerType } from '../../game/store/card/card-types';
import { StoreLike } from '../../game/store/store-like';
import { State } from '../../game/store/state/state';
import { Effect } from '../../game/store/effects/effect';
import { CheckHpEffect } from '../../game/store/effects/check-effects';
import { KnockOutEffect } from '../../game/store/effects/game-effects';
import { StateUtils } from '../../game/store/state-utils';
import { DealDamageEffect } from '../../game/store/effects/attack-effects';
import { ToolEffect } from '../../game/store/effects/play-card-effects';

export class ExpertBelt extends TrainerCard {

  public trainerType: TrainerType = TrainerType.TOOL;

  public set: string = 'AR';

  public name: string = 'Expert Belt';

  public fullName: string = 'Expert Belt AR';

  public cardImage: string = 'assets/cardback.png';

  public setNumber: string = '87';

  public text: string =
    'The Pokemon this card is attached to gets +20 HP and that Pokemon\'s ' +
    'attacks do 20 more damage to your opponent\'s Active Pokemon (before ' +
    'applying Weakness and Resistance). When the Pokemon this card is ' +
    'attached to is Knocked Out, your opponent takes 1 more Prize card.';

  public reduceEffect(store: StoreLike, state: State, effect: Effect): State {
    if (effect instanceof CheckHpEffect && effect.target.cards.includes(this)) {
      const player = effect.player;

      try {
        const toolEffect = new ToolEffect(player, this);
        store.reduceEffect(state, toolEffect);
      } catch {
        return state;
      }

      effect.hp += 20;
    }

    if (effect instanceof DealDamageEffect && effect.source.cards.includes(this)) {
      const opponent = StateUtils.getOpponent(state, effect.player);
      const player = effect.player;

      try {
        const toolEffect = new ToolEffect(player, this);
        store.reduceEffect(state, toolEffect);
      } catch {
        return state;
      }

      if (effect.damage > 0 && effect.target === opponent.active) {
        effect.damage += 20;
      }
    }

    if (effect instanceof KnockOutEffect && effect.target.cards.includes(this)) {
      const player = effect.player;

      try {
        const toolEffect = new ToolEffect(player, this);
        store.reduceEffect(state, toolEffect);
      } catch {
        return state;
      }

      effect.prizeCount += 1;
    }

    return state;
  }

}
