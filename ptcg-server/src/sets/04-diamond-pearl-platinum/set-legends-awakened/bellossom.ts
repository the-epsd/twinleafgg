import { PokemonCard } from '../../../game/store/card/pokemon-card';
import { CardType, Stage } from '../../../game/store/card/card-types';
import { PlayerType, PokemonCardList, State, StoreLike } from '../../../game';
import { Effect } from '../../../game/store/effects/effect';
import { COIN_FLIP_PROMPT, WAS_ATTACK_USED } from '../../../game/store/prefabs/prefabs';
import { YOUR_OPPPONENTS_ACTIVE_POKEMON_IS_NOW_BURNED } from '../../../game/store/prefabs/attack-effects';
import { HealEffect } from '../../../game/store/effects/game-effects';

export class Bellossom extends PokemonCard {
  public stage: Stage = Stage.STAGE_2;
  public evolvesFrom: string = 'Gloom';
  public hp: number = 100;
  public cardType: CardType[] = [G];
  public weakness = [{ type: R, value: +30 }];
  public resistance = [{ type: W, value: -20 }];
  public retreat = [C];

  public attacks = [{
    name: 'Parallel Gain',
    cost: [G],
    damage: 30,
    text: 'Remove 1 damage counter from each of your Pokémon.'
  },
  {
    name: 'Blend Pollen',
    cost: [G, C],
    damage: 40,
    damageCalculation: '+',
    text: 'Does 40 damage plus 20 more damage for each Vileplume and each Bellossom you have in play. Flip a coin. If heads, the Defending Pokémon is now Burned.'
  }];

  public set: string = 'LA';
  public cardImage: string = 'assets/cardback.png';
  public setNumber: string = '20';
  public name: string = 'Bellossom';
  public fullName: string = 'Bellossom LA';

  public reduceEffect(store: StoreLike, state: State, effect: Effect): State {
    // Parallel Gain
    if (WAS_ATTACK_USED(effect, 0, this)) {
      const player = effect.player;
      player.forEachPokemon(PlayerType.BOTTOM_PLAYER, (cardList: PokemonCardList) => {
        const healEffect = new HealEffect(player, cardList, 10);
        store.reduceEffect(state, healEffect);
      });
    }

    // Blend Pollen
    if (WAS_ATTACK_USED(effect, 1, this)) {
      const player = effect.player;
      let count = 0;
      player.forEachPokemon(PlayerType.BOTTOM_PLAYER, (_list, card) => {
        if (card.name === 'Vileplume' || card.name === 'Bellossom') {
          count++;
        }
      });
      effect.damage += 20 * count;
      COIN_FLIP_PROMPT(store, state, player, result => {
        if (result) {
          YOUR_OPPPONENTS_ACTIVE_POKEMON_IS_NOW_BURNED(store, state, effect);
        }
      });
    }

    return state;
  }
}
