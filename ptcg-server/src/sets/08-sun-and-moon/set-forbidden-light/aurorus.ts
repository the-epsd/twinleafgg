import { PokemonCard, Stage, CardType, StoreLike, State } from "../../../game";
import { Effect } from "../../../game/store/effects/effect";
import { WAS_ATTACK_USED, THIS_POKEMON_CANNOT_ATTACK_NEXT_TURN } from "../../../game/store/prefabs/prefabs";
import { PREVENT_DAMAGE } from "../../../game/store/prefabs/effect-of-attack-prefabs";

export class Aurorus extends PokemonCard {
  public stage: Stage = Stage.STAGE_2;
  public evolvesFrom: string = 'Amaura';
  public cardType: CardType = W;
  public hp: number = 160;
  public weakness = [{ type: M }];
  public retreat = [C, C, C, C];

  public attacks = [{
    name: 'Frost Wall',
    cost: [W, C, C],
    damage: 50,
    text: 'During your opponent\'s next turn, prevent all damage done to this Pokémon by attacks from Evolution Pokémon.'
  },
  {
    name: 'Blizzard Burn',
    cost: [W, W, C, C],
    damage: 150,
    text: 'This Pokémon can\'t attack during your next turn.'
  }];

  public set: string = 'FLI';
  public setNumber: string = '28';
  public cardImage: string = 'assets/cardback.png';
  public name: string = 'Aurorus';
  public fullName: string = 'Aurorus FLI';

  public reduceEffect(store: StoreLike, state: State, effect: Effect): State {
    // Frost Wall
    if (WAS_ATTACK_USED(effect, 0, this)) {
      PREVENT_DAMAGE(store, state, effect, this, { sourceIsEvolution: true });
    }

    // Blizzard Burn
    if (WAS_ATTACK_USED(effect, 1, this)) {
      THIS_POKEMON_CANNOT_ATTACK_NEXT_TURN(effect.player);
    }

    return state;
  }
}
