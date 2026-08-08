import { PokemonCard, Stage, CardTag, CardType, StoreLike, State } from "../../../game";
import { Effect } from "../../../game/store/effects/effect";
import { WAS_ATTACK_USED, DEFENDING_POKEMON_ATTACKS_COST_MORE } from "../../../game/store/prefabs/prefabs";

export class FlappleV extends PokemonCard {
  public stage: Stage = Stage.BASIC;
  public tags = [CardTag.POKEMON_V];
  public cardType: CardType = G;
  public hp: number = 190;
  public weakness = [{ type: R }];
  public resistance = [];
  public retreat = [C];

  public attacks = [{
    name: 'Sour Spit',
    cost: [G],
    damage: 20,
    text: 'During your opponent\'s next turn, the Defending Pokémon\'s attacks cost [C][C] more.'
  },
  {
    name: 'Wing Attack',
    cost: [G, C, C],
    damage: 120,
    text: ''
  }];

  public regulationMark = 'E';
  public set: string = 'BST';
  public cardImage: string = 'assets/cardback.png';
  public setNumber: string = '18';
  public name: string = 'Flapple V';
  public fullName: string = 'Flapple V BST';

  public reduceEffect(store: StoreLike, state: State, effect: Effect): State {
    // Sour Spit
    if (WAS_ATTACK_USED(effect, 0, this)) {
      state = DEFENDING_POKEMON_ATTACKS_COST_MORE(store, state, effect, 2);
    }

    return state;
  }
}
