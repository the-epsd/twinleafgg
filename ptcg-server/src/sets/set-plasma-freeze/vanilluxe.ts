import { ADD_SLEEP_TO_PLAYER_ACTIVE, AFTER_ATTACK, MULTIPLE_COIN_FLIPS_PROMPT, WAS_ATTACK_USED } from '../../game/store/prefabs/prefabs';
import { CardTag, CardType, Stage } from '../../game/store/card/card-types';
import { CheckProvidedEnergyEffect } from '../../game/store/effects/check-effects';
import { PokemonCard } from '../../game/store/card/pokemon-card';
import { Effect } from '../../game/store/effects/effect';
import { State, StoreLike } from '../../game';
export class Vanilluxe extends PokemonCard {
  public tags = [CardTag.TEAM_PLASMA];
  public stage: Stage = Stage.STAGE_2;
  public evolvesFrom: string = 'Vanillish';
  public cardType: CardType = W;
  public hp: number = 130;
  public weakness = [{ type: M }];
  public retreat = [C];

  public attacks = [
    {
      name: 'ChillMAX',
      cost: [C],
      damage: 60,
      damageCalculation: 'x' as const,
      text: 'Flip a coin for each Energy attached to this Pokémon. This attack does 60 damage for each heads.'
    },
    {
      name: 'Cold Breath',
      cost: [W, C],
      damage: 40,
      text: 'The Defending Pokémon is now Asleep.'
    }
  ];

  public set: string = 'PLF';
  public setNumber: string = '29';
  public cardImage: string = 'assets/cardback.png';
  public name: string = 'Vanilluxe';
  public fullName: string = 'Vanilluxe PLF';

  public reduceEffect(store: StoreLike, state: State, effect: Effect): State {
    // Attack 1: ChillMAX - flip coin per energy, 60x heads
    if (WAS_ATTACK_USED(effect, 0, this)) {
      const player = effect.player;

      // Count energy attached
      const checkEnergy = new CheckProvidedEnergyEffect(player);
      store.reduceEffect(state, checkEnergy);
      const energyCount = checkEnergy.energyMap.length;

      if (energyCount === 0) {
        effect.damage = 0;
        return state;
      }

      MULTIPLE_COIN_FLIPS_PROMPT(store, state, player, energyCount, results => {
        const heads = results.filter(r => r).length;
        effect.damage = 60 * heads;
      });
    }

    // Attack 2: Cold Breath
    if (AFTER_ATTACK(effect, 1, this)) {
      ADD_SLEEP_TO_PLAYER_ACTIVE(store, state, effect.opponent, this);
    }

    return state;
  }
}
