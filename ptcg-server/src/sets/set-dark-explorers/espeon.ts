import { PokemonCard } from '../../game/store/card/pokemon-card';
import { Stage, CardType } from '../../game/store/card/card-types';
import { StoreLike, State, StateUtils, PowerType, PlayerType, GameMessage, ShowCardsPrompt } from '../../game';
import { Effect } from '../../game/store/effects/effect';
import { WAS_ATTACK_USED, IS_ABILITY_BLOCKED } from '../../game/store/prefabs/prefabs';
import { CheckProvidedEnergyEffect } from '../../game/store/effects/check-effects';
import { AbstractAttackEffect, ApplyWeaknessEffect, DealDamageEffect, PutDamageEffect } from '../../game/store/effects/attack-effects';

export class Espeon extends PokemonCard {

  public stage: Stage = Stage.STAGE_1;
  public evolvesFrom = 'Eevee';
  public cardType: CardType = P;
  public hp: number = 90;
  public weakness = [{ type: P }];
  public retreat = [C];

  public powers = [{
    name: 'Solar Revelation',
    powerType: PowerType.ABILITY,
    text: 'Prevent all effects of your opponent\'s attacks, except damage, done to each of your Pokemon that has any Energy attached to it.'
  }];

  public attacks = [{
    name: 'Psy Report',
    cost: [P, C, C],
    damage: 60,
    text: 'Your opponent reveals his or her hand.'
  }];

  public set: string = 'DEX';
  public setNumber: string = '48';
  public cardImage: string = 'assets/cardback.png';
  public name: string = 'Espeon';
  public fullName: string = 'Espeon DEX';

  public reduceEffect(store: StoreLike, state: State, effect: Effect): State {
    // Solar Revelation - prevent effects (except damage) on Pokemon with energy
    if (effect instanceof AbstractAttackEffect) {
      const targetPlayer = StateUtils.findOwner(state, effect.target);
      const sourcePlayer = effect.player;

      // Ability only works on opponent's attacks
      if (targetPlayer === sourcePlayer) {
        return state;
      }

      if (IS_ABILITY_BLOCKED(store, state, targetPlayer, this)) {
        return state;
      }

      // Check if Espeon is in play
      let hasEspeonInPlay = false;
      targetPlayer.forEachPokemon(PlayerType.BOTTOM_PLAYER, (cardList, card) => {
        if (card === this) {
          hasEspeonInPlay = true;
        }
      });

      if (!hasEspeonInPlay) {
        return state;
      }

      // Check if the target Pokemon has any energy attached
      const checkProvidedEnergyEffect = new CheckProvidedEnergyEffect(targetPlayer, effect.target);
      store.reduceEffect(state, checkProvidedEnergyEffect);

      const hasEnergy = checkProvidedEnergyEffect.energyMap.length > 0;

      if (hasEnergy) {
        // Allow Weakness & Resistance effects
        if (effect instanceof ApplyWeaknessEffect) {
          return state;
        }
        // Allow damage effects
        if (effect instanceof PutDamageEffect) {
          return state;
        }
        if (effect instanceof DealDamageEffect) {
          return state;
        }

        // Block all other attack effects
        effect.preventDefault = true;
      }
    }

    // Psy Report - opponent reveals hand
    if (WAS_ATTACK_USED(effect, 0, this)) {
      const player = effect.player;
      const opponent = StateUtils.getOpponent(state, player);

      return store.prompt(state, new ShowCardsPrompt(
        player.id,
        GameMessage.CARDS_SHOWED_BY_EFFECT,
        opponent.hand.cards,
      ), () => { });
    }

    return state;
  }
}
