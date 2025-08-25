import { PokemonCard } from '../../game/store/card/pokemon-card';
import { Stage, CardType } from '../../game/store/card/card-types';
import { StoreLike, State, StateUtils } from '../../game';
import { Effect } from '../../game/store/effects/effect';
import { AttackEffect } from '../../game/store/effects/game-effects';
import { IS_ABILITY_BLOCKED } from '../../game/store/prefabs/prefabs';
import { PowerType } from '../../game/store/card/pokemon-types';

export class Scizor extends PokemonCard {
  public stage: Stage = Stage.STAGE_1;
  public evolvesFrom = 'Scyther';
  public cardType: CardType = M;
  public hp: number = 140;
  public weakness = [{ type: R }];
  public resistance = [{ type: G, value: -30 }];
  public retreat = [C, C];

  public attacks = [{
    name: 'Punishing Scissors',
    cost: [M],
    damage: 10,
    damageCalculation: '+',
    text: 'This attack does 50 more damage for each of your opponent\'s Pokémon in play that has an Ability.'
  },
  {
    name: 'Cut',
    cost: [M, M],
    damage: 70,
    text: ''
  }];

  public regulationMark = 'G';
  public set: string = 'OBF';
  public cardImage: string = 'assets/cardback.png';
  public setNumber: string = '141';
  public name: string = 'Scizor';
  public fullName: string = 'Scizor OBF';

  public reduceEffect(store: StoreLike, state: State, effect: Effect): State {

    if (effect instanceof AttackEffect && effect.attack === this.attacks[0]) {

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

      effect.damage += pokemonWithUsableAbilities * 50;

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