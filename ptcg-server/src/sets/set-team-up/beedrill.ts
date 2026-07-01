import { CardType, GameError, GameMessage, PokemonCard, PokemonCardList, Stage, State, StateUtils, StoreLike } from '../../game';
import { DealDamageEffect } from '../../game/store/effects/attack-effects';
import { KNOCK_OUT_OPPONENTS_ACTIVE_POKEMON, KNOCK_OUT_PLAYERS_ACTIVE_POKEMON } from '../../game/store/prefabs/attack-effects';
import { Effect } from '../../game/store/effects/effect';
import { WAS_ATTACK_USED } from '../../game/store/prefabs/prefabs';

export class Beedrill extends PokemonCard {
  public stage: Stage = Stage.STAGE_2;
  public evolvesFrom = 'Kakuna';
  public cardType: CardType = G;
  public hp: number = 130;
  public weakness = [{ type: R }];
  public retreat = [C];

  public attacks = [{
    name: 'Destiny Stinger',
    cost: [G],
    damage: 0,
    text: 'You can use this attack only if this Pokémon has any damage counters on it. Both Active Pokémon are Knocked Out.'
  },
  {
    name: 'Reckless Charge',
    cost: [C, C],
    damage: 90,
    text: 'This Pokémon does 10 damage to itself.'
  }];

  public set = 'TEU';
  public setNumber = '5';
  public cardImage = 'assets/cardback.png';
  public name = 'Beedrill';
  public fullName = 'Beedrill TEU';

  public reduceEffect(store: StoreLike, state: State, effect: Effect): State {
    // Destiny Stinger
    if (WAS_ATTACK_USED(effect, 0, this)) {
      const cardList = StateUtils.findCardList(state, this) as PokemonCardList;

      // If no damage counters on ourself, can't use the attack.
      if (cardList.damage <= 0) {
        throw new GameError(GameMessage.BLOCKED_BY_EFFECT);
      }
      KNOCK_OUT_PLAYERS_ACTIVE_POKEMON(store, state, effect);
      KNOCK_OUT_OPPONENTS_ACTIVE_POKEMON(store, state, effect);
    }

    // Reckless Charge
    if (WAS_ATTACK_USED(effect, 1, this)) {
      const player = effect.player;

      const dealDamage = new DealDamageEffect(effect, 10);
      dealDamage.target = player.active;
      return store.reduceEffect(state, dealDamage);
    }

    return state;
  }
}