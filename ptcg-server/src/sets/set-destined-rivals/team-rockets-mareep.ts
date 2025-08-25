import { PokemonCard, Stage, CardType, CardTag, StoreLike, State, GameMessage, ChooseCardsPrompt, SuperType, TrainerType, Card, StateUtils } from '../../game';
import { Effect } from '../../game/store/effects/effect';
import { MOVE_CARDS, SHOW_CARDS_TO_PLAYER, SHUFFLE_DECK, WAS_ATTACK_USED } from '../../game/store/prefabs/prefabs';

export class TeamRocketsMareep extends PokemonCard {
  public stage: Stage = Stage.BASIC;
  public tags = [CardTag.TEAM_ROCKET];
  public cardType: CardType = L;
  public hp: number = 60;
  public weakness = [{ type: F }];
  public retreat = [C];

  public attacks = [
    {
      name: 'Provision',
      cost: [C],
      damage: 0,
      text: 'Search your deck for an Item card, reveal it, and put it into your hand. Then, shuffle your deck.'
    },
    {
      name: 'Petibolt',
      cost: [L],
      damage: 10,
      text: ''
    }
  ];

  public set: string = 'DRI';
  public regulationMark = 'I';
  public cardImage: string = 'assets/cardback.png';
  public setNumber: string = '72';
  public name: string = 'Team Rocket\'s Mareep';
  public fullName: string = 'Team Rocket\'s Mareep DRI';

  public reduceEffect(store: StoreLike, state: State, effect: Effect): State {
    // Provision
    if (WAS_ATTACK_USED(effect, 0, this)) {
      const player = effect.player;

      if (player.deck.cards.length === 0) {
        return state;
      }

      let cards: Card[] = [];
      return store.prompt(state, new ChooseCardsPrompt(
        player,
        GameMessage.CHOOSE_CARD_TO_HAND,
        player.deck,
        { superType: SuperType.TRAINER, trainerType: TrainerType.ITEM },
        { min: 0, max: 1, allowCancel: false, differentTypes: true }
      ), selected => {
        cards = selected || [];

        if (selected.length === 0) { return state; }

        MOVE_CARDS(store, state, player.deck, player.hand, { cards: selected, sourceCard: this });
        SHOW_CARDS_TO_PLAYER(store, state, StateUtils.getOpponent(state, player), cards);
        SHUFFLE_DECK(store, state, player);
      });
    }

    return state;
  }
}
