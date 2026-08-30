import { PokemonCard } from '../../../game/store/card/pokemon-card';
import { Stage, CardType, CardTag } from '../../../game/store/card/card-types';
import { StoreLike, State, GameMessage } from '../../../game';
import { ChooseCardsPrompt } from '../../../game/store/prompts/choose-cards-prompt';
import { Effect } from '../../../game/store/effects/effect';
import { PlayPokemonFromDeckEffect } from '../../../game/store/effects/play-card-effects';
import { WAS_ATTACK_USED, SHUFFLE_DECK } from '../../../game/store/prefabs/prefabs';
import { DEFENDING_POKEMON_CANNOT_ATTACK } from '../../../game/store/prefabs/effect-of-attack-prefabs';

export class OmastarV extends PokemonCard {
  protected _tags = [CardTag.POKEMON_V];
  public stage: Stage = Stage.BASIC;
  public cardType: CardType[] = [W];
  public hp: number = 190;
  public weakness = [{ type: L }];
  public retreat = [C];

  public attacks = [{
    name: 'Primal Guidance',
    cost: [C],
    damage: 0,
    text: 'Search your deck for up to 2 Pokémon that evolve from an Item card that has "Fossil" in its name and put them onto your Bench. Then, shuffle your deck.'
  }, {
    name: 'Tentacle Lock',
    cost: [W, C, C],
    damage: 110,
    text: 'If the Defending Pokémon is an Evolution Pokémon, it can\'t attack during your opponent\'s next turn.'
  }];

  public regulationMark: string = 'F';
  public set: string = 'SIT';
  public setNumber: string = '35';
  public cardImage: string = 'assets/cardback.png';
  public name: string = 'Omastar V';
  public fullName: string = 'Omastar V SIT 35';

  public reduceEffect(store: StoreLike, state: State, effect: Effect): State {
    // Primal Guidance
    if (WAS_ATTACK_USED(effect, 0, this)) {
      const player = effect.player;

      if (player.deck.cards.length === 0) {
        return state;
      }

      const slots = player.bench.filter((b) => b.cards.length === 0);
      if (slots.length === 0) {
        return state;
      }

      const blocked: number[] = [];
      player.deck.cards.forEach((c, index) => {
        const isFossilPokemon =
          c instanceof PokemonCard &&
          c.evolvesFrom &&
          c.evolvesFrom.toLowerCase().includes('fossil');
        if (!isFossilPokemon) {
          blocked.push(index);
        }
      });

      const maxPick = Math.min(2, slots.length);

      return store.prompt(
        state,
        new ChooseCardsPrompt(
          player,
          GameMessage.CHOOSE_CARD_TO_PUT_ONTO_BENCH,
          player.deck,
          {},
          { min: 0, max: maxPick, allowCancel: false, blocked },
        ),
        (selected) => {
          const cards = selected || [];
          cards.forEach((card, index) => {
            store.reduceEffect(
              state,
              new PlayPokemonFromDeckEffect(player, card as PokemonCard, slots[index]),
            );
          });
          SHUFFLE_DECK(store, state, player);
        },
      );
    }

    // Tentacle Lock
    if (WAS_ATTACK_USED(effect, 1, this)) {
      const defending = effect.opponent.active.getPokemonCard();
      if (defending && defending.stage !== Stage.BASIC) {
        return DEFENDING_POKEMON_CANNOT_ATTACK(store, state, effect, this);
      }
    }

    return state;
  }
}
