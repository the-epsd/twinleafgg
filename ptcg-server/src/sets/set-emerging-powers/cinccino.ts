import { ADD_SLEEP_TO_PLAYER_ACTIVE, AFTER_ATTACK, WAS_ATTACK_USED } from '../../game/store/prefabs/prefabs';
import { ChoosePokemonPrompt } from '../../game/store/prompts/choose-pokemon-prompt';

import { CardType, Stage } from '../../game/store/card/card-types';
import { StateUtils } from '../../game/store/state-utils';
import { GameMessage } from '../../game/game-message';
import { PokemonCard } from '../../game/store/card/pokemon-card';
import { Effect } from '../../game/store/effects/effect';
import { PlayerType, SlotType, State, StoreLike } from '../../game';
export class Cinccino extends PokemonCard {
  public stage: Stage = Stage.STAGE_1;
  public evolvesFrom: string = 'Minccino';
  public cardType: CardType = C;
  public hp: number = 90;
  public weakness = [{ type: F }];
  public retreat = [C];

  public attacks = [
    {
      name: 'Captivate',
      cost: [C],
      damage: 0,
      text: 'Switch the Defending Pokémon with 1 of your opponent\'s Benched Pokémon.'
    },
    {
      name: 'Fluffy Tail',
      cost: [C, C],
      damage: 30,
      text: 'The Defending Pokémon is now Asleep.'
    }
  ];

  public set: string = 'EPO';
  public cardImage: string = 'assets/cardback.png';
  public setNumber: string = '85';
  public name: string = 'Cinccino';
  public fullName: string = 'Cinccino EPO';

  public reduceEffect(store: StoreLike, state: State, effect: Effect): State {
    if (WAS_ATTACK_USED(effect, 0, this)) {
      const player = effect.player;
      const opponent = StateUtils.getOpponent(state, player);

      const hasBench = opponent.bench.some(b => b.cards.length > 0);
      if (!hasBench) {
        return state;
      }

      return store.prompt(state, new ChoosePokemonPrompt(
        player.id,
        GameMessage.CHOOSE_POKEMON_TO_SWITCH,
        PlayerType.TOP_PLAYER,
        [SlotType.BENCH],
        { allowCancel: false }
      ), targets => {
        if (targets && targets.length > 0) {
          opponent.switchPokemon(targets[0]);
        }
      });
    }

    if (AFTER_ATTACK(effect, 1, this)) {
      ADD_SLEEP_TO_PLAYER_ACTIVE(store, state, effect.opponent, this);
    }

    return state;
  }
}
