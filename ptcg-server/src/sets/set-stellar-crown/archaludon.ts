import { PlayerType, PowerType, State, StateUtils, StoreLike } from '../../game';
import { CardType, Stage } from '../../game/store/card/card-types';
import { PokemonCard } from '../../game/store/card/pokemon-card';
import { CheckProvidedEnergyEffect, CheckRetreatCostEffect } from '../../game/store/effects/check-effects';
import { Effect } from '../../game/store/effects/effect';
import { IS_ABILITY_BLOCKED, WAS_ATTACK_USED } from '../../game/store/prefabs/prefabs';

export class Archaludon extends PokemonCard {
  public stage: Stage = Stage.STAGE_1;
  public evolvesFrom = 'Duraludon';
  public cardType: CardType = M;
  public hp: number = 180;
  public weakness = [{ type: R }];
  public resistance = [{ type: G, value: -30 }];
  public retreat = [C, C];

  public powers = [{
    name: 'Metal Bridge',
    powerType: PowerType.ABILITY,
    text: 'All of your Pokémon that have [M] Energy attached have no Retreat Cost.'
  }];

  public attacks = [{
    name: 'Iron Blaster',
    cost: [M, M, C],
    damage: 160,
    text: 'During your next turn, this Pokémon can\'t attack.'
  }];

  public regulationMark = 'H';
  public set = 'SCR';
  public setNumber = '107';
  public cardImage = 'assets/cardback.png';
  public name = 'Archaludon';
  public fullName = 'Archaludon SCR';

  public reduceEffect(store: StoreLike, state: State, effect: Effect): State {
    if (effect instanceof CheckRetreatCostEffect) {
      const player = effect.player;
      const cardList = StateUtils.findCardList(state, this);
      const owner = StateUtils.findOwner(state, cardList);

      if (owner !== player) {
        return state;
      }

      if (IS_ABILITY_BLOCKED(store, state, player, this)) {
        return state;
      }

      let inPlay = false;
      player.forEachPokemon(PlayerType.BOTTOM_PLAYER, (cardList, card) => {
        if (card === this) {
          inPlay = true;
        }
      });

      const checkProvidedEnergyEffect = new CheckProvidedEnergyEffect(player, player.active);
      store.reduceEffect(state, checkProvidedEnergyEffect);

      const activeHasMetalEnergy = checkProvidedEnergyEffect.energyMap.some(p => p.provides.includes(M));

      if (inPlay && activeHasMetalEnergy) {
        effect.cost = [];
      }
    }

    // Iron Blaster
    if (WAS_ATTACK_USED(effect, 0, this)) {
      const player = effect.player;
      player.active.cannotAttackNextTurnPending = true;
    }

    return state;
  }
}
