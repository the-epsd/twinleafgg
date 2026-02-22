import { PokemonCard } from '../../game/store/card/pokemon-card';
import { Stage, CardType, CardTag } from '../../game/store/card/card-types';
import { StoreLike } from '../../game/store/store-like';
import { State } from '../../game/store/state/state';
import { Effect } from '../../game/store/effects/effect';

import { PowerType } from '../../game/store/card/pokemon-types';
import { StateUtils } from '../../game/store/state-utils';
import { GameError } from '../../game/game-error';
import { GameMessage } from '../../game/game-message';
import { AttachPokemonToolEffect, PlayItemEffect } from '../../game/store/effects/play-card-effects';
import { CheckAttackCostEffect, CheckProvidedEnergyEffect } from '../../game/store/effects/check-effects';
import { IS_ABILITY_BLOCKED, WAS_ATTACK_USED } from '../../game/store/prefabs/prefabs';

export class Jellicentex extends PokemonCard {
  public stage: Stage = Stage.STAGE_1;
  public tags = [CardTag.POKEMON_ex];
  public evolvesFrom = 'Frillish';
  public cardType: CardType = P;
  public hp: number = 270;
  public weakness = [{ type: D }];
  public retreat = [C, C, C];

  public powers = [{
    name: 'Oceanic Curse',
    powerType: PowerType.ABILITY,
    text: 'As long as this Pokémon is in the Active Spot, your opponent can\'t play any Item cards  or attach any Pokémon Tool cards from their hand.'
  }];

  public attacks = [{
    name: 'Power Press',
    cost: [P, C],
    damage: 80,
    damageCalculation: '+',
    text: 'If this Pokémon has at least 2 extra Energy attached (in addition to this attack\'s cost), this attack does 80 more damage.'
  }];

  public regulationMark = 'I';
  public set: string = 'WHT';
  public cardImage: string = 'assets/cardback.png';
  public setNumber: string = '45';
  public name: string = 'Jellicent ex';
  public fullName: string = 'Jellicent ex SV11W';

  public reduceEffect(store: StoreLike, state: State, effect: Effect): State {

    if (WAS_ATTACK_USED(effect, 0, this)) {
      const player = effect.player;
      // Check attack cost
      const checkCost = new CheckAttackCostEffect(player, this.attacks[0]);
      state = store.reduceEffect(state, checkCost);

      // Check attached energy
      const checkEnergy = new CheckProvidedEnergyEffect(player);
      state = store.reduceEffect(state, checkEnergy);

      // Count total attached energy
      const totalEnergy = checkEnergy.energyMap.reduce((sum, energy) => sum + energy.provides.length, 0);
      const attackCost = checkCost.cost.length;
      const extraEnergy = totalEnergy - attackCost;
      if (extraEnergy >= 2) {
        effect.damage += 80;
      }
    }

    if (effect instanceof PlayItemEffect || effect instanceof AttachPokemonToolEffect) {
      const player = effect.player;
      const opponent = StateUtils.getOpponent(state, player);

      if (opponent.active.getPokemonCard() === this) {
        if (!IS_ABILITY_BLOCKED(store, state, opponent, this)) {
          throw new GameError(GameMessage.BLOCKED_BY_ABILITY);
        }
      }
    }
    return state;
  }
}