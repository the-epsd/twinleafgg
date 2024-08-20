import { Stage, TrainerType } from '../../game/store/card/card-types';
import { TrainerCard } from '../../game/store/card/trainer-card';
import { PutDamageEffect } from '../../game/store/effects/attack-effects';
import { CheckHpEffect } from '../../game/store/effects/check-effects';
import { Effect } from '../../game/store/effects/effect';
import { ToolEffect } from '../../game/store/effects/play-card-effects';
import { StateUtils } from '../../game/store/state-utils';
import { State } from '../../game/store/state/state';
import { StoreLike } from '../../game/store/store-like';

export class FightingFuryBelt extends TrainerCard {

  public trainerType: TrainerType = TrainerType.TOOL;

  public set: string = 'BKP';

  public name: string = 'Fighting Fury Belt';

  public fullName: string = 'Fighting Fury Belt BKP';

  public cardImage: string = 'assets/cardback.png';

  public setNumber: string = '99';

  public text: string =
    'The Basic Pokémon this card is attached to gets +40 HP and its attacks do 10 more damage to your opponent\'s Active Pokémon (before applying Weakness and Resistance).';

  public reduceEffect(store: StoreLike, state: State, effect: Effect): State {
    if (effect instanceof PutDamageEffect && effect.source.cards.includes(this)) {
      const player = effect.player;
      const opponent = StateUtils.getOpponent(state, effect.player);

      try {
        const toolEffect = new ToolEffect(player, this);
        store.reduceEffect(state, toolEffect);
      } catch {
        return state;
      }

      if (effect.damage > 0 && effect.target === opponent.active) {
        effect.damage += 10;
      }
    }

    if (effect instanceof CheckHpEffect && effect.target.cards.includes(this)) {
      const player = effect.player;
      const card = effect.target.getPokemonCard();

      try {
        const toolEffect = new ToolEffect(player, this);
        store.reduceEffect(state, toolEffect);
      } catch {
        return state;
      }

      if (card === undefined) {
        return state;
      }

      if (card.stage === Stage.BASIC) {
        effect.hp += 40;
      }
    }

    return state;
  }

}
