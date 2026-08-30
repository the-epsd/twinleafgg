import { PokemonCard, Stage, CardType, StoreLike, State } from "../../../game";
import { Effect } from "../../../game/store/effects/effect";
import { WAS_ATTACK_USED, AFTER_ATTACK, ADD_POISON_TO_PLAYER_ACTIVE } from "../../../game/store/prefabs/prefabs";
import { DEFENDING_POKEMON_HAS_NO_ABILITIES_UNTIL_END_OF_YOUR_NEXT_TURN } from "../../../game/store/prefabs/effect-of-attack-prefabs";

export class Arbok extends PokemonCard {
  public stage: Stage = Stage.STAGE_1;
  public evolvesFrom: string = 'Ekans';
  public cardType: CardType[] = [P];
  public hp: number = 90;
  public weakness = [{ type: P }];
  public retreat = [C];

  public attacks = [{
    name: 'Gastro Acid',
    cost: [C],
    damage: 20,
    text: 'The Defending Pokémon has no Abilities until the end of your next turn.'
  },
  {
    name: 'Poison Jab',
    cost: [P, C, C],
    damage: 50,
    text: 'Your opponent\'s Active Pokémon is now Poisoned.'
  }];

  public set: string = 'XY';
  public setNumber: string = '48';
  public cardImage: string = 'assets/cardback.png';
  public name: string = 'Arbok';
  public fullName: string = 'Arbok XY';

  public reduceEffect(store: StoreLike, state: State, effect: Effect): State {
    // Gastro Acid
    if (WAS_ATTACK_USED(effect, 0, this)) {
      return DEFENDING_POKEMON_HAS_NO_ABILITIES_UNTIL_END_OF_YOUR_NEXT_TURN(store, state, effect, this);
    }
    // Poison Jab
    if (AFTER_ATTACK(effect, 1, this)) {
      ADD_POISON_TO_PLAYER_ACTIVE(store, state, effect.opponent, this);
    }

    return state;
  }
}
