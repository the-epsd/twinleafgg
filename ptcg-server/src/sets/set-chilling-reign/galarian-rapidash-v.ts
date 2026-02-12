import { PokemonCard } from '../../game/store/card/pokemon-card';
import { Stage, CardTag } from '../../game/store/card/card-types';
import { State } from '../../game/store/state/state';
import { StoreLike } from '../../game/store/store-like';
import { Effect } from '../../game/store/effects/effect';
import { ChoosePokemonPrompt, GameMessage, PlayerType, SlotType, StateUtils } from '../../game';
import { PutCountersEffect } from '../../game/store/effects/attack-effects';
import { CheckHpEffect, CheckProvidedEnergyEffect } from '../../game/store/effects/check-effects';
import { WAS_ATTACK_USED } from '../../game/store/prefabs/prefabs';

export class GalarianRapidashV extends PokemonCard {
  public regulationMark = 'E';
  public tags = [CardTag.POKEMON_V];
  public stage = Stage.BASIC;
  public cardType = P;
  public hp = 210;
  public weakness = [{ type: D }];
  public resistance = [{ type: F, value: -30 }];
  public retreat = [C];

  public attacks = [{
    name: 'Libra Horn',
    cost: [C, C],
    damage: 0,
    text: 'Put damage counters on 1 of your opponent\'s Pokémon until its remaining HP is 100.'
  },
  {
    name: 'Psychic',
    cost: [P, P],
    damage: 60,
    damageCalculation: '+',
    text: 'This attack does 30 more damage for each Energy attached to your opponent\'s Active Pokémon.'
  }];

  public set: string = 'CRE';
  public cardImage: string = 'assets/cardback.png';
  public setNumber: string = '167';
  public name: string = 'Galarian Rapidash V';
  public fullName: string = 'Galarian Rapidash V CRE';

  public reduceEffect(store: StoreLike, state: State, effect: Effect): State {

    if (WAS_ATTACK_USED(effect, 0, this)) {
      const player = effect.player;

      state = store.prompt(state, new ChoosePokemonPrompt(
        player.id,
        GameMessage.CHOOSE_POKEMON_TO_DAMAGE,
        PlayerType.TOP_PLAYER,
        [SlotType.ACTIVE, SlotType.BENCH],
        { min: 1, max: 1, allowCancel: false }
      ), targets => {
        if (!targets || targets.length === 0) {
          return;
        }
        const selectedTarget = targets[0];
        const checkHpEffect = new CheckHpEffect(effect.player, selectedTarget);
        store.reduceEffect(state, checkHpEffect);

        const totalHp = checkHpEffect.hp;
        let damageAmount = totalHp - 100;

        // Adjust damage if the target already has damage
        const targetDamage = selectedTarget.damage;
        if (targetDamage > 0) {
          damageAmount = Math.max(0, damageAmount - targetDamage);
        }

        if (damageAmount > 0) {
          const damageEffect = new PutCountersEffect(effect, damageAmount);
          damageEffect.target = selectedTarget;
          store.reduceEffect(state, damageEffect);
        } else if (damageAmount <= 0) {
          const damageEffect = new PutCountersEffect(effect, 0);
          damageEffect.target = selectedTarget;
          store.reduceEffect(state, damageEffect);
        }
      });
    }

    if (WAS_ATTACK_USED(effect, 1, this)) {
      const player = effect.player;
      const opponent = StateUtils.getOpponent(state, player);

      const opponentProvidedEnergy = new CheckProvidedEnergyEffect(opponent);
      store.reduceEffect(state, opponentProvidedEnergy);
      const opponentEnergyCount = opponentProvidedEnergy.energyMap
        .reduce((left, p) => left + p.provides.length, 0);

      effect.damage += opponentEnergyCount * 30;
    }


    return state;
  }
}


