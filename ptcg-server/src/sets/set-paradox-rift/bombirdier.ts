import { PokemonCard, Stage, CardType, StoreLike, State, ShuffleDeckPrompt, PokemonCardList, Card, ChooseCardsPrompt, GameError, GameMessage, SuperType, ConfirmPrompt } from '../../game';
import { Effect } from '../../game/store/effects/effect';
import { AttackEffect } from '../../game/store/effects/game-effects';


export class Bombirdierex extends PokemonCard {

  public stage: Stage = Stage.BASIC;

  public cardType: CardType = CardType.COLORLESS;

  public hp: number = 200;

  public weakness = [{ type: CardType.LIGHTNING }];

  public resistance = [{ type: CardType.FIGHTING, value: -30 }];

  public retreat = [CardType.COLORLESS];

  public attacks = [
    {
      name: 'Fast Carrier',
      cost: [CardType.COLORLESS],
      damage: 0,
      text: 'If you go first, you can use this attack during your first turn. Search your deck for up to 3 Basic Pokémon and put them onto your Bench. Then, shuffle your deck.'
    },
    {
      name: 'Shadowy Wind',
      cost: [CardType.COLORLESS, CardType.COLORLESS, CardType.COLORLESS],
      damage: 130,
      text: 'You may put this Pokémon and all attached cards into your hand.'
    }
  ];

  public set: string = 'PAR';

  public cardImage: string = 'assets/cardback.png';

  public regulationMark = 'G';

  public setNumber: string = '156';

  public name: string = 'Bombirdier ex';

  public fullName: string = 'Bombirdier ex PAR';

  public reduceEffect(store: StoreLike, state: State, effect: Effect): State {
    // Implement ability
    const player = state.players[state.activePlayer];

    if (state.turn == 1 && player.active.cards[0] == this) {
      player.canAttackFirstTurn = true;
    }

    if (effect instanceof AttackEffect && effect.attack === this.attacks[0]) {
      const player = effect.player;
      // Allow player to search deck and choose up to 2 Basic Pokemon
      const slots: PokemonCardList[] = player.bench.filter(b => b.cards.length === 0);

      if (player.deck.cards.length === 0) {
        throw new GameError(GameMessage.CANNOT_PLAY_THIS_CARD);
      } else {
        // Check if bench has open slots
        const openSlots = player.bench.filter(b => b.cards.length === 0);

        if (openSlots.length === 0) {
          // No open slots, throw error
          throw new GameError(GameMessage.CANNOT_PLAY_THIS_CARD);
        }

        if (player.canAttackFirstTurn) {

          let cards: Card[] = [];
          return store.prompt(state, new ChooseCardsPrompt(
            player.id,
            GameMessage.CHOOSE_CARD_TO_PUT_ONTO_BENCH,
            player.deck,
            { superType: SuperType.POKEMON, stage: Stage.BASIC },
            { min: 0, max: 3, allowCancel: true }
          ), selectedCards => {
            cards = selectedCards || [];


            cards.forEach((card, index) => {
              player.deck.moveCardTo(card, slots[index]);
              slots[index].pokemonPlayedTurn = state.turn;
            });

            return store.prompt(state, new ShuffleDeckPrompt(player.id), order => {
              player.deck.applyOrder(order);

              return state;
            });
          });
        }
      }
    }

    // Implement attack
    if (effect instanceof AttackEffect && effect.attack === this.attacks[1]) {
      const player = effect.player;

      state = store.prompt(state, new ConfirmPrompt(
        effect.player.id,
        GameMessage.WANT_TO_USE_ABILITY,
      ), wantToUse => {
        if (wantToUse) {

          player.active.moveTo(player.deck);
          player.active.clearEffects();

          return store.prompt(state, new ShuffleDeckPrompt(player.id), order => {
            player.deck.applyOrder(order);
          });
        }
      });
    }
    return state;
  }
}