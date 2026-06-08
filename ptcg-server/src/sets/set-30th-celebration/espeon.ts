import { PokemonCard } from '../../game/store/card/pokemon-card';
import { Stage, CardType } from '../../game/store/card/card-types';
import { StoreLike, State, StateUtils } from '../../game';
import { Effect } from '../../game/store/effects/effect';
import { DEVOLVE_POKEMON, WAS_ATTACK_USED } from '../../game/store/prefabs/prefabs';

export class Espeon extends PokemonCard {
  public stage: Stage = Stage.STAGE_1;
  public evolvesFrom: string = 'Eevee';
  public hp: number = 110;
  public cardType: CardType = P;
  public weakness = [{ type: D }];
  public resistance = [{ type: F, value: -30 }];
  public retreat = [C];

  public attacks = [{
    name: 'Miraculous Shine',
    cost: [P, C],
    damage: 0,
    text: 'Devolve each of your opponent\'s evolved Pokémon by putting the highest Stage Evolution card on it into your opponent\'s hand.'
  },
  {
    name: 'Super Psy Bolt',
    cost: [P, C, C],
    damage: 90,
    text: ''
  }];

  public regulationMark: string = 'J';
  public set: string = '30C';
  public cardImage: string = 'assets/cardback.png';
  public setNumber: string = '69';
  public name: string = 'Espeon';
  public fullName: string = 'Espeon 30C';

  public reduceEffect(store: StoreLike, state: State, effect: Effect): State {
    // Ref: set-ancient-origins/claydol.ts (Rewind — devolve each opponent evolved Pokémon)
    if (WAS_ATTACK_USED(effect, 0, this)) {
      const player = effect.player;
      const opponent = StateUtils.getOpponent(state, player);
      if (opponent.active.getPokemons().length > 1) {
        DEVOLVE_POKEMON(store, state, opponent.active, opponent.hand);
      }
      opponent.bench.forEach(benchSpot => {
        if (benchSpot.cards.length > 0 && benchSpot.getPokemons().length > 1) {
          DEVOLVE_POKEMON(store, state, benchSpot, opponent.hand);
        }
      });
    }
    return state;
  }
}
