import { PokemonCard } from '../../game/store/card/pokemon-card';
import { Stage, CardType, SuperType } from '../../game/store/card/card-types';
import { StoreLike, State, ChooseCardsPrompt, GameMessage, ShuffleDeckPrompt, ShowCardsPrompt, StateUtils, Card, GameLog } from '../../game';
import { Effect } from '../../game/store/effects/effect';
import { AttackEffect } from '../../game/store/effects/game-effects';

export class Zweilous extends PokemonCard {
  public stage: Stage = Stage.STAGE_1;
  public cardType: CardType = CardType.DARK;
  public hp: number = 100;
  public weakness = [{ type: CardType.GRASS }];
  public retreat = [CardType.COLORLESS, CardType.COLORLESS];
  public evolvesFrom = 'Deino';

  public attacks = [{
    name: 'Find a Friend',
    cost: [CardType.COLORLESS],
    damage: 0,
    text: ' Search your deck for up to 2 Pokémon, reveal them, and put them into your hand. Then, shuffle your deck.'
  },
  {
    name: 'Headbutt Bounce',
    cost: [CardType.DARK, CardType.DARK, CardType.COLORLESS],
    damage: 80,
    text: ''
  }];

  public set = 'PAL';
  public regulationMark = 'G';
  public cardImage: string = 'assets/cardback.png';
  public setNumber: string = '139';
  public name = 'Zweilous';
  public fullName = 'Zweilous PAL';

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