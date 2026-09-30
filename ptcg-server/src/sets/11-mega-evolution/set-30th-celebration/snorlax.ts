import { PokemonCard, Stage, CardType, PowerType, StoreLike, State, PlayerType, SpecialCondition } from "../../../game";
import { Effect } from "../../../game/store/effects/effect";
import { HealEffect } from "../../../game/store/effects/game-effects";
import { BetweenTurnsEffect } from "../../../game/store/effects/game-phase-effects";
import { IS_ABILITY_BLOCKED, WAS_ATTACK_USED, ADD_SLEEP_TO_PLAYER_ACTIVE } from "../../../game/store/prefabs/prefabs";

export class Snorlax extends PokemonCard {
  public stage: Stage = Stage.BASIC;
  public hp: number = 160;
  public cardType: CardType[] = [C];
  public weakness = [{ type: F }];
  public retreat = [C, C, C, C];

  public powers = [{
    name: 'Good Sleep',
    powerType: PowerType.ABILITY,
    text: 'If this Pokémon remains Asleep during Pokémon Checkup, heal all damage from this Pokémon.'
  }];

  public attacks = [{
    name: 'Collapse',
    cost: [C, C, C],
    damage: 130,
    text: 'This Pokémon is now Asleep.'
  }];

  public regulationMark: string = 'J';
  public set: string = '30C';
  public cardImage: string = 'assets/cardback.png';
  public setNumber: string = '119';
  public name: string = 'Snorlax';
  public fullName: string = 'Snorlax 30C';

  public reduceEffect(store: StoreLike, state: State, effect: Effect): State {
    // Good Sleep
    if (effect instanceof BetweenTurnsEffect) {
      const player = effect.player;

      player.forEachPokemon(PlayerType.BOTTOM_PLAYER, (cardList, card) => {
        if (card !== this) {
          return;
        }
        if (!cardList.specialConditions.includes(SpecialCondition.ASLEEP)) {
          return;
        }
        if (IS_ABILITY_BLOCKED(store, state, player, this)) {
          return;
        }
        if (cardList.damage > 0) {
          const healEffect = new HealEffect(player, cardList, cardList.damage);
          store.reduceEffect(state, healEffect);
        }
      });
    }

    // Collapse
    if (WAS_ATTACK_USED(effect, 0, this)) {
      ADD_SLEEP_TO_PLAYER_ACTIVE(store, state, effect.player, this);
    }

    return state;
  }
}
