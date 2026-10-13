import { GameMessage, PokemonCard, PowerType, StateUtils, StoreLike } from '../../../game';
import { CardType, SpecialCondition, Stage } from '../../../game/store/card/card-types';
import { CheckProvidedEnergyEffect } from '../../../game/store/effects/check-effects';
import { Effect } from '../../../game/store/effects/effect';
import { AttachEnergyEffect } from '../../../game/store/effects/play-card-effects';
import { APPLY_SPECIAL_CONDITIONS_FROM_ABILITY } from '../../../game/store/prefabs/effect-of-ability-prefabs';
import { CONFIRMATION_PROMPT, IS_POKEPOWER_BLOCKED, WAS_ATTACK_USED } from '../../../game/store/prefabs/prefabs';
import { State } from '../../../game/store/state/state';

export class Roserade extends PokemonCard {
  public stage: Stage = Stage.STAGE_1;
  public evolvesFrom = 'Roselia';
  public cardType: CardType[] = [G];
  public hp: number = 90;
  public weakness = [{ type: R }];
  public retreat = [C];

  public powers = [{
    name: 'Energy Signal',
    powerType: PowerType.POKEPOWER,
    text: 'When you attach a [G] Energy card or [P] Energy card from your hand to Roserade during your turn, you may use this power. If you attach a [G] Energy card, the Defending Pokémon is now Confused. If you attach a [P] Energy card, the Defending Pokémon is now Poisoned. This power can\'t be used if Roserade is affected by a Special Condition.'
  }];

  public attacks = [{
    name: 'Power Blow',
    cost: [G, C],
    damage: 20,
    damageCalculation: 'x',
    text: 'Does 20 damage times the amount of Energy attached to Roserade.'
  }];

  public set: string = 'UL';
  public cardImage: string = 'assets/cardback.png';
  public setNumber: string = '23';
  public name: string = 'Roserade';
  public fullName: string = 'Roserade UL';

  public reduceEffect(store: StoreLike, state: State, effect: Effect): State {
    // Power Blow
    if (WAS_ATTACK_USED(effect, 0, this)) {
      const player = effect.player;
      const cardList = player.active;

      const checkProvidedEnergy = new CheckProvidedEnergyEffect(player, cardList);
      store.reduceEffect(state, checkProvidedEnergy);

      const energyCount = checkProvidedEnergy.energyMap.reduce((sum, em) => sum + em.provides.length, 0);
      effect.damage = 20 * energyCount;
    }

    // Energy Signal
    if (effect instanceof AttachEnergyEffect && effect.target.getPokemonCard() === this) {
      const player = effect.player;

      if (effect.target.specialConditions.length > 0) {
        return state;
      }

      if (IS_POKEPOWER_BLOCKED(store, state, player, this)) {
        return state;
      }

      if (effect.energyCard.name !== 'Grass Energy' && effect.energyCard.name !== 'Psychic Energy') {
        return state;
      }

      CONFIRMATION_PROMPT(store, state, player, result => {
        if (result) {
          const opponent = StateUtils.getOpponent(state, player);
          if (effect.energyCard.name === 'Grass Energy') {
            APPLY_SPECIAL_CONDITIONS_FROM_ABILITY(
              store,
              state,
              player,
              this.powers[0],
              this,
              opponent.active,
              [SpecialCondition.CONFUSED],
            );
          }
          if (effect.energyCard.name === 'Psychic Energy') {
            APPLY_SPECIAL_CONDITIONS_FROM_ABILITY(
              store,
              state,
              player,
              this.powers[0],
              this,
              opponent.active,
              [SpecialCondition.POISONED],
            );
          }
        }
      }, GameMessage.WANT_TO_USE_ABILITY);
    }

    return state;
  }
}
