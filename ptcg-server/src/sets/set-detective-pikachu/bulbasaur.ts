import { PokemonCard } from '../../game/store/card/pokemon-card';
import { CardType, Stage, SuperType } from '../../game/store/card/card-types';
import { StoreLike, State, Card, ChooseCardsPrompt, GameError, GameMessage, ShuffleDeckPrompt } from '../../game';
import { Effect } from '../../game/store/effects/effect';
import { AFTER_ATTACK, MOVE_CARDS } from '../../game/store/prefabs/prefabs';

export class Bulbasaur extends PokemonCard {

  public stage: Stage = Stage.BASIC;
  public cardType: CardType = CardType.GRASS;
  public hp: number = 60;
  public weakness = [{ type: CardType.FIRE }];
  public retreat = [CardType.COLORLESS];
  public attacks = [
    {
      name: 'Find a Friend',
      cost: [CardType.GRASS],
      damage: 0,
      text: 'Search your deck for a [G] Pokémon, reveal it, and put it into your hand. Then, shuffle your deck.',
    }
  ];

  public set: string = 'DET';
  public cardImage: string = 'assets/cardback.png';
  public setNumber: string = '1';
  public name: string = 'Bulbasaur';
  public fullName: string = 'Bulbasaur DET';

  public reduceEffect(store: StoreLike, state: State, effect: Effect): State {

    if (AFTER_ATTACK(effect, 0, this)) {
      const player = effect.player;

      if (player.deck.cards.length === 0) {
        throw new GameError(GameMessage.CANNOT_PLAY_THIS_CARD);
      }

      let cards: Card[] = [];
      return store.prompt(state, new ChooseCardsPrompt(
        player,
        GameMessage.CHOOSE_CARD_TO_PUT_ONTO_BENCH,
        player.deck,
        { superType: SuperType.POKEMON, cardType: CardType.GRASS },
        { min: 0, max: 1, allowCancel: false }
      ), selectedCards => {
        cards = selectedCards || [];

        cards.forEach((card, index) => {
          MOVE_CARDS(store, state, player.deck, player.hand, { cards: [card], sourceCard: this, sourceEffect: this.attacks[0] });
          return state;
        });

        return store.prompt(state, new ShuffleDeckPrompt(player.id), order => {
          player.deck.applyOrder(order);
        });
      });
    }
    return state;
  }
}