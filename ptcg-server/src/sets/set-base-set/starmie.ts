import { PokemonCard } from '../../game/store/card/pokemon-card';
import { Stage, CardType } from '../../game/store/card/card-types';
import { Attack } from '../../game/store/card/pokemon-types';
import { HealEffect } from '../../game/store/effects/game-effects';
import { Effect } from '../../game/store/effects/effect';
import { State } from '../../game/store/state/state';
import { StoreLike } from '../../game/store/store-like';
import { DISCARD_X_ENERGY_FROM_THIS_POKEMON } from '../../game/store/prefabs/costs';
import { StateUtils } from '../../game';
import { ADD_PARALYZED_TO_PLAYER_ACTIVE, AFTER_ATTACK, COIN_FLIP_PROMPT, WAS_ATTACK_USED } from '../../game/store/prefabs/prefabs';

export class Starmie extends PokemonCard {

  public name = 'Starmie';

  public cardImage: string = 'assets/cardback.png';

  public set = 'BS';

  public setNumber = '64';

  public cardType = CardType.WATER;

  public fullName = 'Starmie';

  public stage = Stage.STAGE_1;

  public evolvesFrom = 'Staryu';

  public hp = 60;

  public weakness = [{ type: CardType.LIGHTNING }];

  public retreat = [CardType.COLORLESS];

  public attacks: Attack[] = [
    {
      name: 'Recover',
      cost: [CardType.WATER, CardType.WATER],
      text: 'Discard 1 [W] Energy card attached to Starmie in order to use this attack. Remove all damage counters from Starmie.',
      damage: 0
    },
    {
      name: 'Star Freeze',
      cost: [CardType.WATER, CardType.COLORLESS, CardType.COLORLESS],
      damage: 20,
      text: 'Flip a coin. If heads, the Defending Pokémon is now Paralyzed.'
    }
  ];

  public reduceEffect(store: StoreLike, state: State, effect: Effect): State {
    if (WAS_ATTACK_USED(effect, 0, this)) {
      DISCARD_X_ENERGY_FROM_THIS_POKEMON(store, state, effect, 1, W);
      const player = effect.player;
      const heal = new HealEffect(player, player.active, player.active.damage);
      heal.target = effect.player.active;
      store.reduceEffect(state, heal);
    }

    if (AFTER_ATTACK(effect, 1, this)) {
      COIN_FLIP_PROMPT(store, state, effect.player, (result) => {
        if (result) {
          ADD_PARALYZED_TO_PLAYER_ACTIVE(store, state, StateUtils.getOpponent(state, effect.player), this);
        }
      });
    }

    return state;
  }

}
