import { PokemonCard } from '../../game/store/card/pokemon-card';
import { Stage, CardType } from '../../game/store/card/card-types';
import { PlayerType, StoreLike, State, StateUtils } from '../../game';
import { Effect } from '../../game/store/effects/effect';
import { AttachEnergyEffect } from '../../game/store/effects/play-card-effects';
import { EndTurnEffect } from '../../game/store/effects/game-phase-effects';
import { GameError } from '../../game/game-error';
import { GameMessage } from '../../game/game-message';
import { WAS_ATTACK_USED, IS_ABILITY_BLOCKED } from '../../game/store/prefabs/prefabs';

export class Trevenant extends PokemonCard {
  public stage: Stage = Stage.STAGE_1;
  public evolvesFrom: string = 'Phantump';
  public cardType: CardType = P;
  public hp: number = 130;
  public weakness = [{ type: D }];
  public resistance = [{ type: F, value: -30 }];
  public retreat = [C, C, C];

  public attacks = [{
    name: 'Cursed Roots',
    cost: [P],
    damage: 30,
    text: 'During your opponent\'s next turn, Energy can\'t be attached from your opponent\'s hand to the Defending Pokemon.'
  },
  {
    name: 'Overpain',
    cost: [P, P],
    damage: 60,
    damageCalculation: '+' as '+',
    text: 'This attack does 10 more damage for each damage counter on all your opponent\'s Pokemon.'
  }];

  public regulationMark: string = 'J';
  public set: string = 'M4';
  public cardImage: string = 'assets/cardback.png';
  public setNumber: string = '39';
  public name: string = 'Trevenant';
  public fullName: string = 'Trevenant M4';

  public readonly CURSED_ROOTS_MARKER = 'CURSED_ROOTS_MARKER';
  public readonly CLEAR_CURSED_ROOTS_MARKER = 'CLEAR_CURSED_ROOTS_MARKER';

  public reduceEffect(store: StoreLike, state: State, effect: Effect): State {
    if (WAS_ATTACK_USED(effect, 0, this)) {
      const player = effect.player;
      const opponent = StateUtils.getOpponent(state, player);

      opponent.active.marker.addMarker(this.CURSED_ROOTS_MARKER, this);
      opponent.marker.addMarker(this.CLEAR_CURSED_ROOTS_MARKER, this);
    }

    if (WAS_ATTACK_USED(effect, 1, this)) {
      const opponent = StateUtils.getOpponent(state, effect.player);

      let totalDamageCounters = 0;
      opponent.forEachPokemon(PlayerType.TOP_PLAYER, (cardList) => {
        totalDamageCounters += Math.floor(cardList.damage / 10);
      });

      effect.damage += 10 * totalDamageCounters;
    }

    if (effect instanceof AttachEnergyEffect) {
      if (!effect.player.hand.cards.includes(effect.energyCard)) {
        return state;
      }

      const cardList = effect.target;
      if (!cardList.marker.hasMarker(this.CURSED_ROOTS_MARKER, this)) {
        return state;
      }

      const owner = StateUtils.findOwner(state, cardList);
      if (effect.player !== owner) {
        return state;
      }

      const attackerCardList = StateUtils.findCardList(state, this);
      const trevenantOwner = StateUtils.findOwner(state, attackerCardList);
      if (IS_ABILITY_BLOCKED(store, state, trevenantOwner, this)) {
        return state;
      }

      throw new GameError(GameMessage.BLOCKED_BY_EFFECT);
    }

    if (effect instanceof EndTurnEffect && effect.player.marker.hasMarker(this.CLEAR_CURSED_ROOTS_MARKER, this)) {
      effect.player.marker.removeMarker(this.CLEAR_CURSED_ROOTS_MARKER, this);
      const opponent = StateUtils.getOpponent(state, effect.player);
      opponent.forEachPokemon(PlayerType.TOP_PLAYER, (cardList) => {
        cardList.marker.removeMarker(this.CURSED_ROOTS_MARKER, this);
      });
    }

    return state;
  }
}
