import { PokemonCard } from '../../game/store/card/pokemon-card';
import { Stage, CardType } from '../../game/store/card/card-types';
import { StoreLike, State, PlayerType } from '../../game';
import { Effect } from '../../game/store/effects/effect';
import { WAS_ATTACK_USED, COIN_FLIP_PROMPT } from '../../game/store/prefabs/prefabs';
import { YOUR_OPPPONENTS_ACTIVE_POKEMON_IS_NOW_ASLEEP } from '../../game/store/prefabs/attack-effects';
import { AttackEffect } from '../../game/store/effects/game-effects';

export class Wigglytuff extends PokemonCard {
  public stage: Stage = Stage.STAGE_1;
  public evolvesFrom: string = 'Jigglypuff';
  public cardType: CardType = C;
  public hp: number = 90;
  public weakness = [{ type: F }];
  public retreat = [C, C];

  public attacks = [
    {
      name: 'Round',
      cost: [C, C],
      damage: 20,
      damageCalculation: 'x',
      text: 'Does 20 damage times the number of your Pokémon that have the Round attack.'
    },
    {
      name: 'Hypnoblast',
      cost: [C, C, C],
      damage: 60,
      text: 'Flip a coin. If heads, the Defending Pokémon is now Asleep.'
    }
  ];

  public set: string = 'NXD';
  public setNumber: string = '79';
  public cardImage: string = 'assets/cardback.png';
  public name: string = 'Wigglytuff';
  public fullName: string = 'Wigglytuff NXD';

  public reduceEffect(store: StoreLike, state: State, effect: Effect): State {
    // Round
    if (WAS_ATTACK_USED(effect, 0, this)) {
      const player = effect.player;
      let roundCount = 0;

      player.forEachPokemon(PlayerType.BOTTOM_PLAYER, (cardList, card) => {
        const pokemon = cardList.getPokemonCard();
        if (pokemon && pokemon.attacks.some(attack => attack.name === 'Round')) {
          roundCount++;
        }
      });

      (effect as AttackEffect).damage = 20 * roundCount;
    }

    // Hypnoblast
    if (WAS_ATTACK_USED(effect, 1, this)) {
      const player = effect.player;
      return COIN_FLIP_PROMPT(store, state, player, result => {
        if (result) {
          YOUR_OPPPONENTS_ACTIVE_POKEMON_IS_NOW_ASLEEP(store, state, effect);
        }
      });
    }

    return state;
  }
}
