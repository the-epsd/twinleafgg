import { PokemonCard, Stage, CardTag, CardType, StoreLike, State } from "../../../game";
import { Effect } from "../../../game/store/effects/effect";
import { PUT_X_DAMAGE_COUNTERS_IN_ANY_WAY_YOU_LIKE } from "../../../game/store/prefabs/attack-effects";
import { WAS_ATTACK_USED } from "../../../game/store/prefabs/prefabs";
import { THIS_POKEMON_TAKES_LESS_DAMAGE_FROM_ATTACKS_DURING_OPPONENTS_NEXT_TURN } from "../../../game/store/prefabs/effect-of-attack-prefabs";

export class RegisteelStar extends PokemonCard {
  public stage: Stage = Stage.BASIC;
  protected _tags = [CardTag.STAR];
  public cardType: CardType = M;
  public hp: number = 90;
  public weakness = [{ type: R }];
  public resistance = [{ type: G, value: -30 }];
  public retreat = [C, C, C];

  public attacks = [
    {
      name: 'Barrier Attack',
      cost: [M],
      damage: 10,
      text: "During your opponent's next turn, any damage done to Registeel Star by attacks is reduced by 10 (after applying Weakness and Resistance).",
    },
    {
      name: 'Final Laser',
      cost: [M, M, C],
      damage: 70,
      text: "Put 3 damage counters on your opponent's Pokémon in any way you like. If your opponent has only 1 Prize card left and Registeel Star is the only Pokémon you have in play, put 6 damage counters instead.",
    },
  ];

  public set: string = 'LM';
  public setNumber: string = '92';
  public cardImage: string = 'assets/cardback.png';
  public name: string = 'Registeel Star';
  public fullName: string = 'Registeel Star LM';

  public reduceEffect(store: StoreLike, state: State, effect: Effect): State {
    // Flame Screen
    if (WAS_ATTACK_USED(effect, 0, this)) {
      return THIS_POKEMON_TAKES_LESS_DAMAGE_FROM_ATTACKS_DURING_OPPONENTS_NEXT_TURN(store, state, effect, 10);
    }

    if (WAS_ATTACK_USED(effect, 1, this)) {
      const player = effect.player;
      const opponent = effect.opponent;

      let counters = 3;
      const playerBench = player.bench.reduce((left, b) => left + (b.cards.length ? 1 : 0), 0);
      if (playerBench === 0 && opponent.getPrizeLeft() === 1) {
        counters = 6;
      }
      PUT_X_DAMAGE_COUNTERS_IN_ANY_WAY_YOU_LIKE(counters, store, state, effect);
    }

    return state;
  }
}
