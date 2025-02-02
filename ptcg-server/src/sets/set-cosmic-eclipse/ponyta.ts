import { Card, ChooseCardsPrompt, GameLog, GameMessage, ShowCardsPrompt, ShuffleDeckPrompt, State, StateUtils, StoreLike } from '../../game';
import { CardType, EnergyType, Stage, SuperType } from '../../game/store/card/card-types';
import { PokemonCard } from '../../game/store/card/pokemon-card';
import { Attack } from '../../game/store/card/pokemon-types';
import { Effect } from '../../game/store/effects/effect';
import { AttackEffect } from '../../game/store/effects/game-effects';

export class Ponyta extends PokemonCard {

  public name = 'Ponyta';

  public cardImage: string = 'assets/cardback.png';

  public set = 'CEC';

  public setNumber = '23';

  public cardType = CardType.FIRE;

  public fullName = 'Ponyta CEC';

  public stage = Stage.BASIC;

  public hp = 70;

  public weakness = [{ type: CardType.WATER }];

  public retreat = [CardType.COLORLESS];

  public attacks: Attack[] = [
    {
      name: 'Minor Errand-Running',
      cost: [CardType.COLORLESS],
      damage: 20,
      text: 'Search your deck for up to 2 basic Energy cards, reveal them, and put them into your hand. Then, shuffle your deck.'
    },
    {
      name: 'Flare',
      cost: [CardType.FIRE],
      damage: 10,
      text: ''
    }
  ];

  public reduceEffect(store: StoreLike, state: State, effect: Effect): State {
  
    if (effect instanceof AttackEffect && effect.attack === this.attacks[0]) {
      const player = effect.player;
      const opponent = StateUtils.getOpponent(state, player);

      let cards: Card[] = [];

      return store.prompt(state, new ChooseCardsPrompt(
        player,
        GameMessage.CHOOSE_CARD_TO_HAND,
        player.deck,
        { superType: SuperType.ENERGY, energyType: EnergyType.BASIC },
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
