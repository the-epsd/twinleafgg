import { PokemonCard } from '../../game/store/card/pokemon-card';
import { Stage, CardType } from '../../game/store/card/card-types';
import { PlayerType, StoreLike, State } from '../../game';
import { Effect } from '../../game/store/effects/effect';
import { WAS_ATTACK_USED, THIS_POKEMON_DOES_DAMAGE_TO_ITSELF } from '../../game/store/prefabs/prefabs';

export class Gigalith extends PokemonCard {
  public stage: Stage = Stage.STAGE_2;
  public evolvesFrom: string = 'Boldore';
  public cardType: CardType = F;
  public hp: number = 140;
  public weakness = [{ type: G }];
  public retreat = [C, C, C, C];

  public attacks = [
    {
      name: 'Revenge Cannon',
      cost: [F, C, C],
      damage: 10,
      damageCalculation: '+' as '+',
      text: 'Does 10 more damage for each damage counter on each of your Benched Pokémon.'
    },
    {
      name: 'Reckless Charge',
      cost: [F, F, C, C],
      damage: 120,
      text: 'This Pokémon does 40 damage to itself.'
    }
  ];

  public set: string = 'DRX';
  public setNumber: string = '67';
  public cardImage: string = 'assets/cardback.png';
  public name: string = 'Gigalith';
  public fullName: string = 'Gigalith DRX';

  public reduceEffect(store: StoreLike, state: State, effect: Effect): State {
    // Revenge Cannon - 10 more damage for each damage counter on Benched Pokemon
    if (WAS_ATTACK_USED(effect, 0, this)) {
      const player = effect.player;
      let totalDamageCounters = 0;

      player.forEachPokemon(PlayerType.BOTTOM_PLAYER, cardList => {
        if (cardList === player.active) {
          return;
        }
        totalDamageCounters += Math.floor(cardList.damage / 10);
      });

      effect.damage += 10 * totalDamageCounters;
    }

    // Reckless Charge - 40 damage to self
    if (WAS_ATTACK_USED(effect, 1, this)) {
      THIS_POKEMON_DOES_DAMAGE_TO_ITSELF(store, state, effect, 40);
    }

    return state;
  }
}
