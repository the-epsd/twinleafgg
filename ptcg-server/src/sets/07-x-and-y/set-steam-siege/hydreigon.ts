import { CardType, PokemonCard, SlotType, Stage, State, StoreLike } from "../../../game";
import { Effect } from "../../../game/store/effects/effect";
import { DISCARD_UP_TO_X_TYPE_ENERGY_FROM_YOUR_POKEMON } from "../../../game/store/prefabs/costs";
import { WAS_ATTACK_USED } from "../../../game/store/prefabs/prefabs";
import { DEFENDING_POKEMON_DOES_LESS_DAMAGE } from "../../../game/store/prefabs/effect-of-attack-prefabs";

export class Hydreigon extends PokemonCard {
  public stage: Stage = Stage.STAGE_2;
  public evolvesFrom: string = 'Zweilous';
  public cardType: CardType = N;
  public hp: number = 150;
  public weakness = [{ type: Y }];
  public retreat = [C, C, C];

  public attacks = [{
    name: 'Cruel Fang',
    cost: [C, C],
    damage: 40,
    text: 'During your opponent\'s next turn, any damage done by attacks from the Defending Pokémon is reduced by 40 (before applying Weakness and Resistance).'
  },
  {
    name: 'Dark Burn',
    cost: [P, D, C],
    damage: 50,
    damageCalculation: 'x',
    text: 'Discard as many [D] Energy attached to your Pokémon as you like. This attack does 50 damage times the amount of [D] Energy you discarded in this way.'
  }];

  public set: string = 'STS';
  public setNumber: string = '86';
  public cardImage: string = 'assets/cardback.png';
  public name: string = 'Hydreigon';
  public fullName: string = 'Hydreigon STS';

  public reduceEffect(store: StoreLike, state: State, effect: Effect): State {
    // Cruel Fang
    if (WAS_ATTACK_USED(effect, 0, this)) {
      return DEFENDING_POKEMON_DOES_LESS_DAMAGE(store, state, effect, this, 40);
    }
    // Dark Burn
    if (WAS_ATTACK_USED(effect, 1, this)) {
      effect.damage = 0;
      return DISCARD_UP_TO_X_TYPE_ENERGY_FROM_YOUR_POKEMON(
        store, state, effect, Number.MAX_SAFE_INTEGER, CardType.DARK, 0,
        [SlotType.ACTIVE, SlotType.BENCH],
        transfers => {
          effect.damage = transfers.length * 50;
        }
      );
    }

    return state;
  }
}
