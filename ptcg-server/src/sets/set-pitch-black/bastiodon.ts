import { PokemonCard } from '../../game/store/card/pokemon-card';
import { Stage, CardType } from '../../game/store/card/card-types';
import { GamePhase, PowerType, StoreLike, State, StateUtils } from '../../game';
import { Player } from '../../game/store/state/player';
import { Effect } from '../../game/store/effects/effect';
import { DealDamageEffect, PutDamageEffect } from '../../game/store/effects/attack-effects';
import { CheckProvidedEnergyEffect } from '../../game/store/effects/check-effects';
import { IS_ABILITY_BLOCKED } from '../../game/store/prefabs/prefabs';
import { PlayerType } from '../../game/store/actions/play-card-action';

export class Bastiodon extends PokemonCard {
  public stage: Stage = Stage.STAGE_2;
  public evolvesFrom = 'Shieldon';
  public cardType: CardType = M;
  public hp: number = 160;
  public weakness = [{ type: R }];
  public resistance = [{ type: G, value: -30 }];
  public retreat = [C, C, C, C];

  public powers = [{
    name: 'Ancient Bulwark',
    powerType: PowerType.ABILITY,
    text: 'While this Pokémon is on your Bench, prevent all damage done to your Pokémon by attacks from your opponent\'s Pokémon that have 2 or fewer Energy attached.',
  }];

  public attacks = [{
    name: 'Hammer In',
    cost: [M, M, C],
    damage: 160,
    text: '',
  }];

  public set: string = 'M5';
  public setNumber: string = '60';
  public regulationMark: string = 'J';
  public cardImage: string = 'assets/cardback.png';
  public name: string = 'Bastiodon';
  public fullName: string = 'Bastiodon M5';

  private bastiodonProtects(
    store: StoreLike,
    state: State,
    defenderOwner: Player,
    source: Player['active']
  ): boolean {
    let hasBastiodon = false;
    const defenderPlayerType = state.players[0] === defenderOwner ? PlayerType.BOTTOM_PLAYER : PlayerType.TOP_PLAYER;
    defenderOwner.forEachPokemon(defenderPlayerType, (cardList, card) => {
      if (card instanceof Bastiodon && cardList !== defenderOwner.active) {
        if (!IS_ABILITY_BLOCKED(store, state, defenderOwner, card)) {
          hasBastiodon = true;
        }
      }
    });
    if (!hasBastiodon) {
      return false;
    }
    const attackerOwner = StateUtils.findOwner(state, source);
    const checkEnergy = new CheckProvidedEnergyEffect(attackerOwner, source);
    store.reduceEffect(state, checkEnergy);
    const energyCount = checkEnergy.energyMap.reduce((sum, em) => sum + em.provides.length, 0);
    return energyCount <= 2;
  }

  public reduceEffect(store: StoreLike, state: State, effect: Effect): State {
    if (effect instanceof DealDamageEffect && state.phase === GamePhase.ATTACK) {
      const defenderOwner = StateUtils.findOwner(state, effect.target);
      const attackerOwner = StateUtils.findOwner(state, effect.source);
      if (defenderOwner !== attackerOwner
        && attackerOwner === StateUtils.getOpponent(state, defenderOwner)
        && this.bastiodonProtects(store, state, defenderOwner, effect.source)) {
        effect.damage = 0;
      }
    }
    if (effect instanceof PutDamageEffect && state.phase === GamePhase.ATTACK) {
      const defenderOwner = StateUtils.findOwner(state, effect.target);
      const attackerOwner = StateUtils.findOwner(state, effect.source);
      if (defenderOwner !== attackerOwner
        && attackerOwner === StateUtils.getOpponent(state, defenderOwner)
        && this.bastiodonProtects(store, state, defenderOwner, effect.source)) {
        effect.preventDefault = true;
      }
    }
    return state;
  }
}
