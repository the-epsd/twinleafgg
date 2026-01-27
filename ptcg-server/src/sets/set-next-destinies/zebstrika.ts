import { PokemonCard } from '../../game/store/card/pokemon-card';
import { Stage, CardType, EnergyType } from '../../game/store/card/card-types';
import { StoreLike, State, StateUtils, GameError, GameMessage, EnergyCard } from '../../game';
import { Effect } from '../../game/store/effects/effect';
import { WAS_ATTACK_USED } from '../../game/store/prefabs/prefabs';
import { THIS_ATTACK_DOES_X_DAMAGE_TO_1_OF_YOUR_OPPONENTS_POKEMON } from '../../game/store/prefabs/attack-effects';
import { PlayItemEffect } from '../../game/store/effects/play-card-effects';
import { EndTurnEffect } from '../../game/store/effects/game-phase-effects';
import { DiscardCardsEffect } from '../../game/store/effects/attack-effects';

export class Zebstrika extends PokemonCard {
  public stage: Stage = Stage.STAGE_1;
  public evolvesFrom = 'Blitzle';
  public cardType: CardType = L;
  public hp: number = 90;
  public weakness = [{ type: F }];
  public retreat = [];

  public attacks = [
    {
      name: 'Disconnect',
      cost: [L, C],
      damage: 40,
      text: 'Your opponent can\'t play any Item cards from his or her hand during your opponent\'s next turn.'
    },
    {
      name: 'Lightning Crash',
      cost: [L, L, C],
      damage: 0,
      text: 'Discard all Lightning Energy attached to this Pokemon. This attack does 80 damage to 1 of your opponent\'s Pokemon. (Don\'t apply Weakness and Resistance for Benched Pokemon.)'
    }
  ];

  public set: string = 'NXD';
  public setNumber: string = '48';
  public cardImage: string = 'assets/cardback.png';
  public name: string = 'Zebstrika';
  public fullName: string = 'Zebstrika NXD';

  public readonly OPPONENT_CANNOT_PLAY_ITEM_CARDS_MARKER = 'OPPONENT_CANNOT_PLAY_ITEM_CARDS_MARKER';

  public reduceEffect(store: StoreLike, state: State, effect: Effect): State {
    // Disconnect - block opponent's items
    if (WAS_ATTACK_USED(effect, 0, this)) {
      const player = effect.player;
      const opponent = StateUtils.getOpponent(state, player);

      opponent.marker.addMarker(this.OPPONENT_CANNOT_PLAY_ITEM_CARDS_MARKER, this);
    }

    // Block item cards
    if (effect instanceof PlayItemEffect) {
      const player = effect.player;
      if (player.marker.hasMarker(this.OPPONENT_CANNOT_PLAY_ITEM_CARDS_MARKER, this)) {
        throw new GameError(GameMessage.BLOCKED_BY_EFFECT);
      }
    }

    // Lightning Crash - discard all Lightning energy and deal 80 to any Pokemon
    if (WAS_ATTACK_USED(effect, 1, this)) {
      const player = effect.player;
      const lightningEnergy = player.active.cards.filter(card =>
        card instanceof EnergyCard &&
        card.energyType === EnergyType.BASIC &&
        card.provides.includes(CardType.LIGHTNING)
      );

      if (lightningEnergy.length > 0) {
        const discardEffect = new DiscardCardsEffect(effect, lightningEnergy);
        store.reduceEffect(state, discardEffect);
      }

      THIS_ATTACK_DOES_X_DAMAGE_TO_1_OF_YOUR_OPPONENTS_POKEMON(80, effect, store, state);
    }

    // Remove marker at end of turn
    if (effect instanceof EndTurnEffect) {
      effect.player.marker.removeMarker(this.OPPONENT_CANNOT_PLAY_ITEM_CARDS_MARKER, this);
    }

    return state;
  }
}
