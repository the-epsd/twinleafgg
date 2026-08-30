import { CardType, PokemonCard, Stage, State, StoreLike } from "../../../game";
import { Effect } from "../../../game/store/effects/effect";
import { WAS_ATTACK_USED } from "../../../game/store/prefabs/prefabs";
import { DEFENDING_POKEMON_DOES_LESS_DAMAGE } from "../../../game/store/prefabs/effect-of-attack-prefabs";

export class Liepard extends PokemonCard {
  public stage: Stage = Stage.STAGE_1;
  public evolvesFrom: string = 'Purrloin';
  public cardType: CardType[] = [D];
  public hp: number = 90;
  public weakness = [{ type: F }];
  public resistance = [{ type: P, value: -20 }];
  public retreat = [C];

  public attacks = [{
    name: 'Gentle Bite',
    cost: [D],
    damage: 10,
    text: 'During your opponent\'s next turn, any damage done by attacks from the Defending Pokémon is reduced by 60 (before applying Weakness and Resistance).'
  },
  {
    name: 'Mach Claw',
    cost: [D, D],
    damage: 40,
    text: 'This attack\'s damage isn\'t affected by Resistance.'
  }];

  public set: string = 'PHF';
  public setNumber: string = '57';
  public cardImage: string = 'assets/cardback.png';
  public name: string = 'Liepard';
  public fullName: string = 'Liepard PHF';

  public reduceEffect(store: StoreLike, state: State, effect: Effect): State {
    // Gentle Bite
    if (WAS_ATTACK_USED(effect, 0, this)) {
      return DEFENDING_POKEMON_DOES_LESS_DAMAGE(store, state, effect, this, 60);
    }

    // Mach Claw
    if (WAS_ATTACK_USED(effect, 1, this)) {
      effect.ignoreResistance = true;
    }

    return state;
  }
}
