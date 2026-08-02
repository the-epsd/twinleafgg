import { PokemonCard } from '../../../game/store/card/pokemon-card';
import { CardType, Stage } from '../../../game/store/card/card-types';
import { ConfirmPrompt, GameMessage, State, StoreLike } from '../../../game';
import { Effect } from '../../../game/store/effects/effect';
import { AFTER_ATTACK, SWITCH_ACTIVE_WITH_BENCHED } from '../../../game/store/prefabs/prefabs';

export class Vikavolt extends PokemonCard {
  public stage: Stage = Stage.STAGE_2;
  public evolvesFrom: string = 'Charjabug';
  public hp: number = 160;
  public cardType: CardType = L;
  public weakness = [{ type: F }];
  public retreat = [C];

  public attacks = [{
    name: 'Volt Switch',
    cost: [L],
    damage: 90,
    text: 'Switch this Pokémon with 1 of your Benched Lightning Pokémon.'
  },
  {
    name: 'Sparking Strike',
    cost: [L, L, C, C],
    damage: 240,
    text: ''
  }];

  public regulationMark = 'H';
  public set: string = 'ASC';
  public cardImage: string = 'assets/cardback.png';
  public setNumber: string = '66';
  public name: string = 'Vikavolt';
  public fullName: string = 'Vikavolt ASC';

  public reduceEffect(store: StoreLike, state: State, effect: Effect): State {
    // Volt Switch
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
