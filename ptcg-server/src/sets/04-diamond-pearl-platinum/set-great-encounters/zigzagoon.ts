import { PokemonCard } from '../../../game/store/card/pokemon-card';
import { CardType, Stage } from '../../../game/store/card/card-types';
import { ChooseCardsPrompt, GameMessage, State, StateUtils, StoreLike } from '../../../game';
import { Effect } from '../../../game/store/effects/effect';
import { MOVE_CARDS, MULTIPLE_COIN_FLIPS_PROMPT, SHOW_CARDS_TO_PLAYER, WAS_ATTACK_USED } from '../../../game/store/prefabs/prefabs';

export class Zigzagoon extends PokemonCard {
  public stage: Stage = Stage.BASIC;
  public hp: number = 50;
  public cardType: CardType[] = [C];
  public weakness = [{ type: F, value: +10 }];
  public retreat = [C];

  public attacks = [{
    name: 'Pull Out',
    cost: [C],
    damage: 0,
    text: 'Search your discard pile for any 1 card, show it to your opponent, and put it on top of your deck.'
  },
  {
    name: 'Double Stab',
    cost: [C],
    damage: 10,
    damageCalculation: 'x',
    text: 'Flip 2 coins. This attack does 10 damage times the number of heads.'
  }];

  public set: string = 'GE';
  public cardImage: string = 'assets/cardback.png';
  public setNumber: string = '96';
  public name: string = 'Zigzagoon';
  public fullName: string = 'Zigzagoon GE';

  public reduceEffect(store: StoreLike, state: State, effect: Effect): State {
    // Pull Out
    if (WAS_ATTACK_USED(effect, 0, this)) {
      const player = effect.player;
      const opponent = StateUtils.getOpponent(state, player);
      if (player.discard.cards.length === 0) {
        return state;
      }
      return store.prompt(state, new ChooseCardsPrompt(
        player,
        GameMessage.CHOOSE_CARD_TO_DECK,
        player.discard,
        {},
        { min: 1, max: 1, allowCancel: false }
      ), selected => {
        const cards = selected || [];
        if (cards.length === 0) {
          return;
        }
        SHOW_CARDS_TO_PLAYER(store, state, opponent, cards);
        MOVE_CARDS(store, state, player.discard, player.deck, {
          cards,
          sourceCard: this,
          toTop: true,
        });
      });
    }

    // Double Stab
    if (WAS_ATTACK_USED(effect, 1, this)) {
      MULTIPLE_COIN_FLIPS_PROMPT(store, state, effect.player, 2, results => {
        effect.damage = 10 * results.filter(r => r).length;
      });
    }

    return state;
  }
}
