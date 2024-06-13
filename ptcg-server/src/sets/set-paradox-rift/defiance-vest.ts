import { TrainerCard } from '../../game/store/card/trainer-card';
import { TrainerType } from '../../game/store/card/card-types';
import { StoreLike } from '../../game/store/store-like';
import { GamePhase, State } from '../../game/store/state/state';
import { Effect } from '../../game/store/effects/effect';
import { GameError, GameMessage, StateUtils } from '../../game';
import { PutDamageEffect } from '../../game/store/effects/attack-effects';
import { ToolEffect } from '../../game/store/effects/play-card-effects';

export class DefianceVest extends TrainerCard {

  public trainerType: TrainerType = TrainerType.TOOL;

  public regulationMark = 'G';

  public cardImage: string = 'assets/cardback.png';

  public setNumber: string = '162';

  public set: string = 'PAR';

  public name: string = 'Defiance Vest';

  public fullName: string = 'Defiance Vest PAR';

  public text: string =
    'If you have more Prize cards remaining than your opponent, the Pokémon this card is attached to takes 40 less damage from attacks from your opponent\'s Pokémon (after applying Weakness and Resistance).';

  public reduceEffect(store: StoreLike, state: State, effect: Effect): State {

    // Reduce damage by 40
    if (effect instanceof PutDamageEffect && effect.target.cards.includes(this)) {
      const player = effect.player;
      const opponent = StateUtils.getOpponent(state, player);
    
      try {
        const toolEffect = new ToolEffect(player, this);
        store.reduceEffect(state, toolEffect);
      } catch {
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
    
      if (player.getPrizeLeft() <= opponent.getPrizeLeft()) {
        throw new GameError(GameMessage.CANNOT_PLAY_THIS_CARD);
      }
    
      // Check if damage target is owned by this card's owner 
      const targetPlayer = StateUtils.findOwner(state, effect.target);
      if (targetPlayer === player) {
        effect.damage = Math.max(0, effect.damage - 40);
        effect.damageReduced = true;
      }
    
      return state;
    }
    return state;
  }
}
