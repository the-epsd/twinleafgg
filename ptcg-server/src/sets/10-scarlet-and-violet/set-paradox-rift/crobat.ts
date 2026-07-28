import { PokemonCard } from '../../../game/store/card/pokemon-card';
import { CardType, Stage } from '../../../game/store/card/card-types';
import { GameLog, GameMessage, SelectPrompt, State, StoreLike } from '../../../game';
import { Effect } from '../../../game/store/effects/effect';
import { WAS_ATTACK_USED, OPPONENT_CANNOT_PLAY_CARDS } from '../../../game/store/prefabs/prefabs';

export class Crobat extends PokemonCard {
  public stage: Stage = Stage.STAGE_2;
  public regulationMark: string = 'G';
  public cardType: CardType = D;
  public hp: number = 130;
  public weakness = [{ type: L }];
  public resistance = [{ type: F, value: -30 }];
  public retreat = [];
  public evolvesFrom = 'Golbat';

  public attacks = [{
    name: 'Echoing Madness',
    cost: [C, C],
    damage: 50,
    text: 'Choose Item cards or Supporter cards. During your opponent\'s next turn, they can\'t play any of the chosen cards from their hand.'
  },
  {
    name: 'Cutting Wind',
    cost: [D, C, C],
    damage: 130,
    text: ''
  }];

  public set: string = 'PAR';
  public cardImage: string = 'assets/cardback.png';
  public setNumber: string = '112';
  public name: string = 'Crobat';
  public fullName: string = 'Crobat PAR';

  public reduceEffect(store: StoreLike, state: State, effect: Effect): State {
    // Echoing Madness
    if (WAS_ATTACK_USED(effect, 0, this)) {
      const player = effect.player;
      const options = [
        {
          message: GameMessage.ITEMS,
          action: () => {
            OPPONENT_CANNOT_PLAY_CARDS(store, state, effect, this, { item: true });
            store.log(state, GameLog.LOG_PLAYER_DISABLES_ITEMS_UNTIL_END_OF_NEXT_TURN, { name: player.name, attack: this.attacks[0].name });
            return state;
          }
        },
        {
          message: GameMessage.SUPPORTERS,
          action: () => {
            OPPONENT_CANNOT_PLAY_CARDS(store, state, effect, this, { supporter: true });
            store.log(state, GameLog.LOG_PLAYER_DISABLES_SUPPORTERS_UNTIL_END_OF_NEXT_TURN, { name: player.name, attack: this.attacks[0].name });
            return state;
          }
        }
      ];
      return store.prompt(state, new SelectPrompt(
        player.id,
        GameMessage.CHOOSE_ITEMS_OR_SUPPORTERS,
        options.map(c => c.message),
        { allowCancel: false }
      ), choice => {
        const option = options[choice];
        if (option.action) {
          option.action();
        }
        return state;
      });
    }
    return state;
  }
}
