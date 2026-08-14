import { PokemonCard, Stage, CardType, StoreLike, State } from "../../../game";
import { Effect } from "../../../game/store/effects/effect";
import { WAS_ATTACK_USED, SWITCH_ACTIVE_WITH_BENCHED, AFTER_ATTACK } from "../../../game/store/prefabs/prefabs";
import { YOUR_OPPONENT_CANNOT_ATTACH_ENERGY_FROM_HAND_TO_DEFENDING_POKEMON } from "../../../game/store/prefabs/effect-of-attack-prefabs";

export class Masquerain extends PokemonCard {
  public stage: Stage = Stage.STAGE_1;
  public evolvesFrom: string = 'Surskit';
  public cardType: CardType = G;
  public hp: number = 90;
  public weakness = [{ type: R }];
  public retreat = [C];

  public attacks = [{
    name: 'Threatening Pattern',
    cost: [C],
    damage: 30,
    text: 'During your opponent\'s next turn, Energy can\'t be attached from your opponent\'s hand to the Defending Pokémon.'
  },
  {
    name: 'U-turn',
    cost: [C, C],
    damage: 40,
    text: 'Switch this Pokémon with 1 of your Benched Pokémon.'
  }];

  public regulationMark: string = 'D';
  public set: string = 'RCL';
  public setNumber: string = '11';
  public cardImage: string = 'assets/cardback.png';
  public name: string = 'Masquerain';
  public fullName: string = 'Masquerain RCL';

  public reduceEffect(store: StoreLike, state: State, effect: Effect): State {
    // Threatening Pattern
    if (WAS_ATTACK_USED(effect, 0, this)) {
      return YOUR_OPPONENT_CANNOT_ATTACH_ENERGY_FROM_HAND_TO_DEFENDING_POKEMON(store, state, effect, this);
    }
    // U-turn
    if (AFTER_ATTACK(effect, 1, this)) {
      const player = effect.player;
      if (player.bench.some(b => b.cards.length > 0)) {
        SWITCH_ACTIVE_WITH_BENCHED(store, state, player);
      }
    }

    return state;
  }
}
