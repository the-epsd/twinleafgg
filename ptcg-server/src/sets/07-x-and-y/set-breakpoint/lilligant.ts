import { PokemonCard, Stage, CardType, StoreLike, State } from "../../../game";
import { Effect } from "../../../game/store/effects/effect";
import { WAS_ATTACK_USED, MULTIPLE_COIN_FLIPS_PROMPT } from "../../../game/store/prefabs/prefabs";
import { DEFENDING_POKEMON_ASLEEP_ON_ENERGY_ATTACH_FROM_HAND_NEXT_TURN } from "../../../game/store/prefabs/effect-of-attack-prefabs";

export class Lilligant extends PokemonCard {
  public stage: Stage = Stage.STAGE_1;
  public evolvesFrom: string = 'Petilil';
  public cardType: CardType[] = [G];
  public hp: number = 80;
  public weakness = [{ type: R }];
  public retreat = [C];

  public attacks = [{
    name: 'Boo-Hoo',
    cost: [G],
    damage: 20,
    text: 'If your opponent attaches an Energy card from his or her hand to the Defending Pokémon during his or her next turn, that Pokémon will be Asleep.'
  },
  {
    name: 'Leaf Slice',
    cost: [C, C],
    damage: 30,
    damageCalculation: 'x',
    text: 'Flip 2 coins. This attack does 30 damage times the number of heads.'
  }];

  public set: string = 'BKP';
  public setNumber: string = '8';
  public cardImage: string = 'assets/cardback.png';
  public name: string = 'Lilligant';
  public fullName: string = 'Lilligant BKP';

  public reduceEffect(store: StoreLike, state: State, effect: Effect): State {
    // Boo-Hoo
    if (WAS_ATTACK_USED(effect, 0, this)) {
      return DEFENDING_POKEMON_ASLEEP_ON_ENERGY_ATTACH_FROM_HAND_NEXT_TURN(store, state, effect, this);
    }

    // Leaf Slice
    if (WAS_ATTACK_USED(effect, 1, this)) {
      MULTIPLE_COIN_FLIPS_PROMPT(store, state, effect.player, 2, results => {
        const heads = results.filter(r => r).length;
        effect.damage = 30 * heads;
      });
    }

    return state;
  }
}
