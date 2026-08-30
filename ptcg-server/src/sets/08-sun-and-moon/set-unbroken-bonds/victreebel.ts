import { PokemonCard, Stage, CardType, StoreLike, State, StateUtils } from "../../../game";
import { Effect } from "../../../game/store/effects/effect";
import { WAS_ATTACK_USED } from "../../../game/store/prefabs/prefabs";
import { DEFENDING_POKEMON_HAS_NO_ABILITIES_UNTIL_END_OF_YOUR_NEXT_TURN } from "../../../game/store/prefabs/effect-of-attack-prefabs";

export class Victreebel extends PokemonCard {
  public stage: Stage = Stage.STAGE_2;
  public evolvesFrom: string = 'Weepinbell';
  public cardType: CardType[] = [G];
  public hp: number = 140;
  public weakness = [{ type: R }];
  public retreat = [C, C];

  public attacks = [{
    name: 'Reactive Poison',
    cost: [G],
    damage: 10,
    damageCalculation: '+',
    text: 'This attack does 60 more damage for each Special Condition affecting your opponent\'s Active Pokémon.'
  },
  {
    name: 'Gastro Acid',
    cost: [G, C, C],
    damage: 90,
    text: 'The Defending Pokémon has no Abilities until the end of your next turn.'
  }];

  public set: string = 'UNB';
  public setNumber: string = '15';
  public cardImage: string = 'assets/cardback.png';
  public name: string = 'Victreebel';
  public fullName: string = 'Victreebel UNB';

  public reduceEffect(store: StoreLike, state: State, effect: Effect): State {
    // Reactive Poison
    if (WAS_ATTACK_USED(effect, 0, this)) {
      const player = effect.player;
      const opponent = StateUtils.getOpponent(state, player);

      const conditionCount = opponent.active.specialConditions.length;
      effect.damage += 60 * conditionCount;
    }
    // Gastro Acid
    if (WAS_ATTACK_USED(effect, 1, this)) {
      return DEFENDING_POKEMON_HAS_NO_ABILITIES_UNTIL_END_OF_YOUR_NEXT_TURN(store, state, effect, this);
    }

    return state;
  }
}
