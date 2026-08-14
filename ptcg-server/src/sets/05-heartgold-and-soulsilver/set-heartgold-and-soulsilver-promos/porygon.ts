import { CardType, PokemonCard, Stage, State, StoreLike } from "../../../game";
import { Effect } from "../../../game/store/effects/effect";
import { WAS_ATTACK_USED, SEARCH_YOUR_DECK_FOR_POKEMON_AND_PUT_INTO_HAND } from "../../../game/store/prefabs/prefabs";
import { THIS_POKEMON_TAKES_LESS_DAMAGE_FROM_ATTACKS_DURING_OPPONENTS_NEXT_TURN } from "../../../game/store/prefabs/effect-of-attack-prefabs";

export class Porygon extends PokemonCard {
  public stage: Stage = Stage.BASIC;
  public cardType: CardType = C;
  public hp: number = 50;
  public weakness = [{ type: F }];
  public retreat = [C];

  public attacks = [{
    name: 'Stiffen',
    cost: [C],
    damage: 0,
    text: 'During your opponent\'s next turn, any damage done to Porygon by attacks is reduced by 20 (after applying Weakness and Resistance).'
  },
  {
    name: 'Version Update',
    cost: [C, C],
    damage: 0,
    text: 'Search your deck for Porygon2, show it to your opponent, and put it into your hand. Shuffle your deck afterward.'
  }];

  public set: string = 'HSP';
  public name: string = 'Porygon';
  public fullName: string = 'Porygon HSP';
  public cardImage: string = 'assets/cardback.png';
  public setNumber: string = '22';

  public reduceEffect(store: StoreLike, state: State, effect: Effect): State {
    if (WAS_ATTACK_USED(effect, 0, this)) {
      return THIS_POKEMON_TAKES_LESS_DAMAGE_FROM_ATTACKS_DURING_OPPONENTS_NEXT_TURN(store, state, effect, 20);
    }

    if (WAS_ATTACK_USED(effect, 1, this)) {
      SEARCH_YOUR_DECK_FOR_POKEMON_AND_PUT_INTO_HAND(store, state, effect.player, { name: 'Porygon2' });
    }

    return state;
  }

}
