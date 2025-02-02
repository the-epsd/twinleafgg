import { PokemonCard } from '../../game/store/card/pokemon-card';
import { Stage, CardType } from '../../game/store/card/card-types';
import {
  StoreLike, State,
  StateUtils,
  GamePhase
} from '../../game';
import { AttackEffect, KnockOutEffect } from '../../game/store/effects/game-effects';
import { Effect } from '../../game/store/effects/effect';
import { EndTurnEffect } from '../../game/store/effects/game-phase-effects';

export class Kangaskhan extends PokemonCard {

  public regulationMark = 'D';

  public stage: Stage = Stage.BASIC;

  public cardType: CardType = CardType.COLORLESS;

  public hp: number = 130;

  public weakness = [{ type: CardType.FIGHTING }];

  public retreat = [CardType.COLORLESS, CardType.COLORLESS];

  public attacks = [
    {
      name: 'Rally Back',
      cost: [CardType.COLORLESS, CardType.COLORLESS],
      damage: 30,
      damageCalculation: '+',
      text: 'If any of your Pokémon were Knocked Out by damage from an attack from your opponent\'s Pokémon during their last turn, this attack does 90 more damage.'
    },
    {
      name: 'Hammer In',
      cost: [CardType.COLORLESS, CardType.COLORLESS, CardType.COLORLESS],
      damage: 100,
      text: ''
    }
  ];

  public set: string = 'DAA';

  public cardImage: string = 'assets/cardback.png';

  public setNumber: string = '133';

  public name: string = 'Kangaskhan';

  public fullName: string = 'Kangaskhan DAA';

  public readonly RETALIATE_MARKER = 'RETALIATE_MARKER';

  public reduceEffect(store: StoreLike, state: State, effect: Effect): State {

    if (effect instanceof AttackEffect && effect.attack === this.attacks[0]) {
      const player = effect.player;

      if (player.marker.hasMarker(this.RETALIATE_MARKER)) {
        effect.damage += 90;
      }

      return state;
    }

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
        effect.player.marker.addMarkerToState(this.RETALIATE_MARKER);
      }
      return state;
    }

    if (effect instanceof EndTurnEffect) {
      effect.player.marker.removeMarker(this.RETALIATE_MARKER);
    }
    return state;
  }
}