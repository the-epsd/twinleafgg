import { PokemonCard } from '../../game/store/card/pokemon-card';
import { CardTag, Stage, CardType } from '../../game/store/card/card-types';
import { PlayerType, StoreLike, State } from '../../game';
import { Effect } from '../../game/store/effects/effect';
import { WAS_ATTACK_USED } from '../../game/store/prefabs/prefabs';

export class Espeonex extends PokemonCard {
  public stage: Stage = Stage.STAGE_1;
  public tags = [CardTag.POKEMON_ex];
  public evolvesFrom: string = 'Eevee';
  public hp: number = 260;
  public cardType: CardType = P;
  public weakness = [{ type: D }];
  public retreat = [C];

  public attacks = [{
    name: 'Sunshine Beatdown',
    cost: [P, C],
    damage: 30,
    damageCalculation: 'x',
    text: 'This attack does 30 damage for each of your Pokémon in play.'
  }];

  public regulationMark: string = 'J';
  public set: string = '30C';
  public cardImage: string = 'assets/cardback.png';
  public setNumber: string = '70';
  public name: string = 'Espeon ex';
  public fullName: string = 'Espeon ex 30C';

  public reduceEffect(store: StoreLike, state: State, effect: Effect): State {
    // Ref: set-perfect-order/serperior.ts (Regal Command — damage per Pokémon in play)
    if (WAS_ATTACK_USED(effect, 0, this)) {
      const player = effect.player;
      let pokemonCount = 0;
      player.forEachPokemon(PlayerType.BOTTOM_PLAYER, () => {
        pokemonCount++;
      });
      effect.damage = pokemonCount * 30;
    }
    return state;
  }
}
