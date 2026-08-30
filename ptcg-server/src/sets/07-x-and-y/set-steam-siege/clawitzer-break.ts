import { PokemonCard, CardTag, Stage, CardType, StoreLike, State } from "../../../game";
import { Effect } from "../../../game/store/effects/effect";
import { WAS_ATTACK_USED, BREAK_RULE } from "../../../game/store/prefabs/prefabs";
import { BLOCK_RETREAT, DEFENDING_POKEMON_TAKES_MORE_DAMAGE_DURING_YOUR_NEXT_TURN } from "../../../game/store/prefabs/effect-of-attack-prefabs";

export class ClawitzerBreak extends PokemonCard {
  protected _tags = [CardTag.BREAK];
  public stage: Stage = Stage.BREAK;
  public evolvesFrom: string = 'Clawitzer';
  public cardType: CardType[] = [W];
  public hp: number = 130;
  public retreat = [];

  public attacks = [{
    name: 'Lock-On',
    cost: [C],
    damage: 0,
    text: "The Defending Pokémon can't retreat during your opponent's next turn. During your next turn, any damage done to that Pokémon by attacks is increased by 120 (after applying Weakness and Resistance)."
  }];

  public set: string = 'STS';
  public setNumber: string = '35';
  public cardImage: string = 'assets/cardback.png';
  public name: string = 'Clawitzer BREAK';
  public fullName: string = 'Clawitzer BREAK STS';

  public reduceEffect(store: StoreLike, state: State, effect: Effect): State {
    // Lock-On
    if (WAS_ATTACK_USED(effect, 0, this)) {
      state = DEFENDING_POKEMON_TAKES_MORE_DAMAGE_DURING_YOUR_NEXT_TURN(store, state, effect, this, 120);
      return BLOCK_RETREAT(store, state, effect, this);
    }

    BREAK_RULE(effect, state, this);

    return state;
  }
}
