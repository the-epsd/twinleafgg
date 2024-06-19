import { EnergyCard } from '../../game';
import { GameMessage } from '../../game/game-message';
import { PlayerType, SlotType } from '../../game/store/actions/play-card-action';
import { EnergyType, SuperType, TrainerType } from '../../game/store/card/card-types';
import { TrainerCard } from '../../game/store/card/trainer-card';
import { DealDamageEffect, PutDamageEffect } from '../../game/store/effects/attack-effects';
import { Effect } from '../../game/store/effects/effect';
import { AttackEffect, KnockOutEffect } from '../../game/store/effects/game-effects';
import { EndTurnEffect } from '../../game/store/effects/game-phase-effects';
import { ToolEffect } from '../../game/store/effects/play-card-effects';
import { AttachEnergyPrompt } from '../../game/store/prompts/attach-energy-prompt';
import { StateUtils } from '../../game/store/state-utils';
import { PokemonCardList } from '../../game/store/state/pokemon-card-list';
import { GamePhase, State } from '../../game/store/state/state';
import { StoreLike } from '../../game/store/store-like';

export class WishfulBaton extends TrainerCard {

  public trainerType: TrainerType = TrainerType.TOOL;

  public set: string = 'BUS';

  public name: string = 'Wishful Baton';

  public fullName: string = 'Wishful Baton BUS';

  public cardImage: string = 'assets/cardback.png';

  public setNumber: string = '128';

  public text: string =
    'If the Pokémon this card is attached to is your Active Pokémon and is Knocked Out by damage from an opponent\'s attack, move up to 3 basic Energy cards from that Pokémon to 1 of your Benched Pokémon.'

  public readonly EXP_SHARE_MARKER: string = 'EXP_SHARE_MARKER';
  
  public damageDealt = false;

  public reduceEffect(store: StoreLike, state: State, effect: Effect): State {

    if (effect instanceof AttackEffect && StateUtils.getOpponent(state, effect.player).active.tool === this &&
      (effect instanceof DealDamageEffect || effect instanceof PutDamageEffect)) {
        this.damageDealt = true;
    }
    
    if (effect instanceof EndTurnEffect) {
      this.damageDealt = false;
    }
    
    if (effect instanceof KnockOutEffect && effect.target === effect.player.active && effect.target.tool === this && this.damageDealt) {
      const player = effect.player;
      const opponent = StateUtils.getOpponent(state, player);

      // Do not activate between turns, or when it's not opponents turn.
      if (state.phase !== GamePhase.ATTACK || state.players[state.activePlayer] !== opponent) {
        return state;
      }
      
      try {
        const toolEffect = new ToolEffect(player, this);
        store.reduceEffect(state, toolEffect);
      } catch {
        return state;
      }

      // Make copy of the active pokemon cards,
      // because they will be transfered to discard shortly
      const activeCopy = new PokemonCardList();
      activeCopy.cards = player.active.cards.slice();
      const energyCards = activeCopy.cards.filter(c => c instanceof EnergyCard && c.energyType === EnergyType.BASIC);      
      
      const max = Math.min(energyCards.length, 3);
      
      state = store.prompt(state, new AttachEnergyPrompt(
        player.id,
        GameMessage.ATTACH_ENERGY_TO_BENCH,
        activeCopy,
        PlayerType.BOTTOM_PLAYER,
        [ SlotType.BENCH ],
        { superType: SuperType.ENERGY, energyType: EnergyType.BASIC },
        { allowCancel: false, min: 1, max, sameTarget: true }
      ), transfers => {
        transfers = transfers || [];
        for (const transfer of transfers) {
          const target = StateUtils.getTarget(state, player, transfer.to);
          player.discard.moveCardTo(transfer.card, target);
        }
      });
    }

    return state;
  }

}
