import { TrainerCard } from '../../game/store/card/trainer-card';
import { CardTag, TrainerType } from '../../game/store/card/card-types';
import { StoreLike } from '../../game/store/store-like';
import { State, GamePhase } from '../../game/store/state/state';
import { Effect } from '../../game/store/effects/effect';
import { KnockOutEffect } from '../../game/store/effects/game-effects';
import { BetweenTurnsEffect } from '../../game/store/effects/game-phase-effects';
import { Card } from '../../game/store/card/card';
import { ChooseCardsPrompt, GameLog, GameMessage, ShuffleDeckPrompt } from '../../game';

export class AmuletofHope extends TrainerCard {

  public tags = [CardTag.ACE_SPEC];

  public trainerType: TrainerType = TrainerType.TOOL;

  public set: string = 'SSP';

  public setNumber = '162';

  public cardImage = 'assets/cardback.png';

  public regulationMark: string = 'H';

  public name: string = 'Amulet of Hope';

  public fullName: string = 'Amulet of Hope SSP';

  public text: string =
    'If the Pokémon this card is attached to is Knocked Out by damage from an attack from your opponent\'s Pokémon, search your deck for up to 3 cards and put them into your hand. Then, shuffle your deck.';

  public readonly AMULET_OF_HOPE_MARKER = 'AMULET_OF_HOPE_MARKER';

  public reduceEffect(store: StoreLike, state: State, effect: Effect): State {
    if (effect instanceof KnockOutEffect && effect.target.cards.includes(this)) {
      const player = effect.player;

      if (state.phase !== GamePhase.ATTACK) {
        return state;
      }

      const target = effect.target;
      const cards = target.getPokemons();
      cards.forEach(card => {
        player.marker.addMarker(this.AMULET_OF_HOPE_MARKER, card);
      });
    }

    if (effect instanceof BetweenTurnsEffect) {
      state.players.forEach(player => {

        if (!player.marker.hasMarker(this.AMULET_OF_HOPE_MARKER)) {
          return state;
        }

        if (player.deck.cards.length === 0) {
          return state;
        }

        store.log(state, GameLog.LOG_PLAYER_USES_ABILITY, { name: player.name, card: 'Amulet of Hope' });

        let cards: Card[] = [];
        store.prompt(state, new ChooseCardsPrompt(
          player,
          GameMessage.CHOOSE_CARD_TO_HAND,
          player.deck,
          {},
          { min: 0, max: 3, allowCancel: false }
        ), selected => {
          cards = selected || [];
          player.deck.moveCardsTo(cards, player.hand);
        });

        store.prompt(state, new ShuffleDeckPrompt(player.id), order => {
          player.deck.applyOrder(order);
        });

        player.marker.removeMarker(this.AMULET_OF_HOPE_MARKER);
      });
    }

    return state;
  }

}
