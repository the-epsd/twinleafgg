import { PokemonCard } from '../../game/store/card/pokemon-card';
import { Stage, CardType, SuperType } from '../../game/store/card/card-types';
import { StoreLike, State, StateUtils, Card, ChooseCardsPrompt, GameMessage, GameLog, ShuffleDeckPrompt, ShowCardsPrompt } from '../../game';
import { Effect } from '../../game/store/effects/effect';
import { AttackEffect } from '../../game/store/effects/game-effects';

export class Ivysaur extends PokemonCard {
  public stage: Stage = Stage.STAGE_1;
  public cardType: CardType = CardType.GRASS;
  public hp: number = 100;
  public weakness = [{ type: CardType.FIRE }];
  public retreat = [CardType.COLORLESS, CardType.COLORLESS, CardType.COLORLESS];
  public evolvesFrom = 'Bulbasaur';

  public attacks = [{
    name: 'Summoning Aroma',
    cost: [CardType.GRASS],
    damage: 0,
    text: ' Search your deck for up to 2 Pokémon, reveal them, and put them into your hand. Then, shuffle your deck. '
  },
  {
    name: 'Razor Leaf',
    cost: [CardType.GRASS, CardType.COLORLESS, CardType.COLORLESS],
    damage: 60,
    text: ''
  }];

  public set: string = 'PGO';
  public regulationMark = 'F';
  public cardImage: string = 'assets/cardback.png';
  public fullName: string = 'Ivysaur PGO';
  public name: string = 'Ivysaur';
  public setNumber: string = '2';

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
        { min: 0, max: 2, allowCancel: false }
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