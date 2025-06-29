import { PokemonCard } from '../../game/store/card/pokemon-card';
import { Stage, CardType } from '../../game/store/card/card-types';
import { StoreLike } from '../../game/store/store-like';
import { State } from '../../game/store/state/state';
import { Effect } from '../../game/store/effects/effect';
import { AfterAttackEffect } from '../../game/store/effects/game-phase-effects';
import { IS_POKEBODY_BLOCKED, SWITCH_ACTIVE_WITH_BENCHED, WAS_ATTACK_USED } from '../../game/store/prefabs/prefabs';
import { PowerType } from '../../game';
import { PutDamageEffect } from '../../game/store/effects/attack-effects';
import { CheckProvidedEnergyEffect } from '../../game/store/effects/check-effects';

export class Skiploom extends PokemonCard {
  public stage: Stage = Stage.STAGE_1;
  public evolvesFrom: string = 'Hoppip';
  public cardType: CardType = G;
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

  private usedSmashTurn = false;

  public reduceEffect(store: StoreLike, state: State, effect: Effect): State {

    if (effect instanceof PutDamageEffect && effect.target.getPokemonCard() === this) {
      const player = effect.player;

      if (IS_POKEBODY_BLOCKED(store, state, player, this)) {
        return state;
      }

      const checkProvidedEnergy = new CheckProvidedEnergyEffect(player);
      state = store.reduceEffect(state, checkProvidedEnergy);

      // Check if there is any Water energy attached
      const hasGrassEnergy = checkProvidedEnergy.energyMap.some(energy =>
        energy.provides.includes(CardType.GRASS) || energy.provides.includes(CardType.ANY)
      );

      if (hasGrassEnergy && effect.source.getPokemons().length > 1) {
        effect.damage -= 20;
      }
    }

    if (WAS_ATTACK_USED(effect, 0, this)) {
      this.usedSmashTurn = true;
    }

    if (effect instanceof AfterAttackEffect && this.usedSmashTurn) {
      const player = effect.player;
      SWITCH_ACTIVE_WITH_BENCHED(store, state, player);
      this.usedSmashTurn = false;
    }

    return state;
  }

}