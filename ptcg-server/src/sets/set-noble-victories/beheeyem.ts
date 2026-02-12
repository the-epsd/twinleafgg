import { PokemonCard } from '../../game/store/card/pokemon-card';
import { Stage, CardType } from '../../game/store/card/card-types';
import { StoreLike, State, StateUtils } from '../../game';
import { Effect } from '../../game/store/effects/effect';
import { WAS_ATTACK_USED } from '../../game/store/prefabs/prefabs';
import { PutDamageEffect } from '../../game/store/effects/attack-effects';
import { CheckPokemonTypeEffect } from '../../game/store/effects/check-effects';

export class Beheeyem extends PokemonCard {
  public stage: Stage = Stage.STAGE_1;
  public evolvesFrom = 'Elgyem';
  public cardType: CardType = P;
  public hp: number = 80;
  public weakness = [{ type: P }];
  public retreat = [C];

  public attacks = [
    {
      name: 'Synchronoise',
      cost: [P],
      damage: 20,
      text: 'Does 20 damage to each of your opponent\'s Benched Pokémon that shares a type with the Defending Pokémon. (Don\'t apply Weakness and Resistance for Benched Pokémon.)'
    },
    {
      name: 'Psyshot',
      cost: [P, C],
      damage: 40,
      text: ''
    }
  ];

  public set: string = 'NVI';
  public setNumber: string = '56';
  public cardImage: string = 'assets/cardback.png';
  public name: string = 'Beheeyem';
  public fullName: string = 'Beheeyem NVI';

  public reduceEffect(store: StoreLike, state: State, effect: Effect): State {
    // Synchronoise - damage benched Pokémon of same type as active
    if (WAS_ATTACK_USED(effect, 0, this)) {
      const player = effect.player;
      const opponent = StateUtils.getOpponent(state, player);

      // Get defending Pokémon's type(s)
      const defendingTypeEffect = new CheckPokemonTypeEffect(opponent.active);
      store.reduceEffect(state, defendingTypeEffect);
      const defendingTypes = defendingTypeEffect.cardTypes;

      // Damage each benched Pokémon that shares a type
      opponent.bench.forEach(benchSlot => {
        if (benchSlot.cards.length === 0) {
          return;
        }

        const benchTypeEffect = new CheckPokemonTypeEffect(benchSlot);
        store.reduceEffect(state, benchTypeEffect);
        const benchTypes = benchTypeEffect.cardTypes;

        // Check if any types match
        const sharesType = benchTypes.some(type => defendingTypes.includes(type));

        if (sharesType) {
          const damageEffect = new PutDamageEffect(effect, 20);
          damageEffect.target = benchSlot;
          store.reduceEffect(state, damageEffect);
        }
      });
    }

    return state;
  }
}
