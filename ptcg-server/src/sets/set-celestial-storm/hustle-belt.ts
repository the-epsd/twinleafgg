import { TrainerType } from '../../game/store/card/card-types';
import { TrainerCard } from '../../game/store/card/trainer-card';
import { DealDamageEffect } from '../../game/store/effects/attack-effects';
import { Effect } from '../../game/store/effects/effect';
import { ToolEffect } from '../../game/store/effects/play-card-effects';
import { StateUtils } from '../../game/store/state-utils';
import { State } from '../../game/store/state/state';
import { StoreLike } from '../../game/store/store-like';

export class HustleBelt extends TrainerCard {

  public trainerType: TrainerType = TrainerType.TOOL;

  public set: string = 'CES';

  public name: string = 'Hustle Belt';

  public fullName: string = 'Hustle Belt CES';

  public cardImage: string = 'assets/cardback.png';

  public setNumber: string = '134';

  public text: string =
    'If the Pokémon this card is attached to has 30 HP or less remaining and has any damage counters on it, its attacks do 60 more damage to your opponent\'s Active Pokémon (before applying Weakness and Resistance).';

  public reduceEffect(store: StoreLike, state: State, effect: Effect): State {
    if (effect instanceof DealDamageEffect && effect.source.cards.includes(this)) {
      const player = effect.player;
      const opponent = StateUtils.getOpponent(state, effect.player);

      try {
        const toolEffect = new ToolEffect(player, this);
        store.reduceEffect(state, toolEffect);
      } catch {
        return state;
      }

      if (effect.damage > 0 && effect.target === opponent.active && effect.source.damage !== 0 && effect.source.hp - effect.source.damage <= 30) {
        effect.damage += 60;
      }
    }

    return state;
  }

}
