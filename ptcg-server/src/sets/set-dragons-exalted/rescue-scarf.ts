import { TrainerCard } from '../../game/store/card/trainer-card';
import { TrainerType } from '../../game/store/card/card-types';
import { StoreLike } from '../../game/store/store-like';
import { State, GamePhase } from '../../game/store/state/state';
import { Effect } from '../../game/store/effects/effect';
import { AttackEffect, KnockOutEffect } from '../../game/store/effects/game-effects';
import { BetweenTurnsEffect, EndTurnEffect } from '../../game/store/effects/game-phase-effects';
import { Card } from '../../game/store/card/card';
import { ToolEffect } from '../../game/store/effects/play-card-effects';
import { StateUtils } from '../../game';
import { DealDamageEffect, PutDamageEffect } from '../../game/store/effects/attack-effects';

export class RescueScarf extends TrainerCard {

  public trainerType: TrainerType = TrainerType.TOOL;

  public set: string = 'DRX';

  public name: string = 'Rescue Scarf';

  public fullName: string = 'Rescue Scarf DRX';

  public cardImage: string = 'assets/cardback.png';

  public setNumber: string = '115';

  public text: string =
    'If the Pokemon this card is attached to is Knocked Out by damage from ' +
    'an attack, put that Pokemon into your hand. (Discard all cards ' +
    'attached to that Pokemon.)';

  public readonly RESCUE_SCARF_MAREKER = 'RESCUE_SCARF_MAREKER';

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

    if (effect instanceof KnockOutEffect && effect.target.cards.includes(this) && this.damageDealt) {
      const player = effect.player;

      // Do not activate between turns, or when it's not opponents turn.
      if (state.phase !== GamePhase.ATTACK) {
        return state;
      }

      try {
        const toolEffect = new ToolEffect(player, this);
        store.reduceEffect(state, toolEffect);
      } catch {
        return state;
      }

      const target = effect.target;
      const cards = target.getPokemons();
      cards.forEach(card => {
        player.marker.addMarker(this.RESCUE_SCARF_MAREKER, card);
      });
    }

    if (effect instanceof BetweenTurnsEffect) {
      state.players.forEach(player => {

        if (!player.marker.hasMarker(this.RESCUE_SCARF_MAREKER)) {
          return;
        }

        try {
          const toolEffect = new ToolEffect(player, this);
          store.reduceEffect(state, toolEffect);
        } catch {
          return state;
        }

        const rescued: Card[] = player.marker.markers
          .filter(m => m.name === this.RESCUE_SCARF_MAREKER)
          // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
          .map(m => m.source!)
          .filter((card): card is Card => card !== undefined);

        player.discard.moveCardsTo(rescued, player.hand);
        player.marker.removeMarker(this.RESCUE_SCARF_MAREKER);
      });
    }

    return state;
  }

}
