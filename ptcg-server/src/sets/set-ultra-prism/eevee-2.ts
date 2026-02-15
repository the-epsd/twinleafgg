import { PokemonCard } from '../../game/store/card/pokemon-card';
import { Stage, CardType } from '../../game/store/card/card-types';
import { StoreLike, State } from '../../game';
import { CheckPokemonTypeEffect } from '../../game/store/effects/check-effects';
import { Effect } from '../../game/store/effects/effect';
import { WAS_ATTACK_USED } from '../../game/store/prefabs/prefabs';

export class Eevee2 extends PokemonCard {
  public stage: Stage = Stage.BASIC;
  public cardType: CardType = C;
  public hp: number = 60;
  public weakness = [{ type: F }];
  public retreat = [C];

  public attacks = [
    {
      name: 'Palette of Friends',
      cost: [C, C],
      damage: 10,
      damageCalculation: 'x' as 'x',
      text: 'This attack does 10 damage for each different type of Pokémon on your Bench.'
    }
  ];

  public set: string = 'UPR';
  public setNumber: string = '105';
  public cardImage: string = 'assets/cardback.png';
  public name: string = 'Eevee';
  public fullName: string = 'Eevee UPR 105';

  public reduceEffect(store: StoreLike, state: State, effect: Effect): State {
    // Attack 1: Palette of Friends
    // Ref: set-guardians-rising/honchkrow.ts (Raven's Claw - counting across bench)
    if (WAS_ATTACK_USED(effect, 0, this)) {
      const player = effect.player;

      const types = new Set<CardType>();
      player.bench.forEach(benchSlot => {
        if (benchSlot.cards.length > 0) {
          const pokemonCard = benchSlot.getPokemonCard();
          if (pokemonCard) {
            // Check the actual type via CheckPokemonTypeEffect
            const checkType = new CheckPokemonTypeEffect(benchSlot);
            store.reduceEffect(state, checkType);
            checkType.cardTypes.forEach(t => types.add(t));
          }
        }
      });

      effect.damage = 10 * types.size;
    }

    return state;
  }
}
