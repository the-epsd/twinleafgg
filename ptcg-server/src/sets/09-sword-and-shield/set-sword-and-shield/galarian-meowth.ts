import { PokemonCard, Stage, CardType, StoreLike, State } from "../../../game";
import { Effect } from "../../../game/store/effects/effect";
import { NEXT_TURN_ATTACK_BONUS } from "../../../game/store/prefabs/attack-effects";

export class GalarianMeowth extends PokemonCard {
  public stage: Stage = Stage.BASIC;
  public cardType: CardType = M;
  public hp: number = 70;
  public weakness = [{ type: R }];
  public resistance = [{ type: G, value: -30 }];
  public retreat = [C];

  public attacks = [{
    name: 'Hone Claws',
    cost: [C],
    damage: 0,
    text: 'During your next turn, this Pokémon\'s Slash attack does 60 more damage (before applying Weakness and Resistance).'
  },
  {
    name: 'Slash',
    cost: [M, C],
    damage: 30,
    text: ''
  }];

  public regulationMark: string = 'D';
  public set: string = 'SSH';
  public setNumber: string = '127';
  public cardImage: string = 'assets/cardback.png';
  public name: string = 'Galarian Meowth';
  public fullName: string = 'Galarian Meowth SSH';

  public reduceEffect(store: StoreLike, state: State, effect: Effect): State {
    // Hone Claws
    NEXT_TURN_ATTACK_BONUS(effect, {
      attack: this.attacks[1],
      setupAttack: this.attacks[0],
      source: this,
      bonusDamage: 60,
    });

    return state;
  }
}
