import { PokemonCard, Stage, CardType, StoreLike, State } from "../../game";
import { Effect } from "../../game/store/effects/effect";
import { DISCARD_X_ENERGY_FROM_THIS_POKEMON } from "../../game/store/prefabs/costs";
import { WAS_ATTACK_USED } from "../../game/store/prefabs/prefabs";

export class Luxray extends PokemonCard {
  public stage: Stage = Stage.STAGE_2;
  public evolvesFrom = 'Luxio';
  public cardType: CardType = L;
  public hp: number = 150;
  public weakness = [{ type: F }];
  public retreat = [];

  public attacks = [{
    name: 'Pressure',
    cost: [L, C],
    damage: 0,
    damageCalculation: 'x',
    text: 'This attack does 70 damage for each Prize card you have taken.'
  },
  {
    name: 'Strong Bolt',
    cost: [L, C, C],
    damage: 200,
    text: 'Discard 2 Energy from this Pokemon.'
  }];

  public regulationMark = 'J';
  public set: string = 'M3';
  public cardImage: string = 'assets/cardback.png';
  public setNumber: string = '27';
  public name: string = 'Luxray';
  public fullName: string = 'Luxray M3';

  public reduceEffect(store: StoreLike, state: State, effect: Effect): State {
    // Pressure - 70x damage per prize card taken
    if (WAS_ATTACK_USED(effect, 0, this)) {
      const player = effect.player;
      effect.damage = player.prizesTaken * 70;
    }

    // Strong Bolt - discard 2 energy
    if (WAS_ATTACK_USED(effect, 1, this)) {
      DISCARD_X_ENERGY_FROM_THIS_POKEMON(store, state, effect, 2);
    }

    return state;
  }
}
