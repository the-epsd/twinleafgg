import { PokemonCard } from '../../game/store/card/pokemon-card';
import { CardType, SpecialCondition, Stage } from '../../game/store/card/card-types';
import { PowerType, State, StateUtils, StoreLike } from '../../game';
import { Effect } from '../../game/store/effects/effect';
import { PutDamageEffect } from '../../game/store/effects/attack-effects';
import { GamePhase } from '../../game/store/state/state';
import { IS_POKEMON_POWER_BLOCKED } from '../../game/store/prefabs/prefabs';

export class Kabuto extends PokemonCard {
  public stage: Stage = Stage.STAGE_1;
  public evolvesFrom: string = 'Mysterious Fossil';
  public hp: number = 30;
  public cardType: CardType[] = [F];
  public weakness = [{ type: G }];
  public retreat = [C];

  public powers = [{
    name: 'Kabuto Armor',
    powerType: PowerType.POKEMON_POWER,
    text: 'Whenever an attack (even your own) does damage to Kabuto (after applying Weakness and Resistance), that attack does half the damage to Kabuto (rounded down to the nearest 10). (Any other effects of attacks still happen.) This power stops working while Kabuto is Asleep, Confused, or Paralyzed.',
  }];

  public attacks = [{
    name: 'Scratch',
    cost: [C],
    damage: 10,
    text: ''
  }];

  public set: string = 'FO';
  public cardImage: string = 'assets/cardback.png';
  public setNumber: string = '50';
  public name: string = 'Kabuto';
  public fullName: string = 'Kabuto FO';

  public reduceEffect(store: StoreLike, state: State, effect: Effect): State {
    // Kabuto Armor
    if (effect instanceof PutDamageEffect && effect.target.cards.includes(this)) {
      const pokemonCard = effect.target.getPokemonCard();

      if (pokemonCard !== this || state.phase !== GamePhase.ATTACK) {
        return state;
      }

      if (effect.damage <= 0) {
        return state;
      }

      if (effect.target.specialConditions.includes(SpecialCondition.ASLEEP)
        || effect.target.specialConditions.includes(SpecialCondition.CONFUSED)
        || effect.target.specialConditions.includes(SpecialCondition.PARALYZED)) {
        return state;
      }

      const player = StateUtils.findOwner(state, effect.target);
      if (IS_POKEMON_POWER_BLOCKED(store, state, player, this)) {
        return state;
      }

      // Half damage, rounded down to the nearest 10
      effect.damage = Math.floor(effect.damage / 2 / 10) * 10;
    }

    return state;
  }
}
