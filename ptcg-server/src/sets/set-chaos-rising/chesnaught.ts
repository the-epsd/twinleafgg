import { CardType, Stage } from '../../game/store/card/card-types';
import { PowerType } from '../../game/store/card/pokemon-types';
import { Effect } from '../../game/store/effects/effect';
import { PokemonCard, StoreLike, State, StateUtils } from '../../game';
import { AfterDamageEffect } from '../../game/store/effects/attack-effects';
import { CheckProvidedEnergyEffect } from '../../game/store/effects/check-effects';
import { PutCountersEffect } from '../../game/store/effects/attack-effects';
import { WAS_ATTACK_USED } from '../../game/store/prefabs/prefabs';
import { BLOCK_RETREAT, BLOCK_RETREAT_IF_MARKER, REMOVE_MARKER_FROM_ACTIVE_AT_END_OF_TURN } from '../../game/store/prefabs/prefabs';
import { MarkerConstants } from '../../game/store/markers/marker-constants';
import { GamePhase } from '../../game/store/state/state';

export class Chesnaught extends PokemonCard {
  public stage: Stage = Stage.STAGE_2;
  public evolvesFrom = 'Quilladin';
  public hp: number = 180;
  public cardType: CardType = G;
  public weakness = [{ type: R }];
  public retreat = [C, C, C, C];

  public powers = [{
    name: 'Needle Armor',
    powerType: PowerType.ABILITY,
    text: 'As long as this Pokemon is in play, whenever this Pokemon is damaged by an attack from your opponent\'s Active Pokemon, put 3 damage counters on the Attacking Pokemon for each [G] Energy attached to this Pokemon.'
  }];

  public attacks = [{
    name: 'Impound',
    cost: [G, G, C],
    damage: 160,
    text: 'During your opponent\'s next turn, the Defending Pokemon can\'t retreat.'
  }];

  public regulationMark = 'J';
  public set: string = 'M4';
  public cardImage: string = 'assets/cardback.png';
  public setNumber: string = '7';
  public name: string = 'Chesnaught';
  public fullName: string = 'Chesnaught M4';

  public reduceEffect(store: StoreLike, state: State, effect: Effect): State {
    if (effect instanceof AfterDamageEffect && effect.target.cards.includes(this)) {
      const targetOwner = StateUtils.findOwner(state, effect.target);
      if (effect.damage > 0 && targetOwner !== effect.player && state.phase === GamePhase.ATTACK && effect.attackEffect) {
        const attackingPokemon = effect.source;
        const checkEnergy = new CheckProvidedEnergyEffect(targetOwner, effect.target);
        store.reduceEffect(state, checkEnergy);
        let gCount = 0;
        checkEnergy.energyMap.forEach(em => {
          em.provides.forEach(p => {
            if (p === G || p === CardType.ANY) gCount++;
          });
        });
        if (gCount > 0 && attackingPokemon) {
          const putCounters = new PutCountersEffect(effect.attackEffect, 30 * gCount);
          putCounters.target = attackingPokemon;
          store.reduceEffect(state, putCounters);
        }
      }
    }
    if (WAS_ATTACK_USED(effect, 0, this)) {
      return BLOCK_RETREAT(store, state, effect, this);
    }
    BLOCK_RETREAT_IF_MARKER(effect, MarkerConstants.DEFENDING_POKEMON_CANNOT_RETREAT_MARKER, this);
    REMOVE_MARKER_FROM_ACTIVE_AT_END_OF_TURN(effect, MarkerConstants.DEFENDING_POKEMON_CANNOT_RETREAT_MARKER, this);
    return state;
  }
}
