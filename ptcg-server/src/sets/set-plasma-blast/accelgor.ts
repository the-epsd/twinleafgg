import { PokemonCard } from '../../game/store/card/pokemon-card';
import { Stage, CardType, CardTag } from '../../game/store/card/card-types';
import { StoreLike, State, StateUtils, EnergyCard } from '../../game';
import { Effect } from '../../game/store/effects/effect';
import { KnockOutEffect } from '../../game/store/effects/game-effects';
import { EndTurnEffect } from '../../game/store/effects/game-phase-effects';
import { WAS_ATTACK_USED } from '../../game/store/prefabs/prefabs';
import { YOUR_OPPPONENTS_ACTIVE_POKEMON_IS_NOW_CONFUSED } from '../../game/store/prefabs/attack-effects';

export class Accelgor extends PokemonCard {
  public tags = [CardTag.TEAM_PLASMA];
  public stage: Stage = Stage.STAGE_1;
  public evolvesFrom: string = 'Shelmet';
  public cardType: CardType = G;
  public hp: number = 80;
  public weakness = [{ type: R }];
  public retreat = [];

  public attacks = [
    {
      name: 'Retribution',
      cost: [C],
      damage: 20,
      text: 'If an Escavalier you had in play was Knocked Out by damage from an opponent\'s attack during his or her last turn, put all Energy attached to the Defending Pok\u00e9mon into your opponent\'s hand.'
    },
    {
      name: 'Signal Beam',
      cost: [G, C],
      damage: 30,
      text: 'The Defending Pok\u00e9mon is now Confused.'
    }
  ];

  public set: string = 'PLB';
  public setNumber: string = '8';
  public cardImage: string = 'assets/cardback.png';
  public name: string = 'Accelgor';
  public fullName: string = 'Accelgor PLB';

  public readonly ESCAVALIER_KO_MARKER = 'ESCAVALIER_KO_MARKER';
  public readonly CLEAR_ESCAVALIER_KO_MARKER = 'CLEAR_ESCAVALIER_KO_MARKER';

  public reduceEffect(store: StoreLike, state: State, effect: Effect): State {
    // Track when an Escavalier owned by same player is knocked out
    if (effect instanceof KnockOutEffect) {
      const knockedOutCard = effect.target.getPokemonCard();
      if (knockedOutCard && knockedOutCard.name === 'Escavalier') {
        const owner = StateUtils.findOwner(state, effect.target);
        owner.marker.addMarker(this.ESCAVALIER_KO_MARKER, this);
      }
    }

    if (WAS_ATTACK_USED(effect, 0, this)) {
      const player = effect.player;
      const opponent = StateUtils.getOpponent(state, player);

      if (player.marker.hasMarker(this.ESCAVALIER_KO_MARKER, this)) {
        // Put all energy from defending Pokemon into opponent's hand
        const energyCards = opponent.active.cards.filter(c => c instanceof EnergyCard);
        energyCards.forEach(card => {
          opponent.active.moveCardTo(card, opponent.hand);
        });
      }
    }

    if (WAS_ATTACK_USED(effect, 1, this)) {
      YOUR_OPPPONENTS_ACTIVE_POKEMON_IS_NOW_CONFUSED(store, state, effect);
    }

    // Two-marker pattern: KO marker persists through our next turn
    if (effect instanceof EndTurnEffect) {
      if (effect.player.marker.hasMarker(this.CLEAR_ESCAVALIER_KO_MARKER, this)) {
        effect.player.marker.removeMarker(this.CLEAR_ESCAVALIER_KO_MARKER, this);
        effect.player.marker.removeMarker(this.ESCAVALIER_KO_MARKER, this);
      } else if (effect.player.marker.hasMarker(this.ESCAVALIER_KO_MARKER, this)) {
        effect.player.marker.addMarker(this.CLEAR_ESCAVALIER_KO_MARKER, this);
      }
    }

    return state;
  }
}
