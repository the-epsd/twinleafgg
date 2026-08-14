import { PokemonCard, Stage, CardType, StoreLike, State, PlayerType } from "../../../game";
import { Effect } from "../../../game/store/effects/effect";
import { WAS_ATTACK_USED } from "../../../game/store/prefabs/prefabs";
import { YOUR_OPPONENT_CANNOT_ATTACH_ENERGY_FROM_HAND_TO_DEFENDING_POKEMON } from "../../../game/store/prefabs/effect-of-attack-prefabs";

export class Trevenant extends PokemonCard {
  public stage: Stage = Stage.STAGE_1;
  public evolvesFrom: string = 'Phantump';
  public cardType: CardType = P;
  public hp: number = 130;
  public weakness = [{ type: D }];
  public resistance = [{ type: F, value: -30 }];
  public retreat = [C, C, C];

  public attacks = [{
    name: 'Cursed Roots',
    cost: [P],
    damage: 30,
    text: "During your opponent's next turn, Energy can't be attached from your opponent's hand to the Defending Pokémon.",
  },
  {
    name: 'Overwhelming Pain',
    cost: [P, P],
    damage: 60,
    damageCalculation: '+',
    text: "This attack does 10 more damage for each damage counter on all of your opponent's Pokémon.",
  }];

  public regulationMark: string = 'J';
  public set: string = 'CRI';
  public cardImage: string = 'assets/cardback.png';
  public setNumber: string = '39';
  public name: string = 'Trevenant';
  public fullName: string = 'Trevenant M4';

  public reduceEffect(store: StoreLike, state: State, effect: Effect): State {
    // Cursed Roots
    if (WAS_ATTACK_USED(effect, 0, this)) {
      return YOUR_OPPONENT_CANNOT_ATTACH_ENERGY_FROM_HAND_TO_DEFENDING_POKEMON(store, state, effect, this);
    }
    // Overwhelming Pain
    if (WAS_ATTACK_USED(effect, 1, this)) {
      const opponent = effect.opponent;

      let totalDamageCounters = 0;
      opponent.forEachPokemon(PlayerType.TOP_PLAYER, (cardList) => {
        totalDamageCounters += Math.floor(cardList.damage / 10);
      });

      effect.damage += 10 * totalDamageCounters;
    }

    return state;
  }
}
