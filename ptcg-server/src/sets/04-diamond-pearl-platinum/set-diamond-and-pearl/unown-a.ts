import { PokemonCard } from '../../../game/store/card/pokemon-card';
import { CardTag, CardType, Stage } from '../../../game/store/card/card-types';
import { CardList, GameError, GameMessage, OrderCardsPrompt, PowerType, State, StoreLike } from '../../../game';
import { Effect } from '../../../game/store/effects/effect';
import { ABILITY_USED, ADD_MARKER, HAS_MARKER, IS_POKEPOWER_BLOCKED, MOVE_CARDS, REMOVE_MARKER_AT_END_OF_TURN, SHOW_CARDS_TO_PLAYER, WAS_POWER_USED } from '../../../game/store/prefabs/prefabs';

export class UnownA extends PokemonCard {
  public stage: Stage = Stage.BASIC;
  protected _tags = [CardTag.UNOWN];
  public hp: number = 50;
  public cardType: CardType[] = [P];
  public weakness = [{ type: P }];
  public retreat = [C];

  public powers = [{
    name: 'ANALYZE',
    powerType: PowerType.POKEPOWER,
    text: 'Once during your turn (before your attack), if Unown A is on your Bench, you may look at the top 2 cards of your deck and put them back on top of your deck in any order.',
    useWhenInPlay: true
  }];

  public attacks = [{
    name: 'Hidden Power',
    cost: [C],
    damage: 10,
    text: ''
  }];

  public set: string = 'DP';
  public cardImage: string = 'assets/cardback.png';
  public setNumber: string = '65';
  public name: string = 'Unown [A]';
  public fullName: string = 'Unown [A] DP';

  public readonly ABILITY_USED_MARKER = 'ABILITY_USED_MARKER';

  public reduceEffect(store: StoreLike, state: State, effect: Effect): State {
    REMOVE_MARKER_AT_END_OF_TURN(effect, this.ABILITY_USED_MARKER, this);

    // ANALYZE
    if (WAS_POWER_USED(effect, 0, this)) {
      const player = effect.player;

      if (IS_POKEPOWER_BLOCKED(store, state, player, this)) {
        throw new GameError(GameMessage.BLOCKED_BY_EFFECT);
      }

      const isOnBench = player.bench.some(cardList => cardList.getPokemonCard() === this);
      if (!isOnBench) {
        throw new GameError(GameMessage.CANNOT_USE_POWER);
      }
      if (HAS_MARKER(this.ABILITY_USED_MARKER, player, this)) {
        throw new GameError(GameMessage.POWER_ALREADY_USED);
      }
      if (player.deck.cards.length === 0) {
        throw new GameError(GameMessage.CANNOT_USE_POWER);
      }

      ADD_MARKER(this.ABILITY_USED_MARKER, player, this);
      ABILITY_USED(player, this);

      const deckTop = new CardList();
      const count = Math.min(2, player.deck.cards.length);
      MOVE_CARDS(store, state, player.deck, deckTop, { count, sourceCard: this });
      SHOW_CARDS_TO_PLAYER(store, state, player, deckTop.cards);

      return store.prompt(state, new OrderCardsPrompt(
        player.id,
        GameMessage.CHOOSE_CARDS_ORDER,
        deckTop,
        { allowCancel: false }
      ), order => {
        if (order === null) {
          return;
        }
        deckTop.applyOrder(order);
        deckTop.moveToTopOfDestination(player.deck);
      });
    }

    return state;
  }
}
