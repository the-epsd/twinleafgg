import { CardType, Stage } from '../../game/store/card/card-types';
import { Effect } from '../../game/store/effects/effect';
import { PokemonCard, StateUtils, StoreLike, State } from '../../game';
import { ChooseCardsPrompt, GameMessage } from '../../game';
import { MOVE_CARDS, MULTIPLE_COIN_FLIPS_PROMPT, SHUFFLE_DECK, WAS_ATTACK_USED } from '../../game/store/prefabs/prefabs';

export class Watchog extends PokemonCard {
  public stage: Stage = Stage.STAGE_1;
  public evolvesFrom = 'Patrat';
  public hp: number = 100;
  public cardType: CardType = C;
  public weakness = [{ type: F }];
  public retreat = [C];
  public attacks = [{
    name: 'Unannounced Check',
    cost: [C, C],
    damage: 50,
    text: 'Flip 3 coins. For each heads, look at your opponent\'s hand and choose a card there. Your opponent shuffles those cards into their deck. This attack does 50 damage to 1 of your opponent\'s Pokemon. (Apply Weakness and Resistance for Benched Pokemon.)'
  }];
  public regulationMark = 'J';
  public set: string = 'M4';
  public cardImage: string = 'assets/cardback.png';
  public setNumber: string = '69';
  public name: string = 'Watchog';
  public fullName: string = 'Watchog M4';

  public reduceEffect(store: StoreLike, state: State, effect: Effect): State {
    if (WAS_ATTACK_USED(effect, 0, this)) {
      const player = effect.player;
      const opponent = StateUtils.getOpponent(state, player);
      return MULTIPLE_COIN_FLIPS_PROMPT(store, state, player, 3, results => {
        const heads = results.filter(r => r).length;
        if (heads > 0 && opponent.hand.cards.length > 0) {
          const maxChoose = Math.min(heads, opponent.hand.cards.length);
          return store.prompt(state, new ChooseCardsPrompt(
            player,
            GameMessage.CHOOSE_CARD_TO_DISCARD,
            opponent.hand,
            {},
            { min: 0, max: maxChoose, allowCancel: false }
          ), selected => {
            const cards = selected || [];
            if (cards.length > 0) {
              MOVE_CARDS(store, state, opponent.hand, opponent.deck, { cards, sourceCard: this, sourceEffect: effect });
              SHUFFLE_DECK(store, state, opponent);
            }
          });
        }
        return state;
      });
    }
    return state;
  }
}
