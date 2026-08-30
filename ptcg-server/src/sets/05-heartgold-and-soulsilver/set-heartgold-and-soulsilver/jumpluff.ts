import { PokemonCard } from '../../../game/store/card/pokemon-card';
import { Stage, CardType } from '../../../game/store/card/card-types';
import { StoreLike, State, StateUtils, PlayerType } from '../../../game';
import { Effect } from '../../../game/store/effects/effect';
import { WAS_ATTACK_USED } from '../../../game/store/prefabs/prefabs';
import { THIS_POKEMON_TAKES_LESS_DAMAGE_FROM_ATTACKS_DURING_OPPONENTS_NEXT_TURN } from '../../../game/store/prefabs/effect-of-attack-prefabs';

export class Jumpluff extends PokemonCard {
  public stage: Stage = Stage.STAGE_2;
  public evolvesFrom = 'Skiploom';
  public cardType: CardType[] = [G];
  public hp: number = 90;
  public weakness = [{ type: R }];
  public resistance = [{ type: F, value: -20 }];
  public retreat = [];

  public attacks = [{
    name: 'Mass Attack',
    cost: [G],
    damage: 10,
    damageCalculation: 'x',
    text: 'Does 10 damage times the number of Pokémon in play (both yours and your opponent\'s).'
  },
  {
    name: 'Leaf Guard',
    cost: [G],
    damage: 30,
    text: 'During your opponent\'s next turn, any damage done to Jumpluff by attacks is reduced by 30 (after applying Weakness and Resistance).'
  }];

  public set: string = 'HS';
  public name: string = 'Jumpluff';
  public fullName: string = 'Jumpluff HS';
  public cardImage: string = 'assets/cardback.png';
  public setNumber: string = '6';

  public reduceEffect(store: StoreLike, state: State, effect: Effect): State {

    if (WAS_ATTACK_USED(effect, 0, this)) {
      const player = effect.player;
      const opponent = StateUtils.getOpponent(state, player);
      let pokemonInPlay = 0;
      player.forEachPokemon(PlayerType.BOTTOM_PLAYER, () => { pokemonInPlay += 1; });
      opponent.forEachPokemon(PlayerType.TOP_PLAYER, () => { pokemonInPlay += 1; });
      effect.damage = 10 * pokemonInPlay;
    }

    if (WAS_ATTACK_USED(effect, 1, this)) {
      return THIS_POKEMON_TAKES_LESS_DAMAGE_FROM_ATTACKS_DURING_OPPONENTS_NEXT_TURN(store, state, effect, 30);
    }

    return state;
  }

}
