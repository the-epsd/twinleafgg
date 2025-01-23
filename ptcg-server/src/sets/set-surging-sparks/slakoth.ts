import { PokemonCard } from '../../game/store/card/pokemon-card';
import { Stage, CardType } from '../../game/store/card/card-types';
import { StoreLike, State, PokemonCardList, StateUtils, GameError, GameMessage } from '../../game';
import { Effect } from '../../game/store/effects/effect';
import { AttackEffect, HealEffect } from '../../game/store/effects/game-effects';
import { EndTurnEffect } from '../../game/store/effects/game-phase-effects';
import { CheckRetreatCostEffect } from '../../game/store/effects/check-effects';

export class SlakothSSP extends PokemonCard {

  public stage: Stage = Stage.BASIC;

  public cardType: CardType = CardType.COLORLESS;

  public hp: number = 90;

  public weakness = [{ type: CardType.FIGHTING }];

  public retreat = [CardType.COLORLESS, CardType.COLORLESS];

  public attacks = [
    {
      name: 'Take It Easy',
      cost: [CardType.COLORLESS],
      damage: 0,
      text: 'Heal 60 damage from this Pokemon. During your next turn, this Pokemon can\'t retreat.'
    }
  ];

  public set: string = 'SSP';

  public setNumber = '145';

  public cardImage = 'assets/cardback.png';

  public regulationMark: string = 'H';

  public name: string = 'Slakoth';

  public fullName: string = 'Slakoth SSP';

  private readonly CANT_RETREAT_NEXT_TURN_MARKER = 'CANT_RETREAT_NEXT_TURN_MARKER';

  public reduceEffect(store: StoreLike, state: State, effect: Effect): State {
    // Take It Easy
    if (effect instanceof AttackEffect && effect.attack === this.attacks[0]) {
      const player = effect.player;
      const cardList = StateUtils.findCardList(state, this) as PokemonCardList;

      // Do heal effect
      const healEffect = new HealEffect(player, cardList, 60);
      store.reduceEffect(state, healEffect);

      // Put a marker that states we can't retreat next turn
      player.marker.addMarker(this.CANT_RETREAT_NEXT_TURN_MARKER, this);
    }

    // Handle putting on the real "can't retreat this turn" marker on ourselves.
    if (effect instanceof EndTurnEffect) {
      const marker = effect.player.marker;
      if (marker.hasMarker(this.CANT_RETREAT_NEXT_TURN_MARKER, this)) {
        marker.addMarker(PokemonCardList.DEFENDING_POKEMON_CANNOT_RETREAT_MARKER, this);
      }
      marker.removeMarker(this.CANT_RETREAT_NEXT_TURN_MARKER, this);
    }

    // Handle no retreat effect for ourselves.
    if (effect instanceof CheckRetreatCostEffect &&
      effect.player.active.marker.hasMarker(PokemonCardList.DEFENDING_POKEMON_CANNOT_RETREAT_MARKER, this)
    ) {
      throw new GameError(GameMessage.BLOCKED_BY_EFFECT);
    }

    return state;
  }

}
