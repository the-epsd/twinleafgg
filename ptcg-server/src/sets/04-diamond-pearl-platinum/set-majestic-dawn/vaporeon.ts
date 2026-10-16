import { PlayerType, PokemonCard, State, StoreLike } from '../../../game';
import { CardType, Stage } from '../../../game/store/card/card-types';
import { Effect } from '../../../game/store/effects/effect';
import { HealEffect } from '../../../game/store/effects/game-effects';
import { DISCARD_AN_ENERGY_FROM_OPPONENTS_ACTIVE_POKEMON } from '../../../game/store/prefabs/attack-effects';
import { FLIP_UNTIL_TAILS_AND_COUNT_HEADS, WAS_ATTACK_USED } from '../../../game/store/prefabs/prefabs';

export class Vaporeon extends PokemonCard {
  public stage: Stage = Stage.STAGE_1;
  public evolvesFrom: string = 'Eevee';
  public hp: number = 90;
  public cardType: CardType[] = [W];
  public weakness = [{ type: L, value: +20 }];
  public retreat = [C];

  public attacks = [{
    name: 'Cleanse Away',
    cost: [W],
    damage: 30,
    text: 'Remove 2 damage counters from each of your Benched Pokémon.'
  },
  {
    name: 'Hyper Whirlpool',
    cost: [W, C, C],
    damage: 60,
    text: 'Flip a coin until you get tails. For each heads, discard an Energy card attached to the Defending Pokémon.'
  }];

  public set: string = 'MD';
  public cardImage: string = 'assets/cardback.png';
  public setNumber: string = '34';
  public name: string = 'Vaporeon';
  public fullName: string = 'Vaporeon MD';

  public reduceEffect(store: StoreLike, state: State, effect: Effect): State {
    // Cleanse Away
    if (WAS_ATTACK_USED(effect, 0, this)) {
      const player = effect.player;
      player.forEachPokemon(PlayerType.BOTTOM_PLAYER, (cardList) => {
        if (cardList !== player.active) {
          const healEffect = new HealEffect(player, cardList, 20);
          store.reduceEffect(state, healEffect);
        }
      });
    }

    // Hyper Whirlpool
    if (WAS_ATTACK_USED(effect, 1, this)) {
      const player = effect.player;
      FLIP_UNTIL_TAILS_AND_COUNT_HEADS(store, state, player, headsCount => {
      DISCARD_AN_ENERGY_FROM_OPPONENTS_ACTIVE_POKEMON(store, state, effect, undefined, headsCount);
      });
    }

    return state;
  }
}
