import { PokemonCard } from '../../game/store/card/pokemon-card';
import { CardType, Stage } from '../../game/store/card/card-types';
import { PowerType, StoreLike, State, GameError, GameMessage, StateUtils } from '../../game';
import { Effect } from '../../game/store/effects/effect';
import { RetreatEffect } from '../../game/store/effects/game-effects';
import { CAN_APPLY_ABILITY_TO_TARGET } from '../../game/store/prefabs/effect-of-ability-prefabs';
import { ADD_SLEEP_TO_PLAYER_ACTIVE, COIN_FLIP_PROMPT, IS_POKEMON_POWER_BLOCKED, WAS_ATTACK_USED } from '../../game/store/prefabs/prefabs';
import { YOUR_OPPPONENTS_ACTIVE_POKEMON_IS_NOW_ASLEEP } from '../../game/store/prefabs/attack-effects';

export class Snorlax extends PokemonCard {
  public stage: Stage = Stage.BASIC;
  public hp: number = 90;
  public cardType: CardType[] = [C];
  public weakness = [{ type: F }];
  public resistance = [{ type: P, value: -30 }];
  public retreat = [C, C, C, C];

  public powers = [{
    name: 'Guard',
    powerType: PowerType.POKEMON_POWER,
    text: 'As long as Snorlax is your Active Pokémon, the Defending Pokémon can\'t retreat. This power stops working when Snorlax is affected by a Special Condition.',
  }];

  public attacks = [{
    name: 'Roll Over',
    cost: [C, C, C, C],
    damage: 30,
    text: 'Snorlax is now Asleep. Flip a coin. If heads, the Defending Pokémon is now Asleep.',
  }];

  public set: string = 'PR';
  public cardImage: string = 'assets/cardback.png';
  public setNumber: string = '49';
  public name: string = 'Snorlax';
  public fullName: string = 'Snorlax PR';

  public reduceEffect(store: StoreLike, state: State, effect: Effect): State {
    // Guard
    if (effect instanceof RetreatEffect) {
      const retreatingPlayer = effect.player;
      const abilityOwner = StateUtils.getOpponent(state, retreatingPlayer);

      if (abilityOwner.active.getPokemonCard() !== this) {
        return state;
      }

      if (IS_POKEMON_POWER_BLOCKED(store, state, abilityOwner, this)) {
        return state;
      }

      if (abilityOwner.active.specialConditions.length > 0) {
        return state;
      }

      if (!CAN_APPLY_ABILITY_TO_TARGET(
        store,
        state,
        abilityOwner,
        this.powers[0],
        this,
        retreatingPlayer.active,
      )) {
        return state;
      }

      throw new GameError(GameMessage.BLOCKED_BY_EFFECT);
    }

    // Roll Over
    if (WAS_ATTACK_USED(effect, 0, this)) {
      ADD_SLEEP_TO_PLAYER_ACTIVE(store, state, effect.player, this);
      COIN_FLIP_PROMPT(store, state, effect.player, result => {
        if (result) {
          YOUR_OPPPONENTS_ACTIVE_POKEMON_IS_NOW_ASLEEP(store, state, effect);
        }
      });
    }

    return state;
  }
}
