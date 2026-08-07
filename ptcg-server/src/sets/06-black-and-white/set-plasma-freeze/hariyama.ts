import { PokemonCard, Stage, CardType, StoreLike, State } from "../../../game";
import { Effect } from "../../../game/store/effects/effect";
import { AFTER_ATTACK, COIN_FLIP_PROMPT, ADD_PARALYZED_TO_PLAYER_ACTIVE, WAS_ATTACK_USED } from "../../../game/store/prefabs/prefabs";

export class Hariyama extends PokemonCard {
  public stage: Stage = Stage.STAGE_1;
  public evolvesFrom: string = 'Makuhita';
  public cardType: CardType = F;
  public hp: number = 120;
  public weakness = [{ type: P }];
  public retreat = [C, C, C];

  public attacks = [{
    name: 'Fake Out',
    cost: [F, C],
    damage: 30,
    text: 'Flip a coin. If heads, the Defending Pokémon is now Paralyzed.'
  },
  {
    name: 'Pivot Throw',
    cost: [F, F, C],
    damage: 90,
    text: 'During your opponent\'s next turn, any damage done to this Pokémon by attacks is increased by 20 (after applying Weakness and Resistance).'
  }];

  public set: string = 'PLF';
  public setNumber: string = '63';
  public cardImage: string = 'assets/cardback.png';
  public name: string = 'Hariyama';
  public fullName: string = 'Hariyama PLF';

  public reduceEffect(store: StoreLike, state: State, effect: Effect): State {
    // Fake Out
    if (AFTER_ATTACK(effect, 0, this)) {
      COIN_FLIP_PROMPT(store, state, effect.player, result => {
        if (result) {
          ADD_PARALYZED_TO_PLAYER_ACTIVE(store, state, effect.opponent, this);
        }
      });
    }

    // Pivot Throw
    if (WAS_ATTACK_USED(effect, 1, this)) {
      effect.player.active.damageReductionNextTurn = -20;
    }

    return state;
  }
}
