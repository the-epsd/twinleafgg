import { PokemonCardList, StateUtils } from '../../game';
import { CardType, TrainerType } from '../../game/store/card/card-types';
import { TrainerCard } from '../../game/store/card/trainer-card';
import { AfterDamageEffect } from '../../game/store/effects/attack-effects';
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

    if (effect instanceof AfterDamageEffect && effect.target.tool === this) {
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
        if (player.active.damage === 0) {
          if (effect.source.damage >= maxHp) {
            effect.preventDefault = true;
            effect.damage = maxHp - 10;
          }
        }
      }

      return state;
    }
    return state;
  }
}