import { GameError, GameMessage, Player, State, StateUtils, StoreLike } from '../../../game';
import { TrainerType } from '../../../game/store/card/card-types';
import { TrainerCard } from '../../../game/store/card/trainer-card';
import { DealDamageEffect } from '../../../game/store/effects/attack-effects';
import { Effect } from '../../../game/store/effects/effect';
import { EndTurnEffect } from '../../../game/store/effects/game-phase-effects';
import { DRAW_CARDS_UNTIL_CARDS_IN_HAND, SELECT_PROMPT_WITH_OPTIONS } from '../../../game/store/prefabs/prefabs';
import { WAS_TRAINER_USED } from '../../../game/store/prefabs/trainer-prefabs';

export class GiovannisScheme extends TrainerCard {
  protected _trainerType: TrainerType = TrainerType.SUPPORTER;
  public set: string = 'BKT';
  public cardImage: string = 'assets/cardback.png';
  public setNumber: string = '138';
  public name: string = "Giovanni's Scheme";
  public fullName: string = "Giovanni's Scheme BKT";
  public text: string =
    "Choose 1:\n• Draw cards until you have 5 cards in your hand.\n• During this turn, your Pokémon's attacks do 20 more damage to your opponent's Active Pokémon (before applying Weakness and Resistance). You may play only 1 Supporter card during your turn (before your attack).";

  private readonly GIOVANNIS_SCHEME_MARKER = 'GIOVANNIS_SCHEME_MARKER';

  public canPlay(store: StoreLike, state: State, player: Player): boolean {
    return player.supporterTurn === 0;
  }

  public reduceEffect(store: StoreLike, state: State, effect: Effect): State {
    // Clean up marker at end of turn
    if (
      effect instanceof EndTurnEffect &&
      effect.player.marker.hasMarker(this.GIOVANNIS_SCHEME_MARKER, this)
    ) {
      effect.player.marker.removeMarker(this.GIOVANNIS_SCHEME_MARKER, this);
      return state;
    }

    // Apply +20 damage on DealDamageEffect
    if (effect instanceof DealDamageEffect) {
      const player = effect.player;
      if (player.marker.hasMarker(this.GIOVANNIS_SCHEME_MARKER, this) && effect.damage > 0) {
        const opponent = StateUtils.getOpponent(state, player);
        if (effect.target === opponent.active) {
          effect.damage += 20;
        }
      }
    }

    if (WAS_TRAINER_USED(effect, this)) {
      const player = effect.player;

      if (player.supporterTurn > 0) {
        throw new GameError(GameMessage.SUPPORTER_ALREADY_PLAYED);
      }

      return SELECT_PROMPT_WITH_OPTIONS(store, state, player, GameMessage.CHOOSE_OPTION, [
        {
          message: GameMessage.WANT_TO_DRAW_CARDS,
          action: () => {
            DRAW_CARDS_UNTIL_CARDS_IN_HAND(player, 5);
          },
        },
        {
          message: GameMessage.WANT_TO_DEAL_MORE_DAMAGE,
          action: () => {
            player.marker.addMarker(this.GIOVANNIS_SCHEME_MARKER, this);
          },
        },
      ]);
    }

    return state;
  }
}
