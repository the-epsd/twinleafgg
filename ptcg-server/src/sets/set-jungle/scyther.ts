import { PokemonCard } from '../../game/store/card/pokemon-card';
import { Stage, CardType } from '../../game/store/card/card-types';
import { StoreLike, State, StateUtils, PlayerType } from '../../game';
import { Effect } from '../../game/store/effects/effect';
import { AttackEffect } from '../../game/store/effects/game-effects';
import { EndTurnEffect } from '../../game/store/effects/game-phase-effects';

export class Scyther extends PokemonCard {

  public stage: Stage = Stage.BASIC;

  public cardType: CardType = CardType.GRASS;

  public hp: number = 70;

  public weakness = [{ type: CardType.FIRE }];

  public resistance = [{ type: CardType.FIGHTING, value: -30 }];

  public retreat = [];

  public attacks =
    [
      {
        name: 'Swords Dance',
        cost: [CardType.GRASS],
        damage: 0,
        text: 'During your next turn, Scyther\'s Slash attack\'s base damage is 60 instead of 30.'
      },
      {
        name: 'Slash',
        cost: [CardType.COLORLESS, CardType.COLORLESS, CardType.COLORLESS],
        damage: 30,
        text: ''
      }
    ];

  public set: string = 'JU';

  public cardImage: string = 'assets/cardback.png';

  public setNumber: string = '10';

  public name: string = 'Scyther';

  public fullName: string = 'Scyther JU';

  public readonly SWORDS_DANCE_MARKER = 'SWORDS_DANCE_MARKER';

  public readonly CLEAR_SWORDS_DANCE_MARKER = 'CLEAR_SWORDS_DANCE_MARKER';


  public reduceEffect(store: StoreLike, state: State, effect: Effect): State {
    // Handle Swords Dance (first attack)
    if (effect instanceof AttackEffect && effect.attack === this.attacks[0]) {
      const player = effect.player;
      const opponent = StateUtils.getOpponent(state, player);

      // Add markers for Swords Dance
      player.active.marker.addMarker(this.SWORDS_DANCE_MARKER, this);
      opponent.marker.addMarker(this.CLEAR_SWORDS_DANCE_MARKER, this);
      return state;
    }

    // Handle Slash (second attack)
    if (effect instanceof AttackEffect && effect.attack === this.attacks[1]) {
      if (effect.player.active.marker.hasMarker(this.SWORDS_DANCE_MARKER, this)) {
        effect.damage += 30;
      }
      return state;
    }

    // Handle end of opponent's turn
    if (effect instanceof EndTurnEffect
      && effect.player.marker.hasMarker(this.CLEAR_SWORDS_DANCE_MARKER, this)) {
      // Remove the clear marker from opponent
      effect.player.marker.removeMarker(this.CLEAR_SWORDS_DANCE_MARKER, this);

      // Remove Swords Dance marker from all of opponent's opponent's (original player's) Pokemon
      const opponent = StateUtils.getOpponent(state, effect.player);
      opponent.forEachPokemon(PlayerType.TOP_PLAYER, (cardList) => {
        cardList.marker.removeMarker(this.SWORDS_DANCE_MARKER, this);
      });
      return state;
    }

    return state;
  }
}
