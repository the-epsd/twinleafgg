import { PokemonCard } from '../../../game/store/card/pokemon-card';
import { Stage, CardType } from '../../../game/store/card/card-types';
import { StoreLike } from '../../../game/store/store-like';
import { State } from '../../../game/store/state/state';
import { Effect } from '../../../game/store/effects/effect';
import { AfterAttackEffect, EndTurnEffect } from '../../../game/store/effects/game-phase-effects';
import { IS_POKEBODY_BLOCKED, SWITCH_ACTIVE_WITH_BENCHED, WAS_ATTACK_USED } from '../../../game/store/prefabs/prefabs';
import { PowerType, StateUtils } from '../../../game';
import { PutDamageEffect } from '../../../game/store/effects/attack-effects';
import { CheckProvidedEnergyEffect } from '../../../game/store/effects/check-effects';

export class Skiploom extends PokemonCard {
  public stage: Stage = Stage.STAGE_1;
  public evolvesFrom: string = 'Hoppip';
  public cardType: CardType[] = [G];
  public hp: number = 60;
  public weakness = [{ type: R, value: +20 }];
  public resistance = [{ type: F, value: -20 }];
  public retreat = [];

  public powers = [{
    name: 'Cotton Balloon',
    powerType: PowerType.POKEBODY,
    text: 'If Skiploom has any [G] Energy attached to it, any damage done to Skiploom by attacks from your opponent\'s Evolved Pokémon is reduced by 20 (after applying Weakness and Resistance).'
  }];

  public attacks = [{
    name: 'U-turn',
    cost: [G],
    damage: 20,
    text: 'Switch Skiploom with 1 of your Benched Pokémon.'
  }];

  public set: string = 'SW';
  public cardImage: string = 'assets/cardback.png';
  public setNumber: string = '65';
  public name: string = 'Skiploom';
  public fullName: string = 'Skiploom SW';

  private usedUTurn = false;

  public reduceEffect(store: StoreLike, state: State, effect: Effect): State {

    // Cotton Balloon
    if (effect instanceof PutDamageEffect && effect.target.getPokemonCard() === this) {
      const owner = StateUtils.findOwner(state, effect.target);

      if (owner === effect.player) {
        return state;
      }
      if (!StateUtils.isPokemonInPlay(owner, this)) {
        return state;
      }
      if (IS_POKEBODY_BLOCKED(store, state, owner, this)) {
        return state;
      }

      const checkProvidedEnergy = new CheckProvidedEnergyEffect(owner, effect.target);
      state = store.reduceEffect(state, checkProvidedEnergy);

      const hasGrassEnergy = checkProvidedEnergy.energyMap.some(energy =>
        energy.provides.includes(CardType.GRASS) || energy.provides.includes(CardType.ANY)
      );

      if (hasGrassEnergy && effect.source.getPokemons().length > 1) {
        effect.damage = Math.max(0, effect.damage - 20);
      }
    }

    // U-turn
    if (WAS_ATTACK_USED(effect, 0, this)) {
      this.usedUTurn = true;
    }

    if (effect instanceof AfterAttackEffect && this.usedUTurn) {
      const player = effect.player;
      SWITCH_ACTIVE_WITH_BENCHED(store, state, player);
      this.usedUTurn = false;
    }

    if (effect instanceof EndTurnEffect) {
      this.usedUTurn = false;
    }

    return state;
  }

}
