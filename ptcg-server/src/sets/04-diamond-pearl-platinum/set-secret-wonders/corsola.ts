import { PokemonCard } from '../../../game/store/card/pokemon-card';
import { CardType, Stage, SuperType } from '../../../game/store/card/card-types';
import { State, StoreLike } from '../../../game';
import { Effect } from '../../../game/store/effects/effect';
import { SHUFFLE_DECK, WAS_ATTACK_USED } from '../../../game/store/prefabs/prefabs';
import { ChooseCardsPrompt } from '../../../game/store/prompts/choose-cards-prompt';
import { GameMessage } from '../../../game/game-message';
import { PlayPokemonFromDeckEffect } from '../../../game/store/effects/play-card-effects';

export class Corsola extends PokemonCard {
  public stage: Stage = Stage.BASIC;
  public hp: number = 70;
  public cardType: CardType[] = [W];
  public weakness = [{ type: G, value: 20 }];
  public retreat = [C];

  public attacks = [{
    name: 'Rally',
    cost: [C],
    damage: 0,
    text: 'Search your deck for up to 3 different types of Basic Pokémon and put them onto your Bench. Shuffle your deck afterward.'
  },
{
    name: 'Hook',
    cost: [W, C],
    damage: 30,
    text: ''
  }];

  public set: string = 'SW';
  public cardImage: string = 'assets/cardback.png';
  public setNumber: string = '84';
  public name: string = 'Corsola';
  public fullName: string = 'Corsola SW';

  public reduceEffect(store: StoreLike, state: State, effect: Effect): State {
    // Rally
    if (WAS_ATTACK_USED(effect, 0, this)) {
      const player = effect.player;
      const emptyBenchSlots = player.bench.filter(b => b.cards.length === 0).length;
      if (emptyBenchSlots === 0 || player.deck.cards.length === 0) {
      return state;
      }
      const maxPokemon = Math.min(3, emptyBenchSlots);
      return store.prompt(state, new ChooseCardsPrompt(
      player,
      GameMessage.CHOOSE_CARD_TO_PUT_ONTO_BENCH,
      player.deck,
      { superType: SuperType.POKEMON, stage: Stage.BASIC },
      { min: 0, max: maxPokemon, allowCancel: false, differentTypes: true }
      ), selected => {
      const cards = selected || [];
      cards.forEach(card => {
      const emptySlot = player.bench.find(b => b.cards.length === 0);
      if (emptySlot) {
      store.reduceEffect(state, new PlayPokemonFromDeckEffect(player, card as PokemonCard, emptySlot));
      }
      });
      return SHUFFLE_DECK(store, state, player);
      });
    }

    return state;
  }
}
