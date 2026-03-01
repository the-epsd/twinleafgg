import { ADD_SLEEP_TO_PLAYER_ACTIVE, AFTER_ATTACK, WAS_ATTACK_USED } from '../../game/store/prefabs/prefabs';
import { ConfirmPrompt } from '../../game/store/prompts/confirm-prompt';
import { GameMessage } from '../../game/game-message';
import { THIS_POKEMON_DOES_DAMAGE_TO_ITSELF } from '../../game/store/prefabs/prefabs';
import { AttackEffect } from '../../game/store/effects/game-effects';

import { CardType, Stage } from '../../game/store/card/card-types';
import { PokemonCard } from '../../game/store/card/pokemon-card';
import { Effect } from '../../game/store/effects/effect';
import { State, StoreLike } from '../../game';
export class Beartic extends PokemonCard {
  public stage: Stage = Stage.STAGE_1;
  public evolvesFrom: string = 'Cubchoo';
  public cardType: CardType = W;
  public hp: number = 130;
  public weakness = [{ type: M }];
  public retreat = [C, C];

  public attacks = [
    {
      name: 'Icy Wind',
      cost: [W],
      damage: 30,
      text: 'The Defending Pokémon is now Asleep.'
    },
    {
      name: 'Superpower',
      cost: [W, W, C],
      damage: 60,
      damageCalculation: '+',
      text: 'You may do 20 more damage. If you do, this Pokémon does 20 damage to itself.'
    }
  ];

  public set: string = 'EPO';
  public cardImage: string = 'assets/cardback.png';
  public setNumber: string = '31';
  public name: string = 'Beartic';
  public fullName: string = 'Beartic EPO';

  public reduceEffect(store: StoreLike, state: State, effect: Effect): State {
    if (AFTER_ATTACK(effect, 0, this)) {
      ADD_SLEEP_TO_PLAYER_ACTIVE(store, state, effect.opponent, this);
    }

    if (WAS_ATTACK_USED(effect, 1, this)) {
      return store.prompt(state, new ConfirmPrompt(
        effect.player.id,
        GameMessage.WANT_TO_USE_ABILITY
      ), result => {
        if (result) {
          (effect as AttackEffect).damage += 20;
          THIS_POKEMON_DOES_DAMAGE_TO_ITSELF(store, state, effect, 20);
        }
      });
    }

    return state;
  }
}
