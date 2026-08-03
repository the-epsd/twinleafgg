import { PokemonCard } from '../../game/store/card/pokemon-card';
import { CardType, Stage } from '../../game/store/card/card-types';
import { State, StateUtils, StoreLike } from '../../game';
import { Effect } from '../../game/store/effects/effect';
import { WAS_ATTACK_USED } from '../../game/store/prefabs/prefabs';
import { DealDamageEffect } from '../../game/store/effects/attack-effects';

export class Magneton extends PokemonCard {
  public stage: Stage = Stage.STAGE_1;
  public evolvesFrom: string = 'Magnemite';
  public hp: number = 80;
  public cardType: CardType = L;
  public weakness = [{ type: F }];
  public retreat = [C, C];

  public attacks = [{
    name: 'Sonicboom',
    cost: [L, C],
    damage: 20,
    text: 'Don\'t apply Weakness and Resistance for this attack. (Any other effects that would happen after applying Weakness and Resistance still happen.)'
  },
  {
    name: 'Selfdestruct',
    cost: [L, L, L, L],
    damage: 100,
    text: 'Does 20 damage to each Pokémon on each player\'s Bench. (Don\'t apply Weakness and Resistance for Benched Pokémon.) Magneton does 100 damage to itself.'
  }];

  public set: string = 'FO';
  public cardImage: string = 'assets/cardback.png';
  public setNumber: string = '11';
  public name: string = 'Magneton';
  public fullName: string = 'Magneton FO';

  public reduceEffect(store: StoreLike, state: State, effect: Effect): State {
    // Sonicboom
    if (WAS_ATTACK_USED(effect, 0, this)) {
      effect.ignoreResistance = true;
      effect.ignoreWeakness = true;
    }

    // Selfdestruct
    if (WAS_ATTACK_USED(effect, 1, this)) {
      const player = effect.player;
      const opponent = StateUtils.getOpponent(state, player);
      // Damage opponent's bench
      opponent.bench.forEach(benchPokemon => {
        const dealDamage = new DealDamageEffect(effect, 20);
        dealDamage.target = benchPokemon;
        store.reduceEffect(state, dealDamage);
      });
      // Damage player's bench
      player.bench.forEach(benchPokemon => {
        const dealDamage = new DealDamageEffect(effect, 20);
        dealDamage.target = benchPokemon;
        store.reduceEffect(state, dealDamage);
      });
      // Damage self
      const dealDamage = new DealDamageEffect(effect, 100);
      dealDamage.target = player.active;
      store.reduceEffect(state, dealDamage);
    }

    return state;
  }
}
