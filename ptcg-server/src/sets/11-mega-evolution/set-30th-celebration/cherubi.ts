import { PokemonCard, Stage, CardType, StoreLike, State } from "../../../game";
import { Effect } from "../../../game/store/effects/effect";
import { WAS_ATTACK_USED, COIN_FLIP_PROMPT, PREVENT_DAMAGE, PREVENT_EFFECTS_OF_ATTACKS } from "../../../game/store/prefabs/prefabs";

export class Cherubi extends PokemonCard {
  public stage: Stage = Stage.BASIC;
  public cardType: CardType = G;
  public hp: number = 40;
  public weakness = [{ type: R }];
  public retreat = [C];

  public attacks = [{
    name: 'Hide',
    cost: [C],
    damage: 0,
    text: 'Flip a coin. If heads, during your opponent\'s next turn, prevent all damage from and effects of attacks done to this Pokémon.'
  },
  {
    name: 'Flop',
    cost: [G],
    damage: 10,
    text: ''
  }];

  public regulationMark: string = 'J';
  public set: string = '30C';
  public setNumber: string = '6';
  public cardImage: string = 'assets/cardback.png';
  public name: string = 'Cherubi';
  public fullName: string = 'Cherubi 30C';

  public reduceEffect(store: StoreLike, state: State, effect: Effect): State {
    // Hide
    if (WAS_ATTACK_USED(effect, 0, this)) {
      COIN_FLIP_PROMPT(store, state, effect.player, result => {
        if (result) {
          PREVENT_DAMAGE(store, state, effect, this);
          PREVENT_EFFECTS_OF_ATTACKS(store, state, effect, this);
        }
      });
    }

    return state;
  }
}
