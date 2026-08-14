import { PokemonCard, Stage, CardType, StoreLike, State, EnergyType, SlotType } from "../../../game";
import { Effect } from "../../../game/store/effects/effect";
import { ATTACH_UP_TO_X_ENERGY_FROM_DECK_TO_Y_OF_YOUR_POKEMON, FLIP_UNTIL_TAILS_AND_COUNT_HEADS, WAS_ATTACK_USED } from "../../../game/store/prefabs/prefabs";

/** #42 — Charge-Up Dash + Pika Bolt */
export class Pikachu42 extends PokemonCard {
  public stage: Stage = Stage.BASIC;
  public hp: number = 60;
  public cardType: CardType = L;
  public weakness = [{ type: F }];
  public retreat = [C];

  public attacks = [{
    name: 'Charge-Up Dash',
    cost: [C],
    damage: 0,
    text: 'Flip a coin until you get tails. Search your deck for an amount of Basic [L] Energy up to the number of heads and attach it to this Pokémon. Then, shuffle your deck.'
  }, {
    name: 'Pika Bolt',
    cost: [L, L, C],
    damage: 50,
    text: ''
  }];

  public regulationMark: string = 'J';

  public set: string = '30C';
  public cardImage: string = 'assets/cardback.png';
  public setNumber: string = '42';
  public name: string = 'Pikachu';
  public fullName: string = 'Pikachu 30C 42';

  public reduceEffect(store: StoreLike, state: State, effect: Effect): State {
    // Charge-Up Dash
    if (WAS_ATTACK_USED(effect, 0, this)) {
      const player = effect.player;
      return FLIP_UNTIL_TAILS_AND_COUNT_HEADS(store, state, player, heads => {
        if (heads <= 0) {
          return;
        }
        ATTACH_UP_TO_X_ENERGY_FROM_DECK_TO_Y_OF_YOUR_POKEMON(
          store, state, player, heads, 1,
          {
            destinationSlots: [SlotType.ACTIVE],
            energyFilter: { energyType: EnergyType.BASIC, name: 'Lightning Energy' },
            sameTarget: true,
            min: 0,
            allowCancel: false,
          },
        );
      });
    }
    return state;
  }
}
