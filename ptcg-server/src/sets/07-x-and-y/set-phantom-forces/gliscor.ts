import { CardType, PokemonCard, Stage, State, StoreLike } from "../../../game";
import { Effect } from "../../../game/store/effects/effect";
import { WAS_ATTACK_USED, AFTER_ATTACK, COIN_FLIP_PROMPT, ADD_POISON_TO_PLAYER_ACTIVE } from "../../../game/store/prefabs/prefabs";
import { YOUR_OPPONENT_CANNOT_ATTACH_ENERGY_FROM_HAND_TO_DEFENDING_POKEMON } from "../../../game/store/prefabs/effect-of-attack-prefabs";

export class Gliscor extends PokemonCard {
  public stage: Stage = Stage.STAGE_1;
  public evolvesFrom: string = 'Gligar';
  public cardType: CardType[] = [F];
  public hp: number = 90;
  public weakness = [{ type: W }];
  public retreat = [C];

  public attacks = [{
    name: 'Submission Hold',
    cost: [F],
    damage: 20,
    text: 'Your opponent can\'t attach Energy from his or her hand to the Defending Pokémon during his or her next turn.'
  },
  {
    name: 'Poison Jab',
    cost: [F, C, C],
    damage: 60,
    text: 'Flip a coin. If heads, your opponent\'s Active Pokémon is now Poisoned.'
  }];

  public set: string = 'PHF';
  public setNumber: string = '47';
  public cardImage: string = 'assets/cardback.png';
  public name: string = 'Gliscor';
  public fullName: string = 'Gliscor PHF';

  public reduceEffect(store: StoreLike, state: State, effect: Effect): State {
    // Submission Hold
    if (WAS_ATTACK_USED(effect, 0, this)) {
      return YOUR_OPPONENT_CANNOT_ATTACH_ENERGY_FROM_HAND_TO_DEFENDING_POKEMON(store, state, effect, this);
    }
    // Poison Jab
    if (AFTER_ATTACK(effect, 1, this)) {
      COIN_FLIP_PROMPT(store, state, effect.player, result => {
        if (result) {
          ADD_POISON_TO_PLAYER_ACTIVE(store, state, effect.opponent, this);
        }
      });
    }

    return state;
  }
}
