import { PokemonCard } from '../../game/store/card/pokemon-card';
import { Stage, CardType, CardTag } from '../../game/store/card/card-types';
import { StoreLike } from '../../game/store/store-like';
import { State } from '../../game/store/state/state';
import { Effect } from '../../game/store/effects/effect';
import { PlayerType, PowerType, StateUtils } from '../..';
import { CheckProvidedEnergyEffect } from '../../game/store/effects/check-effects';
import { PutDamageEffect, PutCountersEffect } from '../../game/store/effects/attack-effects';
import { IS_POKEBODY_BLOCKED, WAS_ATTACK_USED } from '../../game/store/prefabs/prefabs';

export class Cloyster extends PokemonCard {
  public stage: Stage = Stage.STAGE_1;
  public evolvesFrom = 'Shelder';
  public cardType: CardType = F;
  public hp: number = 70;
  public weakness = [{ type: L }];
  public retreat = [C];

  public powers = [{
    name: 'Solid Shell',
    powerType: PowerType.POKEBODY,
    text: 'Prevent all effects of attacks, including damage, done by your opponent\'s Pokémon to each of your Benched Pokémon that has delta on its card.'
  }];

  public attacks = [{
    name: 'Grind',
    cost: [F],
    damage: 10,
    damageCalculation: '+',
    text: 'Does 10 damage plus 10 more damage for each Energy attached to Cloyster.'
  }];

  public set: string = 'DF';
  public cardImage: string = 'assets/cardback.png';
  public setNumber: string = '14';
  public name: string = 'Cloyster';
  public fullName: string = 'Cloyster DF';

  public reduceEffect(store: StoreLike, state: State, effect: Effect): State {

    if (WAS_ATTACK_USED(effect, 0, this)) {
      const player = effect.player;
      const checkProvidedEnergy = new CheckProvidedEnergyEffect(player, player.active);
      store.reduceEffect(state, checkProvidedEnergy);

      const damagePerEnergy = 10;
      effect.damage += checkProvidedEnergy.energyMap.length * damagePerEnergy;
    }

    if ((effect instanceof PutDamageEffect) || (effect instanceof PutCountersEffect)) {
      const player = effect.player;
      const opponent = StateUtils.getOpponent(state, player);

      if (effect.target === player.active || effect.target === opponent.active || !effect.target.getPokemonCard()?.tags.includes(CardTag.DELTA_SPECIES)) {
        return state;
      }

      const targetPlayer = StateUtils.findOwner(state, effect.target);

      let isCloysterInPlay = false;
      targetPlayer.forEachPokemon(PlayerType.BOTTOM_PLAYER, (cardList, card) => {
        if (card === this) {
          isCloysterInPlay = true;
        }
      });

      if (!isCloysterInPlay) {
        return state;
      }

      // Try to reduce PowerEffect, to check if something is blocking our ability
      if (IS_POKEBODY_BLOCKED(store, state, player, this)) {
        return state;
      }

      effect.preventDefault = true;
    }
    return state;
  }
}