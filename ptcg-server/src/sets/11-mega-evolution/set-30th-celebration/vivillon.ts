import { PokemonCard, Stage, CardType, PowerType, StoreLike, State, GameError, GameMessage } from "../../../game";
import { Effect } from "../../../game/store/effects/effect";
import { YOUR_OPPPONENTS_ACTIVE_POKEMON_IS_NOW_POISIONED } from "../../../game/store/prefabs/attack-effects";
import { WAS_POWER_USED, IS_ABILITY_BLOCKED, USE_ABILITY_ONCE_PER_TURN, ABILITY_USED, COIN_FLIP_PROMPT, SEARCH_YOUR_DECK_FOR_POKEMON_AND_PUT_INTO_HAND, REMOVE_MARKER_AT_END_OF_TURN, WAS_ATTACK_USED } from "../../../game/store/prefabs/prefabs";

export class Vivillon extends PokemonCard {
  public stage: Stage = Stage.STAGE_2;
  public evolvesFrom: string = 'Spewpa';
  public hp: number = 120;
  public cardType: CardType = G;
  public weakness = [{ type: R }];
  public retreat = [C];

  public powers = [{
    name: 'Guiding Dance',
    powerType: PowerType.ABILITY,
    useWhenInPlay: true,
    text: 'Once during your turn, you may use this Ability. Flip a coin. If heads, search your deck for a Pokémon, reveal it, and put it into your hand. Then, shuffle your deck.'
  }];

  public attacks = [{
    name: 'Poison Powder',
    cost: [G, C],
    damage: 60,
    text: 'Your opponent\'s Active Pokémon is now Poisoned.'
  }];

  public regulationMark: string = 'J';

  public set: string = '30C';
  public cardImage: string = 'assets/cardback.png';
  public setNumber: string = '8';
  public name: string = 'Vivillon';
  public fullName: string = 'Vivillon 30C';

  public readonly GUIDING_DANCE_MARKER = 'GUIDING_DANCE_MARKER';

  public reduceEffect(store: StoreLike, state: State, effect: Effect): State {
    // Guiding Dance
    if (WAS_POWER_USED(effect, 0, this)) {
      const player = effect.player;

      if (IS_ABILITY_BLOCKED(store, state, player, this)) {
        throw new GameError(GameMessage.BLOCKED_BY_EFFECT);
      }

      USE_ABILITY_ONCE_PER_TURN(player, this.GUIDING_DANCE_MARKER, this);
      ABILITY_USED(player, this);

      COIN_FLIP_PROMPT(store, state, player, result => {
        if (result) {
          SEARCH_YOUR_DECK_FOR_POKEMON_AND_PUT_INTO_HAND(store, state, player, {}, { min: 0, max: 1 });
        }
      });
    }

    REMOVE_MARKER_AT_END_OF_TURN(effect, this.GUIDING_DANCE_MARKER, this);

    // Poison Powder
    if (WAS_ATTACK_USED(effect, 0, this)) {
      YOUR_OPPPONENTS_ACTIVE_POKEMON_IS_NOW_POISIONED(store, state, effect);
    }

    return state;
  }
}
