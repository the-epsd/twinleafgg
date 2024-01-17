import { PokemonCard, Stage, CardType, StoreLike, State, StateUtils, GamePhase } from '../../game';
import { Effect } from '../../game/store/effects/effect';
import { AttackEffect, KnockOutEffect } from '../../game/store/effects/game-effects';
import { EndTurnEffect } from '../../game/store/effects/game-phase-effects';


export class Tropius extends PokemonCard {

  public stage = Stage.BASIC; 
  public cardType = CardType.GRASS;
  public hp = 110;

  public weakness = [{ type: CardType.FIRE }];
  public resistance = [];
  public retreat = [CardType.COLORLESS];

  public attacks = [
    {
      name: 'Rally Back',
      cost: [CardType.GRASS, CardType.COLORLESS],
      damage: 30,
      text: 'If any of your Pokémon were Knocked Out by damage from an attack from your opponent\'s Pokémon during their last turn, this attack does 90 more damage.'
    },
    {
      name: 'Solar Beam',
      cost: [CardType.GRASS, CardType.GRASS, CardType.COLORLESS],
      damage: 100,
      text: ''
    }
  ];

  public set: string = 'EVS';

  public cardImage: string = 'assets/cardback.png';

  public setNumber: string = '6';

  public name: string = 'Tropius';

  public fullName: string = 'Tropius EVS';

  public readonly RALLY_BACK_MARKER = 'RALLY_BACK_MARKER';

  public reduceEffect(store: StoreLike, state: State, effect: Effect): State {
    if (effect instanceof AttackEffect && effect.attack === this.attacks[0]) {
      const player = effect.player;

      if (player.marker.hasMarker(this.RALLY_BACK_MARKER)) {
        effect.damage += 90;
      }

      return state;
    }

    if (effect instanceof KnockOutEffect) {
      const player = effect.player;
      const opponent = StateUtils.getOpponent(state, player);

      // Do not activate between turns, or when it's not opponents turn.
      if (state.phase !== GamePhase.ATTACK || state.players[state.activePlayer] !== opponent) {
        return state;
      }

      const cardList = StateUtils.findCardList(state, this);
      const owner = StateUtils.findOwner(state, cardList);
      if (owner === player) {
        effect.player.marker.addMarker(this.RALLY_BACK_MARKER, this);
      }
      return state;
    }

    if (effect instanceof EndTurnEffect) {
      effect.player.marker.removeMarker(this.RALLY_BACK_MARKER);
    }
    return state;
  }
}
