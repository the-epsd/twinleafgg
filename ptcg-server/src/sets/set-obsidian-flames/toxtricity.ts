import { PokemonCard } from '../../game/store/card/pokemon-card';
import { Stage, CardType } from '../../game/store/card/card-types';
import { StoreLike, State } from '../../game';
import { Effect } from '../../game/store/effects/effect';
import { COIN_FLIP_PROMPT, WAS_ATTACK_USED } from '../../game/store/prefabs/prefabs';
import { YOUR_OPPPONENTS_ACTIVE_POKEMON_IS_NOW_PARALYZED } from '../../game/store/prefabs/attack-effects';
import { CheckPokemonTypeEffect } from '../../game/store/effects/check-effects';

export class Toxtricity extends PokemonCard {
  public regulationMark: string = 'G';
  public stage: Stage = Stage.STAGE_1;
  public evolvesFrom = 'Toxel';
  public cardType: CardType = L;
  public hp: number = 140;
  public weakness = [{ type: F }];
  public retreat = [C, C];

  public attacks = [{
    name: 'Leer',
    cost: [L],
    damage: 0,
    text: 'Flip a coin. If heads, your opponent\'s Active Pokémon is now Paralyzed.'
  },
  {
    name: 'Loud Mix',
    cost: [L, C],
    damage: 50,
    damageCalculation: '+',
    text: 'This attack does 30 more damage for each different type of Pokémon on your Bench.'
  }];

  public set: string = 'OBF';
  public cardImage: string = 'assets/cardback.png';
  public setNumber: string = '72';
  public name: string = 'Toxtricity';
  public fullName: string = 'Toxtricity OBF';

  public reduceEffect(store: StoreLike, state: State, effect: Effect): State {
  
    if (WAS_ATTACK_USED(effect, 0, this)) {
      COIN_FLIP_PROMPT(store, state, effect.player, (result => {
        if (result) {
          YOUR_OPPPONENTS_ACTIVE_POKEMON_IS_NOW_PARALYZED(store, state, effect);
        }
      }));
    }

    if (WAS_ATTACK_USED(effect, 1, this)) {
      const player = effect.player;
      const playerBench = player.bench;

      const uniqueTypes = new Set<CardType>();

      playerBench.forEach(c => {
        if (c.getPokemonCard() instanceof PokemonCard) {
          const card = c.getPokemonCard();
          const checkEffect = new CheckPokemonTypeEffect(c);
          store.reduceEffect(state, checkEffect);
          console.log('Card Types:', checkEffect.cardTypes);
          console.log('Additional Types:', card?.additionalCardTypes);
          checkEffect.cardTypes.forEach(type => uniqueTypes.add(type));
        }
      });

      console.log('Unique types:', uniqueTypes);

      // Set the damage based on the count of unique Pokémon types
      effect.damage += 30 * uniqueTypes.size;

      return state;
    }
    return state;
  }
}
