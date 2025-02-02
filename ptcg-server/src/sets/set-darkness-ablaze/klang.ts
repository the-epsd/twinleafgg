import { PokemonCard } from '../../game/store/card/pokemon-card';
import { Stage, CardType, SuperType } from '../../game/store/card/card-types';
import { StoreLike, State, StateUtils, Card, ChooseCardsPrompt, GameMessage, GameLog, ShuffleDeckPrompt, ShowCardsPrompt } from '../../game';
import { Effect } from '../../game/store/effects/effect';
import { AttackEffect } from '../../game/store/effects/game-effects';

export class Klang extends PokemonCard {
  public stage: Stage = Stage.STAGE_1;
  public cardType: CardType = CardType.METAL;
  public hp: number = 90;
  public weakness = [{ type: CardType.FIRE }];
  public resistance = [{ type: CardType.GRASS, value: -30 }];
  public retreat = [CardType.COLORLESS, CardType.COLORLESS, CardType.COLORLESS];
  public evolvesFrom = 'Klink';

  public attacks = [{
    name: 'Call for Backup',
    cost: [CardType.METAL],
    damage: 0,
    text: 'Search your deck for a [M] Pokémon, reveal it, and put it into your hand. Then, shuffle your deck.'
  },
  {
    name: 'Spinning Attack',
    cost: [CardType.METAL, CardType.COLORLESS, CardType.COLORLESS],
    damage: 60,
    text: ''
  }];

  public set = 'DAA';
  public regulationMark = 'D';
  public cardImage: string = 'assets/cardback.png';
  public setNumber: string = '126';
  public name = 'Klang';
  public fullName = 'Klang DAA';

  public reduceEffect(store: StoreLike, state: State, effect: Effect): State {

    if (effect instanceof AttackEffect && effect.attack === this.attacks[0]) {
      const player = effect.player;
      const opponent = StateUtils.getOpponent(state, player);

      let cards: Card[] = [];

      return store.prompt(state, new ChooseCardsPrompt(
        player,
        GameMessage.CHOOSE_CARD_TO_HAND,
        player.deck,
        { superType: SuperType.POKEMON, cardType: CardType.METAL },
        { min: 0, max: 1, allowCancel: true }
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