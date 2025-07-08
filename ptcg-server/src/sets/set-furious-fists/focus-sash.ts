import { GameLog, PlayerType, StateUtils } from '../../game';
import { TrainerType } from '../../game/store/card/card-types';
import { TrainerCard } from '../../game/store/card/trainer-card';
import { PutDamageEffect } from '../../game/store/effects/attack-effects';
import { CheckHpEffect } from '../../game/store/effects/check-effects';
import { Effect } from '../../game/store/effects/effect';
import { IS_TOOL_BLOCKED } from '../../game/store/prefabs/prefabs';

import { State } from '../../game/store/state/state';
import { StoreLike } from '../../game/store/store-like';

export class FocusSash extends TrainerCard {

  public trainerType: TrainerType = TrainerType.TOOL;

  public set: string = 'FFI';

  public cardImage: string = 'assets/cardback.png';

  public setNumber: string = '91';

  public name = 'Focus Sash';

  public fullName = 'Focus Sash FFI';

  public text: string =
    'If the [F] Pokémon this card is attached to has full HP and would be Knocked Out by damage from an opponent\'s attack, that Pokémon is not Knocked Out and its remaining HP becomes 10 instead. Then, discard this card.';

  private canDiscard = false;

  public reduceEffect(store: StoreLike, state: State, effect: Effect): State {

    if (effect instanceof PutDamageEffect && effect.target.tools.includes(this) && effect.target.damage == 0) {
      const player = StateUtils.findOwner(state, effect.target);

      if (IS_TOOL_BLOCKED(store, state, effect.player, this)) { return state; }

      const checkHpEffect = new CheckHpEffect(player, effect.target);
      store.reduceEffect(state, checkHpEffect);

      if (effect.target.damage === 0 && effect.damage >= checkHpEffect.hp) {
        effect.preventDefault = true;
        effect.target.damage = checkHpEffect.hp - 10;
        store.log(state, GameLog.LOG_PLAYER_PLAYS_TOOL, { card: this.name });
        this.canDiscard = true;
      }

      if (this.canDiscard) {

        player.forEachPokemon(PlayerType.BOTTOM_PLAYER, (cardList, card, index) => {
          if (cardList.tools && cardList.tools.includes(this)) {
            cardList.moveCardTo(this, player.discard);
          }
        });
      }
    }
    return state;
  }
}