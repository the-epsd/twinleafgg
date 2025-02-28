import { Attack, CardList, CardTag, CardType, GameError, GameMessage, PokemonCard, PokemonCardList, Power, PowerType, Stage, State, StateUtils, StoreLike, Weakness } from '../../game';
import { Effect } from '../../game/store/effects/effect';
import { BLOCK_IF_DECK_EMPTY, GET_CARDS_ON_BOTTOM_OF_DECK, WAS_POWER_USED } from '../../game/store/prefabs/prefabs';

export class MistysPsyduck extends PokemonCard {

  public stage: Stage = Stage.BASIC;
  public tags: string[] = [CardTag.MISTYS];
  public cardType: CardType = W;
  public hp: number = 50;
  public weakness: Weakness[] = [{ type: L }];
  public retreat: CardType[] = [C];

  public powers: Power[] = [{
    name: 'Slapstick Jump',
    powerType: PowerType.ABILITY,
    useWhenInPlay: true,
    text: 'Once during your turn, if this Pokémon is on your Bench, you may discard the bottom card ' +
      'of your deck. If you do, discard all cards attached to this Pokémon and put it on top of your deck.',
  }];

  public attacks: Attack[] = [{ name: 'Sprinkle Water', cost: [W], damage: 30, text: '' }];

  public set: string = 'SV9a';
  public regulationMark: string = 'I';
  public cardImage: string = 'assets/cardback.png';
  public setNumber: string = '22';
  public name: string = 'Misty\'s Psyduck';
  public fullName: string = 'Misty\'s Psyduck SV9a';

  public reduceEffect(store: StoreLike, state: State, effect: Effect): State {
    if (WAS_POWER_USED(effect, 0, this)) {
      const player = effect.player;
      const opponent = StateUtils.getOpponent(state, player);
      BLOCK_IF_DECK_EMPTY(player);

      const cardList = StateUtils.findCardList(state, this) as PokemonCardList;
      if (player.active.cards.includes(this) || opponent.active.cards.includes(this)) {
        new GameError(GameMessage.CANNOT_USE_POWER);
      }

      player.deck.moveCardsTo(GET_CARDS_ON_BOTTOM_OF_DECK(player, 1), player.discard);

      const deckTop = new CardList();
      cardList.moveTo(deckTop);
      cardList.cards.forEach((c) => {
        c.cards.moveTo(player.discard);
      });
      deckTop.moveToTopOfDestination(player.deck);
    }
    return state;
  }
}