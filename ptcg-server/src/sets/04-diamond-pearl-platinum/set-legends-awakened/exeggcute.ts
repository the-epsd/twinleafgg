import { PokemonCard as PokemonCardClass } from '../../../game/store/card/pokemon-card';
import { CardType, Stage, SuperType } from '../../../game/store/card/card-types';
import { ChooseCardsPrompt, GameMessage, State, StoreLike } from '../../../game';
import { Effect } from '../../../game/store/effects/effect';
import { PlayPokemonFromDeckEffect } from '../../../game/store/effects/play-card-effects';
import { GET_PLAYER_BENCH_SLOTS, SHUFFLE_DECK, WAS_ATTACK_USED } from '../../../game/store/prefabs/prefabs';
import { YOUR_OPPPONENTS_ACTIVE_POKEMON_IS_NOW_ASLEEP } from '../../../game/store/prefabs/attack-effects';

export class Exeggcute extends PokemonCardClass {
  public stage: Stage = Stage.BASIC;
  public hp: number = 50;
  public cardType: CardType[] = [P];
  public weakness = [{ type: P, value: +10 }];
  public retreat = [C];

  public attacks = [{
    name: 'Call for Family',
    cost: [C],
    damage: 0,
    text: 'Search your deck for up to 2 in any combination of Grass Basic Pokémon and Psychic Basic Pokémon and put them onto your Bench. Shuffle your deck afterward.'
  },
  {
    name: 'Hypnosis',
    cost: [P],
    damage: 10,
    text: 'The Defending Pokémon is now Asleep.'
  }];

  public set: string = 'LA';
  public cardImage: string = 'assets/cardback.png';
  public setNumber: string = '93';
  public name: string = 'Exeggcute';
  public fullName: string = 'Exeggcute LA';

  public reduceEffect(store: StoreLike, state: State, effect: Effect): State {
    // Call for Family
    if (WAS_ATTACK_USED(effect, 0, this)) {
      const player = effect.player;
      if (player.deck.cards.length === 0) {
        return state;
      }
      const slots = GET_PLAYER_BENCH_SLOTS(player);
      if (slots.length === 0) {
        return state;
      }
      const blocked: number[] = [];
      player.deck.cards.forEach((c, i) => {
        if (!(c instanceof PokemonCardClass) || c.stage !== Stage.BASIC) {
          blocked.push(i);
          return;
        }
        const types = Array.isArray(c.cardType) ? c.cardType : [c.cardType];
        if (!types.includes(CardType.GRASS) && !types.includes(CardType.PSYCHIC)) {
          blocked.push(i);
        }
      });
      const max = Math.min(2, slots.length, player.deck.cards.length - blocked.length);
      if (max <= 0) {
        return state;
      }
      store.prompt(state, new ChooseCardsPrompt(
        player,
        GameMessage.CHOOSE_CARD_TO_PUT_ONTO_BENCH,
        player.deck,
        { superType: SuperType.POKEMON, stage: Stage.BASIC },
        { min: 0, max, allowCancel: true, blocked },
      ), selected => {
        const cards = selected || [];
        cards.forEach((card, index) => {
          store.reduceEffect(state, new PlayPokemonFromDeckEffect(player, card as PokemonCardClass, slots[index]));
        });
        SHUFFLE_DECK(store, state, player);
      });
    }

    // Hypnosis
    if (WAS_ATTACK_USED(effect, 1, this)) {
      YOUR_OPPPONENTS_ACTIVE_POKEMON_IS_NOW_ASLEEP(store, state, effect);
    }

    return state;
  }
}
