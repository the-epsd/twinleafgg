import { ConfirmPrompt, GameMessage, State, StoreLike } from '../../game';
import { CardType, Stage } from '../../game/store/card/card-types';
import { PokemonCard } from '../../game/store/card/pokemon-card';
import { Effect } from '../../game/store/effects/effect';
import { SWITCH_ACTIVE_WITH_BENCHED, AFTER_ATTACK } from '../../game/store/prefabs/prefabs';

export class Cascoon extends PokemonCard {
  public stage: Stage = Stage.STAGE_1;
  public evolvesFrom: string = 'Wurmple';
  public cardType: CardType = G;
  public hp: number = 90;
  public weakness = [{ type: R }];
  public resistance = [];
  public retreat = [C, C, C];

  public attacks = [
    {
      name: 'Trading Places',
      cost: [G],
      damage: 0,
      text: 'You may switch this Pokémon with 1 of your Benched Pokémon.'
    }
  ];

  public regulationMark: string = 'I';
  public set: string = 'ASC';
  public cardImage: string = 'assets/cardback.png';
  public setNumber: string = '14';
  public name: string = 'Cascoon';
  public fullName: string = 'Cascoon M2a';

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
