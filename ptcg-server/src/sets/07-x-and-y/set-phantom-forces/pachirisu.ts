import { PokemonCard, Stage, CardType, StoreLike, State } from "../../../game";
import { Effect } from "../../../game/store/effects/effect";
import { FLIP_A_COIN_IF_HEADS_DEAL_MORE_DAMAGE } from "../../../game/store/prefabs/attack-effects";
import { WAS_ATTACK_USED } from "../../../game/store/prefabs/prefabs";
import { DEFENDING_POKEMON_WEAKNESS_IS_NOW } from "../../../game/store/prefabs/effect-of-attack-prefabs";

export class Pachirisu extends PokemonCard {
  public stage: Stage = Stage.BASIC;
  public cardType: CardType = L;
  public hp: number = 70;
  public weakness = [{ type: F }];
  public resistance = [{ type: M, value: -20 }];
  public retreat = [C];

  public attacks = [{
    name: 'Trick Sticker',
    cost: [C],
    damage: 10,
    text: 'The Defending Pokémon\'s Weakness is now Lightning until the end of your next turn. (The amount of Weakness doesn\'t change.)'
  },
  {
    name: 'Pachi',
    cost: [L, C],
    damage: 20,
    damageCalculation: '+',
    text: 'Flip a coin. If heads, this attack does 30 more damage.'
  }];

  public set: string = 'PHF';
  public setNumber: string = '25';
  public cardImage: string = 'assets/cardback.png';
  public name: string = 'Pachirisu';
  public fullName: string = 'Pachirisu PHF';

  public reduceEffect(store: StoreLike, state: State, effect: Effect): State {
    // Trick Sticker
    if (WAS_ATTACK_USED(effect, 0, this)) {
      return DEFENDING_POKEMON_WEAKNESS_IS_NOW(store, state, effect, this, CardType.LIGHTNING);
    }

    // Pachi
    if (WAS_ATTACK_USED(effect, 1, this)) {
      FLIP_A_COIN_IF_HEADS_DEAL_MORE_DAMAGE(store, state, effect, 30);
    }

    return state;
  }
}
