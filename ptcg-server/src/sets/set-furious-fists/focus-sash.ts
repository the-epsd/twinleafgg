import { PokemonCardList, StateUtils } from '../../game';
import { CardType, TrainerType } from '../../game/store/card/card-types';
import { TrainerCard } from '../../game/store/card/trainer-card';
import { PutDamageEffect } from '../../game/store/effects/attack-effects';
import { CheckPokemonTypeEffect } from '../../game/store/effects/check-effects';
import { Effect } from '../../game/store/effects/effect';
import { ToolEffect } from '../../game/store/effects/play-card-effects';
import { GamePhase, State } from '../../game/store/state/state';
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

  public reduceEffect(store: StoreLike, state: State, effect: Effect): State {

    if (effect instanceof PutDamageEffect && effect.target.tool === this) {
      const player = effect.player;
      const targetPlayer = StateUtils.findOwner(state, effect.target);

      const cardList = StateUtils.findCardList(state, this) as PokemonCardList;
      const checkPokemonTypeEffect = new CheckPokemonTypeEffect(cardList);

      if (effect.damage <= 0 || player === targetPlayer || !checkPokemonTypeEffect.cardTypes.includes(CardType.FIGHTING)) {
        return state;
      }

      const maxHp = effect.target.hp;

      try {
        const toolEffect = new ToolEffect(player, this);
        store.reduceEffect(state, toolEffect);
      } catch {
        return state;
      }

      if (state.phase === GamePhase.ATTACK) {
        if (effect.target.damage === 0) {
          if (effect.damage >= maxHp) {
            effect.damage = 0;
            effect.target.damage = effect.target.hp - 10;
            console.log('effect.target.hp - 10 = ' + (effect.target.hp - 10));
            cardList.moveCardTo(this, targetPlayer.discard);
            cardList.tool = undefined;
          }
        }
      }

      return state;
    }
    return state;
  }
}