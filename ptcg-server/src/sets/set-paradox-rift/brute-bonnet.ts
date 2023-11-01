import { PokemonCard } from '../../game/store/card/pokemon-card';
import { Stage, CardType, SpecialCondition } from '../../game/store/card/card-types';
import { StoreLike, State, GameError, StateUtils, PowerType, PlayerType } from '../../game';
import { AttackEffect, PowerEffect } from '../../game/store/effects/game-effects';
import { Effect } from '../../game/store/effects/effect';
import { GameMessage } from '../../game/game-message';
import { EndTurnEffect } from '../../game/store/effects/game-phase-effects';

export class BruteBonnet extends PokemonCard {

  public stage: Stage = Stage.BASIC;

  public cardType: CardType = CardType.DARK;

  public hp: number = 120;

  public weakness = [{ type: CardType.GRASS }];

  public retreat = [ CardType.COLORLESS, CardType.COLORLESS, CardType.COLORLESS ];

  public attacks = [
    {
      name: 'Rampaging Hammer',
      cost: [ CardType.DARK, CardType.DARK, CardType.COLORLESS ],
      damage: 120,
      text: 'During your next turn, this Pokémon can\'t attack.'
    }
  ];

  public set: string = 'PAR';

  public set2: string = 'ancientroar';

  public setNumber: string = '53';

  public name: string = 'Brute Bonnet';

  public fullName: string = 'Brute Bonnet PAR';

  public readonly ATTACK_USED_MARKER = 'ATTACK_USED_MARKER';
  public readonly ATTACK_USED_2_MARKER = 'ATTACK_USED_2_MARKER';

  public reduceEffect(store: StoreLike, state: State, effect: Effect): State {

    if (effect instanceof EndTurnEffect && effect.player.marker.hasMarker(this.ATTACK_USED_2_MARKER, this)) {
      effect.player.marker.removeMarker(this.ATTACK_USED_MARKER, this);
      effect.player.marker.removeMarker(this.ATTACK_USED_2_MARKER, this);
      console.log('marker cleared');
    }

    if (effect instanceof EndTurnEffect && effect.player.marker.hasMarker(this.ATTACK_USED_MARKER, this)) {
      effect.player.marker.addMarker(this.ATTACK_USED_2_MARKER, this);
      console.log('second marker added');
    }

    if (effect instanceof AttackEffect && effect.attack === this.attacks[0]) {

      // Check marker
      if (effect.player.marker.hasMarker(this.ATTACK_USED_MARKER, this)) {
        console.log('attack blocked');
        throw new GameError(GameMessage.BLOCKED_BY_EFFECT);
      }
      effect.player.marker.addMarker(this.ATTACK_USED_MARKER, this);
      console.log('marker added');
    }

    const cardList = StateUtils.findCardList(state, this);

    if (!cardList) {
      return state;
    }

    if (effect instanceof PowerEffect
        && effect.power.powerType === PowerType.ABILITY
        && effect.power.name !== 'Garbotoxin') {
      const player = effect.player;
      const opponent = StateUtils.getOpponent(state, player);
  
      let bruteBonnetWithTool = false;
      player.forEachPokemon(PlayerType.BOTTOM_PLAYER, (cardList, card) => {
        if (card === this && cardList.tool !== undefined) {
          bruteBonnetWithTool = true;
        }
      });
      opponent.forEachPokemon(PlayerType.TOP_PLAYER, (cardList, card) => {
        if (card === this && cardList.tool !== undefined) {
          bruteBonnetWithTool = true;
        }
      });

      if (!bruteBonnetWithTool) {
        return state;
      }

      // Try to reduce PowerEffect, to check if something is blocking our ability
      try {
        const powerEffect = new PowerEffect(player, this.powers[0], this);
        store.reduceEffect(state, powerEffect);
      } catch {
        return state;
      }

      throw new GameError(GameMessage.BLOCKED_BY_ABILITY);
    }

    if (effect instanceof PowerEffect && effect.power === this.powers[0]) {

      const player = effect.player;
      const opponent = StateUtils.getOpponent(state, player);

      player.active.specialConditions.push(SpecialCondition.POISONED);
      opponent.active.specialConditions.push(SpecialCondition.POISONED);
    }
    return state;
  }
}