import { PokemonCard } from '../../../game/store/card/pokemon-card';
import { CardType, Stage } from '../../../game/store/card/card-types';
import { State, StoreLike } from '../../../game';
import { Effect } from '../../../game/store/effects/effect';
import { THIS_ATTACK_DOES_X_DAMAGE_TO_1_OF_YOUR_OPPONENTS_BENCHED_POKEMON, YOUR_OPPPONENTS_ACTIVE_POKEMON_IS_NOW_POISIONED } from '../../../game/store/prefabs/attack-effects';
import { WAS_ATTACK_USED } from '../../../game/store/prefabs/prefabs';

export class Roserade extends PokemonCard {
  public stage: Stage = Stage.STAGE_1;
  public evolvesFrom: string = 'Roselia';
  public hp: number = 90;
  public cardType: CardType[] = [G];
  public weakness = [{ type: R, value: 20 }];
  public retreat = [C];

  public attacks = [{
    name: 'Poison Sting',
    cost: [G, G],
    damage: 30,
    text: 'The Defending Pokémon is now Poisoned.'
  },
  {
    name: 'Spike Whip',
    cost: [G, G, C],
    damage: 50,
    text: 'If Budew is anywhere under Roserade, choose 1 of your opponent\'s Benched Pokémon. This attack does 30 damage to that Pokémon. (Don\'t apply Weakness and Resistance for Benched Pokémon.)'
  }];

  public set: string = 'DP';
  public cardImage: string = 'assets/cardback.png';
  public setNumber: string = '13';
  public name: string = 'Roserade';
  public fullName: string = 'Roserade DP';

  public reduceEffect(store: StoreLike, state: State, effect: Effect): State {
    // Poison Sting
    if (WAS_ATTACK_USED(effect, 0, this)) {
      YOUR_OPPPONENTS_ACTIVE_POKEMON_IS_NOW_POISIONED(store, state, effect);
    }

    // Spike Whip
    if (WAS_ATTACK_USED(effect, 1, this)) {
      if (effect.player.active.getPokemons().some(p => p.name === 'Budew')) {
        THIS_ATTACK_DOES_X_DAMAGE_TO_1_OF_YOUR_OPPONENTS_BENCHED_POKEMON(30, effect, store, state);
      }
    }

    return state;
  }
}
