import { ConfirmPrompt, GameMessage, State, StoreLike } from '../../game';
import { Stage } from '../../game/store/card/card-types';
import { PokemonCard } from '../../game/store/card/pokemon-card';
import { Effect } from '../../game/store/effects/effect';
import { SWITCH_ACTIVE_WITH_BENCHED, AFTER_ATTACK } from '../../game/store/prefabs/prefabs';

export class Yanmega extends PokemonCard {
  public stage = Stage.STAGE_1;
  public evolvesFrom = 'Yanma';
  public hp = 130;
  public cardType = G;
  public weakness = [{ type: R }];
  public retreat = [];

  public attacks = [
    {
      name: 'U-turn',
      cost: [C, C],
      damage: 50,
      text: 'You may switch this Pokémon with 1 of your Benched Pokémon.'
    },
    {
      name: 'Cutting Wind',
      cost: [C, C, C, C],
      damage: 130,
      text: ''
    }
  ];

  public set = 'VIV';
  public name = 'Yanmega';
  public fullName = 'Yanmega VIV';
  public cardImage: string = 'assets/cardback.png';
  public setNumber: string = '7';

  public reduceEffect(store: StoreLike, state: State, effect: Effect): State {

    if (AFTER_ATTACK(effect, 0, this)) {
      const player = effect.player;
      state = store.prompt(state, new ConfirmPrompt(
        effect.player.id,
        GameMessage.WANT_TO_SWITCH_POKEMON,
      ), wantToUse => {
        if (wantToUse) {
          SWITCH_ACTIVE_WITH_BENCHED(store, state, player);
        }
      });
    }
    return state;
  }
}