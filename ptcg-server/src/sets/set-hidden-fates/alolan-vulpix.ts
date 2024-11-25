import { Card, CardType, ChooseCardsPrompt, GameLog, GameMessage, PokemonCard, ShowCardsPrompt, ShuffleDeckPrompt, Stage, State, StateUtils, StoreLike, SuperType } from '../../game';
import { Effect } from '../../game/store/effects/effect';
import { AttackEffect } from '../../game/store/effects/game-effects';

export class AlolanVulpix extends PokemonCard {

  public stage: Stage = Stage.BASIC;

  public cardType: CardType = CardType.WATER;

  public hp: number = 60;

  public weakness = [{ type: CardType.METAL }];

  public retreat = [CardType.COLORLESS];

  public attacks = [{
    name: 'Beacon',
    cost: [],
    damage: 0,
    text: 'Search your deck for up to 2 Pokémon, reveal them, and put them into your hand. Then, shuffle your deck.'
  }, {
    name: 'Icy Snow',
    cost: [CardType.COLORLESS, CardType.COLORLESS],
    damage: 20,
    text: ''
  }];

  public set: string = 'HIF';

  public name: string = 'Alolan Vulpix';

  public fullName: string = 'Alolan Vulpix HIF';

  public cardImage: string = 'assets/cardback.png';

  public setNumber: string = 'SV8';

  public reduceEffect(store: StoreLike, state: State, effect: Effect): State {

    if (effect instanceof AttackEffect && effect.attack === this.attacks[0]) {
      const player = effect.player;
      const opponent = StateUtils.getOpponent(state, player);

      let cards: Card[] = [];

      return store.prompt(state, new ChooseCardsPrompt(
        player,
        GameMessage.CHOOSE_CARD_TO_HAND,
        player.deck,
        { superType: SuperType.POKEMON },
        { min: 0, max: 2, allowCancel: true }
      ), selected => {
        cards = selected || [];

        cards.forEach((card, index) => {
          player.deck.moveCardTo(card, player.hand);

          store.log(state, GameLog.LOG_PLAYER_PUTS_CARD_IN_HAND, { name: player.name, card: card.name });

        });

        state = store.prompt(state, new ShowCardsPrompt(
          opponent.id,
          GameMessage.CARDS_SHOWED_BY_THE_OPPONENT,
          cards), () => state
        );

        return store.prompt(state, new ShuffleDeckPrompt(player.id), order => {
          player.deck.applyOrder(order);
        });
      });
    }
    return state;
  }
}