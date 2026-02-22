import { PowerType, State, StateUtils, StoreLike } from '../../game';
import { CardType, SpecialCondition, Stage } from '../../game/store/card/card-types';
import { PokemonCard } from '../../game/store/card/pokemon-card';
import { AddSpecialConditionsEffect } from '../../game/store/effects/attack-effects';
import { Effect } from '../../game/store/effects/effect';

import { IS_ABILITY_BLOCKED, WAS_ATTACK_USED } from '../../game/store/prefabs/prefabs';

export class Weavile extends PokemonCard {

  public stage: Stage = Stage.STAGE_1;

  public cardType: CardType = CardType.DARK;

  public hp: number = 90;

  public retreat = [CardType.COLORLESS];

  public weakness = [{ type: CardType.FIGHTING }];

  public resistance = [{ type: CardType.PSYCHIC, value: -20 }];

  public attacks = [
    {
      name: 'Icy Wind',
      cost: [CardType.COLORLESS],
      damage: 10,
      text: 'Your opponent\'s Active Pokémon is now Asleep.'
    },
    {
      name: 'Evil Admonition',
      cost: [CardType.DARK],
      damage: 50,
      damageCalculation: 'x',
      text: 'This attack does 50 damage for each of your opponent\'s Pokémon that has an Ability.'
    }
  ];

  public set: string = 'UPR';

  public cardImage: string = 'assets/cardback.png';

  public setNumber: string = '74';

  public name: string = 'Weavile';

  public fullName: string = 'Weavile UPR';

  public evolvesFrom = 'Sneasel';

  public reduceEffect(store: StoreLike, state: State, effect: Effect): State {
    if (WAS_ATTACK_USED(effect, 1, this)) {

      const player = effect.player;
      const opponent = StateUtils.getOpponent(state, player);

      let pokemonWithUsableAbilities = 0;

      // Check active Pokemon
      const opponentActive = opponent.active.getPokemonCard();
      if (opponentActive && opponentActive.powers.length > 0) {
        // Check if the ability is actually usable
        if (this.hasActuallyUsableAbility(store, state, opponent, opponentActive)) {
          pokemonWithUsableAbilities++;
        }
      }

      // Check bench Pokemon
      opponent.bench.forEach(benchSlot => {
        if (benchSlot.cards.length > 0) {
          const benchPokemon = benchSlot.getPokemonCard();
          if (benchPokemon && benchPokemon.powers.length > 0) {
            // Check if the ability is actually usable
            if (this.hasActuallyUsableAbility(store, state, opponent, benchPokemon)) {
              pokemonWithUsableAbilities++;
            }
          }
        }
      });
      effect.damage = pokemonWithUsableAbilities * 50;
      return state;
    }

    if (WAS_ATTACK_USED(effect, 0, this)) {
      const sleepEffect = new AddSpecialConditionsEffect(effect, [SpecialCondition.ASLEEP]);
      store.reduceEffect(state, sleepEffect);

      return state;
    }
    return state;
  }

  private hasActuallyUsableAbility(store: StoreLike, state: State, player: any, pokemon: PokemonCard): boolean {
    for (const power of pokemon.powers) {
      if (power.powerType === PowerType.ABILITY) {
        if (!IS_ABILITY_BLOCKED(store, state, player, pokemon) || power.exemptFromAbilityLock || power.exemptFromInitialize || power.abilityLock) {
          return true;
        }
      }
    }
    return false;
  }
}
