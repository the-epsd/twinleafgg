import { PokemonCard, Stage, CardType, StoreLike, State, StateUtils } from "../../../game";
import { Effect } from "../../../game/store/effects/effect";
import { WAS_ATTACK_USED } from "../../../game/store/prefabs/prefabs";

export class Primeape extends PokemonCard {
  public stage: Stage = Stage.STAGE_1;
  public evolvesFrom: string = 'Mankey';
  public cardType: CardType = F;
  public hp: number = 90;
  public weakness = [{ type: P }];
  public retreat = [C];

  public attacks = [{
    name: 'Low Kick',
    cost: [C, C],
    damage: 30,
    text: ''
  },
  {
    name: 'Lucha Fight',
    cost: [F, F],
    damage: 90,
    text: 'During your opponent\'s next turn, the Defending Pokémon\'s attacks do 30 more damage (before applying Weakness and Resistance).'
  }];

  public set: string = 'CIN';
  public setNumber: string = '51';
  public cardImage: string = 'assets/cardback.png';
  public name: string = 'Primeape';
  public fullName: string = 'Primeape CIN';

  public reduceEffect(store: StoreLike, state: State, effect: Effect): State {
    // Lucha Fight
    if (WAS_ATTACK_USED(effect, 1, this)) {
      const opponent = StateUtils.getOpponent(state, effect.player);
      opponent.active.attackDamageReductionNextTurn = -30;
    }

    return state;
  }
}
