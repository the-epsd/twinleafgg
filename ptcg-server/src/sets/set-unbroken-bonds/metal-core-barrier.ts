import { PlayerType } from '../../game';
import { CardType, TrainerType } from '../../game/store/card/card-types';
import { TrainerCard } from '../../game/store/card/trainer-card';
import { PutDamageEffect } from '../../game/store/effects/attack-effects';
import { CheckPokemonTypeEffect } from '../../game/store/effects/check-effects';
import { Effect } from '../../game/store/effects/effect';
import { EndTurnEffect } from '../../game/store/effects/game-phase-effects';
import { ToolEffect } from '../../game/store/effects/play-card-effects';
import { StateUtils } from '../../game/store/state-utils';
import { GamePhase, State } from '../../game/store/state/state';
import { StoreLike } from '../../game/store/store-like';

export class MetalCoreBarrier extends TrainerCard {

  public trainerType: TrainerType = TrainerType.TOOL;

  public set: string = 'UNB';

  public cardImage: string = 'assets/cardback.png';

  public setNumber: string = '180';

  public name: string = 'Metal Core Barrier';

  public fullName: string = 'Metal Core Barrier UNB';

  public text: string =
    'If this card is attached to 1 of your Pokémon, discard it at the end of your opponent\'s turn. The [M] Pokémon this card is attached to takes 70 less damage from your opponent\'s attacks (after applying Weakness and Resistance).';

  public reduceEffect(store: StoreLike, state: State, effect: Effect): State {
    
    if (effect instanceof EndTurnEffect) {
      const cardList = StateUtils.findCardList(state, this);
      const player = StateUtils.findOwner(state, cardList);
      
      if (effect.player === player) {
        return state;
      }

      player.forEachPokemon(PlayerType.BOTTOM_PLAYER, (cardList, card, index) => {
        if (cardList.cards.includes(this)) {
          try {
            const toolEffect = new ToolEffect(player, this);
            store.reduceEffect(state, toolEffect);
          } catch {
            return state;
          }

          cardList.moveCardTo(this, player.discard);
          cardList.tool = undefined;
        }
      });

      return state;
    }
    
    if (effect instanceof PutDamageEffect && effect.target.cards.includes(this)) {
      
      const checkPokemonType = new CheckPokemonTypeEffect(effect.target);
      store.reduceEffect(state, checkPokemonType);

      if (!checkPokemonType.cardTypes.includes(CardType.METAL)) {
        return state;
      }
      
      // It's not an attack
      if (state.phase !== GamePhase.ATTACK) {
        return state;
      }
  
      if (effect.damageReduced) {
        // Damage already reduced, don't reduce again
        return state; 
      }
    
      const player = StateUtils.findOwner(state, effect.target);

      try {
        const toolEffect = new ToolEffect(player, this);
        store.reduceEffect(state, toolEffect);
      } catch {
        return state;
      }

      // Check if damage target is owned by this card's owner 
      const targetPlayer = StateUtils.findOwner(state, effect.target);
      if (targetPlayer === player) {
        effect.damage = Math.max(0, effect.damage - 70);
        effect.damageReduced = true;
      }
    
      return state;
    }
    return state;
  }

}
