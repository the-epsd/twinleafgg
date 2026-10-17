import { PokemonCard } from '../../../game/store/card/pokemon-card';
import { CardType, SpecialCondition, Stage } from '../../../game/store/card/card-types';
import { PokemonCardList, PowerType, State, StateUtils, StoreLike } from '../../../game';
import { Effect } from '../../../game/store/effects/effect';
import { BetweenTurnsEffect } from '../../../game/store/effects/game-phase-effects';
import { HealEffect } from '../../../game/store/effects/game-effects';
import { ADD_SLEEP_TO_PLAYER_ACTIVE, IS_POKEBODY_BLOCKED, THIS_POKEMON_HAS_ANY_DAMAGE_COUNTERS_ON_IT, WAS_ATTACK_USED } from '../../../game/store/prefabs/prefabs';

export class Wailord extends PokemonCard {
  public stage: Stage = Stage.STAGE_1;
  public evolvesFrom: string = 'Wailmer';
  public hp: number = 200;
  public cardType: CardType[] = [W];
  public weakness = [{ type: L }];
  public retreat = [C, C, C, C];

  public powers = [{
    name: 'Sleeping Pulse',
    powerType: PowerType.POKEBODY,
    text: 'As long as Wailord remains Asleep between turns, remove 1 damage counter from Wailord.'
  }];

  public attacks = [{
    name: 'Sink Deep',
    cost: [W, W, W, C],
    damage: 60,
    text: 'If Wailord has any damage counters on it, Wailord is now Asleep.'
  }];

  public set: string = 'GE';
  public cardImage: string = 'assets/cardback.png';
  public setNumber: string = '30';
  public name: string = 'Wailord';
  public fullName: string = 'Wailord GE';

  public reduceEffect(store: StoreLike, state: State, effect: Effect): State {
    // Sleeping Pulse
    if (effect instanceof BetweenTurnsEffect) {
      const cardList = StateUtils.findCardList(state, this) as PokemonCardList;
      const owner = StateUtils.findOwner(state, cardList);
      if (!StateUtils.isPokemonInPlay(owner, this)) {
        return state;
      }
      if (IS_POKEBODY_BLOCKED(store, state, owner, this)) {
        return state;
      }
      if (cardList.getPokemonCard() !== this) {
        return state;
      }
      if (cardList.specialConditions.includes(SpecialCondition.ASLEEP) && cardList.damage > 0) {
        const healEffect = new HealEffect(owner, cardList, 10);
        store.reduceEffect(state, healEffect);
      }
    }

    // Sink Deep
    if (WAS_ATTACK_USED(effect, 0, this)) {
      if (THIS_POKEMON_HAS_ANY_DAMAGE_COUNTERS_ON_IT(effect, this)) {
        ADD_SLEEP_TO_PLAYER_ACTIVE(store, state, effect.player, this);
      }
    }

    return state;
  }
}
