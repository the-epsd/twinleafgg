import { PokemonCard } from '../../game/store/card/pokemon-card';
import { Stage, CardType, CardTag, SuperType } from '../../game/store/card/card-types';
import { StoreLike, State, GameMessage, ChooseCardsPrompt } from '../../game';
import { Effect } from '../../game/store/effects/effect';
import { GET_PLAYER_BENCH_SLOTS, SHUFFLE_DECK, WAS_ATTACK_USED } from '../../game/store/prefabs/prefabs';

export class StevensBaltoy extends PokemonCard {
  public stage: Stage = Stage.BASIC;
  public tags = [CardTag.STEVENS];
  public cardType: CardType = P;
  public hp: number = 60;
  public weakness = [{ type: D }];
  public resistance = [{ type: F, value: -30 }];
  public retreat = [C];

  public attacks = [{
    name: 'Summoning Sign',
    cost: [C],
    damage: 0,
    text: 'Search your deck for up to 2 Basic Steven\'s Pokémon and put them onto your Bench. Then, shuffle your deck.'
  }, {
    name: 'Psychic Sphere',
    cost: [P],
    damage: 20,
    text: ''
  }];

  public regulationMark = 'I';
  public set: string = 'SVOD';
  public setNumber: string = '1';
  public cardImage: string = 'assets/cardback.png';
  public name: string = 'Steven\'s Baltoy';
  public fullName: string = 'Steven\'s Baltoy SVOD';

  public reduceEffect(store: StoreLike, state: State, effect: Effect): State {
    if (WAS_ATTACK_USED(effect, 0, this)) {
      const player = effect.player;
      const slots = GET_PLAYER_BENCH_SLOTS(player);

      if (slots.length === 0) {
        return state;
      }

      return store.prompt(state, new ChooseCardsPrompt(
        player,
        GameMessage.CHOOSE_CARD_TO_PUT_ONTO_BENCH,
        player.deck,
        { superType: SuperType.POKEMON, stage: Stage.BASIC },
        {
          min: 0, max: Math.min(slots.length, 2), allowCancel: false,
          blocked: player.deck.cards
            .filter(c => !c.tags.includes(CardTag.STEVENS))
            .map(c => player.deck.cards.indexOf(c))
        }
      ), selected => {
        const cards = selected || [];
        cards.forEach((card, index) => {
          player.deck.moveCardTo(card, slots[index]);
          slots[index].pokemonPlayedTurn = state.turn;
        });
        SHUFFLE_DECK(store, state, player);
        return state;
      });
    }

    return state;
  }
}
