import { PokemonCard } from '../../game/store/card/pokemon-card';
import { Stage, CardType } from '../../game/store/card/card-types';
import { StoreLike, State, StateUtils, GamePhase } from '../../game';
import { Effect } from '../../game/store/effects/effect';
import { AttackEffect, KnockOutEffect } from '../../game/store/effects/game-effects';
import { EndTurnEffect } from '../../game/store/effects/game-phase-effects';

export class Druddigon extends PokemonCard {

  public stage: Stage = Stage.BASIC;

  public cardType: CardType = CardType.DRAGON;

  public hp: number = 120;

  public retreat = [CardType.COLORLESS, CardType.COLORLESS];

  public attacks = [
    {
      name: 'Revenge',
      cost: [CardType.FIRE, CardType.WATER],
      damage: 40,
      text: 'If any of your Pokémon were Knocked Out by damage from an attack from your opponent\'s Pokémon during their last turn, this attack does 120 more damage.'
    },
    {
      name: 'Dragon Claw',
      cost: [CardType.FIRE, CardType.WATER, CardType.COLORLESS],
      damage: 120,
      text: ''
    }
  ];

  public set: string = 'BRS';

  public regulationMark = 'E';

  public cardImage: string = 'assets/cardback.png';

  public setNumber: string = '113';

  public name: string = 'Druddigon';

  public fullName: string = 'Druddigon BRS';

  public readonly REVENGE_MARKER = 'REVENGE_MARKER';

  // public damageDealt = false;

  public reduceEffect(store: StoreLike, state: State, effect: Effect): State {
    if (effect instanceof AttackEffect && effect.attack === this.attacks[0]) {
      const player = effect.player;

      if (player.marker.hasMarker(this.REVENGE_MARKER)) {
        effect.damage += 120;
      }

      return state;
    }

    // if ((effect instanceof DealDamageEffect || effect instanceof PutDamageEffect) &&
    //   effect.target.tool === this) {
    //   const player = StateUtils.getOpponent(state, effect.player);

    //   if (player.active.tool === this) {
    //     this.damageDealt = true;
    //   }
    // }

    if (effect instanceof KnockOutEffect && effect.player.marker.hasMarker(effect.player.DAMAGE_DEALT_MARKER)) {
      const player = effect.player;
      const opponent = StateUtils.getOpponent(state, player);

      // Do not activate between turns, or when it's not opponents turn.
      if (state.phase !== GamePhase.ATTACK || state.players[state.activePlayer] !== opponent) {
        return state;
      }

      const cardList = StateUtils.findCardList(state, this);
      const owner = StateUtils.findOwner(state, cardList);
      if (owner === player) {
        effect.player.marker.addMarkerToState(this.REVENGE_MARKER);
      }
      return state;
    }

    if (effect instanceof EndTurnEffect) {
      // const cardList = StateUtils.findCardList(state, this);
      // const owner = StateUtils.findOwner(state, cardList);

      // if (owner === effect.player) {
      //   this.damageDealt = false;
      // }

      effect.player.marker.removeMarker(this.REVENGE_MARKER);
    }

    return state;
  }

}
