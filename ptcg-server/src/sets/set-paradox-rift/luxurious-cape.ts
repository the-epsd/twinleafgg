import { TrainerCard } from '../../game/store/card/trainer-card';
import { TrainerType } from '../../game/store/card/card-types';
import { StoreLike, State, StateUtils } from '../../game';
import { Effect } from '../../game/store/effects/effect';
import { CheckHpEffect } from '../../game/store/effects/check-effects';
import { AttackEffect, KnockOutEffect } from '../../game/store/effects/game-effects';
import { ToolEffect } from '../../game/store/effects/play-card-effects';
import { DealDamageEffect, PutDamageEffect } from '../../game/store/effects/attack-effects';
import { EndTurnEffect } from '../../game/store/effects/game-phase-effects';

export class LuxuriousCape extends TrainerCard {

  public trainerType: TrainerType = TrainerType.TOOL;

  public regulationMark = 'G';

  public set: string = 'PAR';

  public cardImage: string = 'assets/cardback.png';

  public setNumber: string = '166';

  public name: string = 'Luxurious Cape';

  public fullName: string = 'Luxurious Cape PAR';

  public text: string = 
    'If the Pokémon this card is attached to doesn\'t have a Rule Box, it gets +100 HP, and if it is Knocked Out by damage from an attack from your opponent\'s Pokémon, that player takes 1 more Prize card. (Pokémon ex, Pokémon V, etc. have Rule Boxes.)';
    
  public damageDealt = false;

  public reduceEffect(store: StoreLike, state: State, effect: Effect): State {

    if (effect instanceof AttackEffect && effect.player.active.tool === this) {
      this.damageDealt = false;
    }

    if ((effect instanceof DealDamageEffect || effect instanceof PutDamageEffect) &&
        effect.target.tool === this) {
      const player = StateUtils.getOpponent(state, effect.player);

      if (player.active.tool === this) {
        this.damageDealt = true;
      }
    }
    
    if (effect instanceof EndTurnEffect && effect.player === StateUtils.getOpponent(state, effect.player)) {
      const cardList = StateUtils.findCardList(state, this);
      const owner = StateUtils.findOwner(state, cardList);
      
      if (owner === effect.player) {
        this.damageDealt = false;
      }
    }
    
    if (effect instanceof CheckHpEffect && effect.target.cards.includes(this)) {
      const player = effect.player;

      try {
        const toolEffect = new ToolEffect(player, this);
        store.reduceEffect(state, toolEffect);
      } catch {
        return state;
      }

      if (effect.target.tool instanceof LuxuriousCape) {
        if (effect.target.hasRuleBox()) {
          return state;
        }
        effect.hp += 100;
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

      if (!effect.target.hasRuleBox() && this.damageDealt) {
        effect.prizeCount += 1;
      }
      
      return state;
    }
    return state;
  }
}



