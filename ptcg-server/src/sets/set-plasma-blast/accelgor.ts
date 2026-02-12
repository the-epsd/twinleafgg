import { PokemonCard } from '../../game/store/card/pokemon-card';
import { Stage, CardType, CardTag } from '../../game/store/card/card-types';
import { PlayerType, StoreLike, State, StateUtils, EnergyCard } from '../../game';
import { Effect } from '../../game/store/effects/effect';
import { KnockOutEffect } from '../../game/store/effects/game-effects';
import { AfterDamageEffect } from '../../game/store/effects/attack-effects';
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
  public readonly ESCAVALIER_DAMAGED_BY_OPPONENT_ATTACK_MARKER = 'ESCAVALIER_DAMAGED_BY_OPPONENT_ATTACK_MARKER';

  public reduceEffect(store: StoreLike, state: State, effect: Effect): State {
    // Track Escavalier damaged by opponent's attack this turn.
    if (effect instanceof AfterDamageEffect && effect.damage > 0) {
      const damagedCard = effect.target.getPokemonCard();
      if (damagedCard?.name === 'Escavalier') {
        const owner = StateUtils.findOwner(state, effect.target);
        if (owner !== effect.player) {
          effect.target.marker.addMarker(this.ESCAVALIER_DAMAGED_BY_OPPONENT_ATTACK_MARKER, this);
        }
      }
    }

    // Track when your Escavalier is KO'd by damage from opponent's attack.
    if (effect instanceof KnockOutEffect) {
      const knockedOutCard = effect.target.getPokemonCard();
      if (knockedOutCard?.name === 'Escavalier'
        && effect.target.marker.hasMarker(this.ESCAVALIER_DAMAGED_BY_OPPONENT_ATTACK_MARKER, this)) {
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

    // Marker cleanup
    if (effect instanceof EndTurnEffect) {
      effect.player.marker.removeMarker(this.ESCAVALIER_KO_MARKER, this);
      state.players.forEach(player => {
        player.forEachPokemon(PlayerType.BOTTOM_PLAYER, (cardList) => {
          cardList.marker.removeMarker(this.ESCAVALIER_DAMAGED_BY_OPPONENT_ATTACK_MARKER, this);
        });
      });
    }

    return state;
  }
}
