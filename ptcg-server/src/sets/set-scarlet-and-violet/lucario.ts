import { GameError, GameMessage, GamePhase, State, StateUtils, StoreLike } from '../../game';
import { CardType, Stage } from '../../game/store/card/card-types';
import { PokemonCard } from '../../game/store/card/pokemon-card';
import { Effect } from '../../game/store/effects/effect';
import { AttackEffect, KnockOutEffect } from '../../game/store/effects/game-effects';
import { EndTurnEffect } from '../../game/store/effects/game-phase-effects';

export class Lucario extends PokemonCard {

  public stage: Stage = Stage.STAGE_1;

  public cardType: CardType = CardType.FIGHTING;

  public hp: number = 130;

  public weakness = [{ type: CardType.PSYCHIC }];

  public retreat = [CardType.COLORLESS, CardType.COLORLESS];

  public attacks = [
    {
      name: 'Avenging Knuckle',
      cost: [CardType.FIGHTING],
      damage: 30,
      damageCalculation: '+',
      text: 'If any of your [F] Pokémon were Knocked Out by damage from an attack during your opponent\'s last turn, this attack does 120 more damage.'
    },
    {
      name: 'Accelerating Stab',
      cost: [CardType.FIGHTING, CardType.COLORLESS, CardType.COLORLESS],
      damage: 120,
      text: 'During your next turn, this Pokémon can\'t use Accelerating Stab.'
    }
  ];

  public set: string = 'SVI';

  public regulationMark = 'G';

  public cardImage: string = 'assets/cardback.png';

  public setNumber: string = '114';

  public evolvesFrom = 'Riolu';

  public name: string = 'Lucario';

  public fullName: string = 'Lucario SVI';

  public readonly RETALIATE_MARKER = 'RETALIATE_MARKER';
  public readonly ATTACK_USED_MARKER = 'ATTACK_USED_MARKER';
  public readonly ATTACK_USED_2_MARKER = 'ATTACK_USED_2_MARKER';

  // public damageDealt = false;

  public reduceEffect(store: StoreLike, state: State, effect: Effect): State {

    if (effect instanceof EndTurnEffect) {
      effect.player.marker.removeMarker(this.RETALIATE_MARKER);
    }

    if (effect instanceof EndTurnEffect && effect.player.attackMarker.hasMarker(this.ATTACK_USED_2_MARKER, this)) {
      effect.player.attackMarker.removeMarker(this.ATTACK_USED_MARKER, this);
      effect.player.attackMarker.removeMarker(this.ATTACK_USED_2_MARKER, this);
      console.log('marker cleared');
    }

    if (effect instanceof EndTurnEffect && effect.player.attackMarker.hasMarker(this.ATTACK_USED_MARKER, this)) {
      effect.player.attackMarker.addMarker(this.ATTACK_USED_2_MARKER, this);
      console.log('second marker added');
    }
    if (effect instanceof AttackEffect && effect.attack === this.attacks[1]) {

      // Check marker
      if (effect.player.attackMarker.hasMarker(this.ATTACK_USED_MARKER, this)) {
        console.log('attack blocked');
        throw new GameError(GameMessage.BLOCKED_BY_EFFECT);
      }
      effect.player.attackMarker.addMarker(this.ATTACK_USED_MARKER, this);
      console.log('marker added');
    }

    // if (effect instanceof DealDamageEffect || effect instanceof PutDamageEffect) {
    //   const player = StateUtils.getOpponent(state, effect.player);
    //   const cardList = StateUtils.findCardList(state, this);
    //   const owner = StateUtils.findOwner(state, cardList);

    //   if (player !== owner) {
    //     this.damageDealt = true;
    //   } else {
    //     effect.player.marker.removeMarker(this.ATTACK_USED_MARKER, this);
    //   }
    // }

    // if (effect instanceof EndTurnEffect && effect.player === StateUtils.getOpponent(state, effect.player)) {
    //   const cardList = StateUtils.findCardList(state, this);
    //   const owner = StateUtils.findOwner(state, cardList);

    //   if (owner === effect.player) {
    //     this.damageDealt = false;
    //   }
    // }

    if (effect instanceof AttackEffect && effect.attack === this.attacks[0]) {
      const player = effect.player;

      if (player.marker.hasMarker(this.RETALIATE_MARKER)) {
        effect.damage += 120;
      }
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

    return state;
  }

}
