import { PokemonCard } from '../../game/store/card/pokemon-card';
import { Stage, CardType, CardTag } from '../../game/store/card/card-types';
import { StoreLike, State, PowerType, GameError, GameMessage } from '../../game';

import { Effect } from '../../game/store/effects/effect';
import { EndTurnEffect } from '../../game/store/effects/game-phase-effects';
import { DEAL_MORE_DAMAGE_FOR_EACH_PRIZE_CARD_TAKEN, DRAW_CARDS, MOVE_CARDS, WAS_ATTACK_USED, WAS_POWER_USED } from '../../game/store/prefabs/prefabs';

export class ZamazentaV extends PokemonCard {

  public stage: Stage = Stage.BASIC;

  public tags = [CardTag.POKEMON_V];

  public cardType: CardType = CardType.METAL;

  public hp: number = 220;

  public weakness = [{ type: CardType.FIRE }];

  public resistance = [{ type: CardType.GRASS, value: -30 }];

  public retreat = [CardType.COLORLESS, CardType.COLORLESS];

  public powers = [{
    name: 'Regal Stance',
    useWhenInPlay: true,
    powerType: PowerType.ABILITY,
    text: 'Once during your turn, you may discard your hand and draw 5 cards. If you use this Ability, your turn ends.'
  }];

  public attacks = [{
    name: 'Revenge Blast',
    cost: [CardType.METAL, CardType.COLORLESS, CardType.COLORLESS],
    damage: 120,
    damageCalculation: '+',
    text: 'This attack does 30 more damage for each Prize card your opponent has taken.'
  }];

  public set: string = 'CRZ';

  public regulationMark = 'F';

  public cardImage: string = 'assets/cardback.png';

  public setNumber: string = '98';

  public name: string = 'Zamazenta V';

  public fullName: string = 'Zamazenta V CRZ';

  public reduceEffect(store: StoreLike, state: State, effect: Effect): State {

    if (WAS_POWER_USED(effect, 0, this)) {

      const player = effect.player;

      if (player.deck.cards.length === 0) {
        throw new GameError(GameMessage.CANNOT_USE_POWER);
      }

      MOVE_CARDS(store, state, player.hand, player.discard, { sourceCard: this, sourceEffect: this.powers[0] });
      DRAW_CARDS(player, 5);
      const endTurnEffect = new EndTurnEffect(player);
      store.reduceEffect(state, endTurnEffect);
      return state;
    }

    if (WAS_ATTACK_USED(effect, 0, this)) {
      DEAL_MORE_DAMAGE_FOR_EACH_PRIZE_CARD_TAKEN(effect, state, 30);
    }
    return state;
  }
}