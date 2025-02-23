import { Attack, CardType, ChooseCardsPrompt, GameMessage, PokemonCard, ShowCardsPrompt, ShuffleDeckPrompt, Stage, State, StateUtils, StoreLike, Weakness } from "../../game";
import { Effect } from "../../game/store/effects/effect";
import { AttackEffect } from "../../game/store/effects/game-effects";

export class Rotom extends PokemonCard {

  public stage: Stage = Stage.BASIC;
  public cardType: CardType = L;
  public hp: number = 60;
  public weakness: Weakness[] = [{ type: F }];
  public retreat: CardType[] = [C];

  public attacks: Attack[] = [{
    name: 'Astonish',
    cost: [L],
    damage: 20,
    text: 'Choose a random card from your opponent\'s hand. Your opponent reveals it and shuffles it into their deck.'
  }, {
    name: 'Gadget Show',
    cost: [C, C],
    damage: 30,
    text: 'This attack does 30 damage for each Pokémon Tool attached to all of your Pokemon.',
  }];

  public regulationMark: string = 'I';
  public set: string = 'SV9a';
  public setNumber: string = '39';
  public cardImage: string = 'assets/cardback.png';
  public name: string = 'Rotom';
  public fullName: string = 'Rotom SV9a';

  public reduceEffect(store: StoreLike, state: State, effect: Effect): State {

    if (effect instanceof AttackEffect && effect.attack === this.attacks[0]) {
      const player = effect.player;
      const opponent = StateUtils.getOpponent(state, player);

      if (opponent.hand.cards.length === 0) {
        return state;
      }

      state = store.prompt(state, new ChooseCardsPrompt(
        player,
        GameMessage.CHOOSE_CARD_TO_DISCARD,
        opponent.hand,
        {},
        { allowCancel: false, min: 1, max: 1, isSecret: true }
      ), cards => {
        cards = cards || [];

        store.prompt(state, new ShowCardsPrompt(
          player.id,
          GameMessage.CARDS_SHOWED_BY_THE_OPPONENT,
          cards
        ), () => []);

        opponent.hand.moveCardsTo(cards, opponent.deck);

        return store.prompt(state, new ShuffleDeckPrompt(opponent.id), order => {
          opponent.deck.applyOrder(order);
        });
      });
    }

    if (effect instanceof AttackEffect && effect.attack === this.attacks[1]) {
      const player = effect.player;
      let toolCount = 0;

      [player.active, ...player.bench].forEach(list => {
        list.cards.forEach(card => {
          if (card instanceof PokemonCard && card.tools.length > 0) {
            toolCount += card.tools.length;
          }
        });
      });
      effect.damage = 30 * toolCount;
    }
    return state;
  }
}