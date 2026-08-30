import { PokemonCard, Stage, CardType, StoreLike, State } from "../../../game";
import { Effect } from "../../../game/store/effects/effect";
import { WAS_ATTACK_USED, AFTER_ATTACK, COIN_FLIP_PROMPT, ADD_CONFUSION_TO_PLAYER_ACTIVE } from "../../../game/store/prefabs/prefabs";
import { DEFENDING_POKEMON_CANNOT_EVOLVE_NEXT_TURN } from "../../../game/store/prefabs/effect-of-attack-prefabs";

export class Spiritomb extends PokemonCard {
  public stage: Stage = Stage.BASIC;
  public cardType: CardType[] = [D];
  public hp: number = 70;
  public retreat = [C];

  public attacks = [{
    name: 'B Cancel',
    cost: [C],
    damage: 10,
    text: 'Your opponent can\'t play any Pokémon from his or her hand to evolve the Defending Pokémon during his or her next turn.'
  },
  {
    name: 'Confuse Ray',
    cost: [D, C],
    damage: 30,
    text: 'Flip a coin. If heads, your opponent\'s Active Pokémon is now Confused.'
  }];

  public set: string = 'PHF';
  public setNumber: string = '55';
  public cardImage: string = 'assets/cardback.png';
  public name: string = 'Spiritomb';
  public fullName: string = 'Spiritomb PHF';

  public reduceEffect(store: StoreLike, state: State, effect: Effect): State {
    // B Cancel
    if (WAS_ATTACK_USED(effect, 0, this)) {
      return DEFENDING_POKEMON_CANNOT_EVOLVE_NEXT_TURN(store, state, effect, this);
    }
    // Confuse Ray
    if (AFTER_ATTACK(effect, 1, this)) {
      COIN_FLIP_PROMPT(store, state, effect.player, result => {
        if (result) {
          ADD_CONFUSION_TO_PLAYER_ACTIVE(store, state, effect.opponent, this);
        }
      });
    }

    return state;
  }
}
