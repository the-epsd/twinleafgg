import { PokemonCard, Stage, CardType, PowerType, StoreLike, State, PlayerType } from '../../game';
import { Effect } from '../../game/store/effects/effect';
import { HealEffect } from '../../game/store/effects/game-effects';
import { BetweenTurnsEffect } from '../../game/store/effects/game-phase-effects';
import { IS_POKEBODY_BLOCKED } from '../../game/store/prefabs/prefabs';

export class Lotad extends PokemonCard {
  public stage: Stage = Stage.BASIC;
  public cardType: CardType = W;
  public hp: number = 40;
  public weakness = [{ type: L }];
  public retreat = [C];

  public powers = [{
    name: 'Rain Dish',
    powerType: PowerType.POKEBODY,
    text: 'At any time between turns, remove 1 damage counter from Lotad.'
  }];

  public attacks = [{
    name: 'Ram',
    cost: [C],
    damage: 10,
    text: ''
  }];

  public set: string = 'SS';
  public setNumber: string = '66';
  public cardImage: string = 'assets/cardback.png';
  public name: string = 'Lotad';
  public fullName: string = 'Lotad SS';

  public reduceEffect(store: StoreLike, state: State, effect: Effect): State {
    // Handle Healing Stone Poké-Body
    if (effect instanceof BetweenTurnsEffect) {
      const player = effect.player;

      if (IS_POKEBODY_BLOCKED(store, state, player, this)) {
        return state;
      }

      player.forEachPokemon(PlayerType.ANY, cardList => {
        if (cardList.getPokemonCard() === this) {
          const healEffect = new HealEffect(player, cardList, 10);
          state = store.reduceEffect(state, healEffect);
        }
      });
    }

    return state;
  }
} 