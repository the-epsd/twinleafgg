import { PokemonCard } from '../../../game/store/card/pokemon-card';
import { CardType, Stage } from '../../../game/store/card/card-types';
import { ChooseCardsPrompt, GameMessage, State, StoreLike } from '../../../game';
import { Effect } from '../../../game/store/effects/effect';
import { COIN_FLIP_PROMPT, MOVE_CARDS, WAS_ATTACK_USED } from '../../../game/store/prefabs/prefabs';

export class Swinub extends PokemonCard {
  public stage: Stage = Stage.BASIC;
  public hp: number = 60;
  public cardType: CardType[] = [W];
  public weakness = [{ type: M, value: +10 }];
  public resistance = [{ type: L, value: -20 }];
  public retreat = [C, C];

  public attacks = [{
    name: 'Sniff Out',
    cost: [C],
    damage: 0,
    text: 'Flip a coin. If heads, put any 1 card from your discard pile into your hand.'
  },
  {
    name: 'Lunge Out',
    cost: [F, C],
    damage: 30,
    text: ''
  }];

  public set: string = 'LA';
  public cardImage: string = 'assets/cardback.png';
  public setNumber: string = '123';
  public name: string = 'Swinub';
  public fullName: string = 'Swinub LA';

  public reduceEffect(store: StoreLike, state: State, effect: Effect): State {
    // Sniff Out
    if (WAS_ATTACK_USED(effect, 0, this)) {
      const player = effect.player;
      COIN_FLIP_PROMPT(store, state, player, flipResult => {
      if (flipResult && player.discard.cards.length > 0) {
      store.prompt(state, new ChooseCardsPrompt(
      player,
      GameMessage.CHOOSE_CARD_TO_HAND,
      player.discard,
      {},
      { min: 1, max: 1, allowCancel: false }
      ), selected => {
      const cards = selected || [];
      cards.forEach(card => {
      MOVE_CARDS(store, state, player.discard, player.hand, { cards: [card], sourceCard: this });
      });
      });
      }
      });
    }

    return state;
  }
}
