import { PokemonCard } from '../../game/store/card/pokemon-card';
import { Stage, CardType, SuperType } from '../../game/store/card/card-types';
import { CheckAttackCostEffect } from '../../game/store/effects/check-effects';
import { StoreLike, State, StateUtils, PokemonCardList, Card, ChooseCardsPrompt, GameError, GameMessage } from '../../game';
import { Effect } from '../../game/store/effects/effect';

export class Mantine extends PokemonCard {

  public stage: Stage = Stage.BASIC;

  public cardType: CardType = CardType.WATER;

  public hp: number = 110;

  public weakness = [{ type: CardType.LIGHTNING }];

  public resistance = [];

  public retreat = [CardType.COLORLESS];

  public attacks = [{
    name: 'Borne Ashore',
    cost: [CardType.COLORLESS],
    damage: 0,
    text: 'Put a Basic Pokémon from either player\'s discard pile onto that player\'s Bench.'
  },
  {
    name: 'Aqua Edge',
    cost: [CardType.WATER, CardType.WATER, CardType.COLORLESS],
    damage: 100,
    text: ''
  }

  ];

  public regulationMark = 'F';

  public set: string = 'ASR';

  public cardImage: string = 'assets/cardback.png';

  public setNumber: string = '34';

  public name: string = 'Mantine';

  public fullName: string = 'Mantine ASR';

  public reduceEffect(store: StoreLike, state: State, effect: Effect): State {

    if (effect instanceof CheckAttackCostEffect && effect.attack === this.attacks[0]) {

      const player = effect.player;
      const opponent = StateUtils.getOpponent(state, player);
      const slots: PokemonCardList[] = opponent.bench.filter(b => b.cards.length === 0);

      if (opponent.discard.cards.length === 0) {
        throw new GameError(GameMessage.CANNOT_PLAY_THIS_CARD);
      }
      // Check if bench has open slots
      const openSlots = opponent.bench.filter(b => b.cards.length === 0);

      if (openSlots.length === 0) {
        // No open slots, throw error
        throw new GameError(GameMessage.CANNOT_PLAY_THIS_CARD);
      }

      let cards: Card[] = [];
      store.prompt(state, new ChooseCardsPrompt(
        player,
        GameMessage.CHOOSE_CARD_TO_PUT_ONTO_BENCH,
        opponent.discard || player.discard,
        { superType: SuperType.POKEMON, stage: Stage.BASIC },
        { min: 1, max: 1, allowCancel: true }
      ), selected => {
        cards = selected || [];
      });

      // Operation canceled by the user
      if (cards.length === 0) {
        return state;
      }


      cards.forEach((card, index) => {
        if (opponent.discard) {
          opponent.discard.moveCardTo(card, slots[index]);
        } else {
          player.discard.moveCardTo(card, slots[index]);
        }
        slots[index].pokemonPlayedTurn = state.turn;
      });

    }

    return state;
  }
}
