import { PokemonCard, Stage, CardType, StoreLike, State } from "../../../game";
import { Effect } from "../../../game/store/effects/effect";
import { YOUR_OPPPONENTS_ACTIVE_POKEMON_IS_NOW_CONFUSED, YOUR_OPPPONENTS_ACTIVE_POKEMON_IS_NOW_POISIONED } from "../../../game/store/prefabs/attack-effects";
import { WAS_ATTACK_USED, OPPONENT_COIN_FLIP_CANCEL_TRAINER_CARDS } from "../../../game/store/prefabs/prefabs";

export class Venomoth extends PokemonCard {
  public stage: Stage = Stage.STAGE_1;
  public evolvesFrom: string = 'Venonat';
  public cardType: CardType = G;
  public hp: number = 90;
  public weakness = [{ type: R }];
  public retreat = [C];

  public attacks = [{
    name: 'Dizzying Wind',
    cost: [G],
    damage: 0,
    text: 'Whenever your opponent plays a Trainer card from his or her hand during his or her next turn, your opponent flips a coin. If tails, that card has no effect. (Your opponent still discards that card.)'
  }, {
    name: 'Noxious Scales',
    cost: [G, C, C],
    damage: 50,
    text: 'Your opponent\'s Active Pokémon is now Confused and Poisoned.'
  }];

  public set: string = 'PHF';
  public setNumber: string = '2';
  public cardImage: string = 'assets/cardback.png';
  public name: string = 'Venomoth';
  public fullName: string = 'Venomoth PHF';

  public reduceEffect(store: StoreLike, state: State, effect: Effect): State {
    // Dizzying Wind
    if (WAS_ATTACK_USED(effect, 0, this)) {
      return OPPONENT_COIN_FLIP_CANCEL_TRAINER_CARDS(store, state, effect, this);
    }

    // Noxious Scales
    if (WAS_ATTACK_USED(effect, 1, this)) {
      YOUR_OPPPONENTS_ACTIVE_POKEMON_IS_NOW_CONFUSED(store, state, effect);
      YOUR_OPPPONENTS_ACTIVE_POKEMON_IS_NOW_POISIONED(store, state, effect);
    }

    return state;
  }
}
