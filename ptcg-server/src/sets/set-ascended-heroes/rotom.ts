import { PokemonCard } from '../../game/store/card/pokemon-card';
import { Stage, CardType, SuperType, TrainerType } from '../../game/store/card/card-types';
import { StoreLike, State, GameMessage, Card, ChooseCardsPrompt, ShuffleDeckPrompt, PlayerType } from '../../game';
import { Effect } from '../../game/store/effects/effect';
import { AttackEffect } from '../../game/store/effects/game-effects';
import { TrainerCard } from '../../game/store/card/trainer-card';
import { PlayPokemonFromDeckEffect } from '../../game/store/effects/play-card-effects';
import { WAS_ATTACK_USED } from '../../game/store/prefabs/prefabs';

function* useRotocall(next: Function, store: StoreLike, state: State,
  effect: AttackEffect): IterableIterator<State> {
  const player = effect.player;

  if (player.deck.cards.length === 0) {
    return state;
  }

  // Find available bench slots
  const benchSlots = player.bench.filter(slot => slot.cards.length === 0);

  if (benchSlots.length === 0) {
    // No bench space available
    return state;
  }

  // Find Rotom Pokemon in deck
  const rotomPokemon = player.deck.cards.filter((card, index) => {
    return card instanceof PokemonCard && card.name.includes('Rotom');
  });

  if (rotomPokemon.length === 0) {
    // No Rotom Pokemon in deck, just shuffle
    return store.prompt(state, new ShuffleDeckPrompt(player.id), order => {
      player.deck.applyOrder(order);
    });
  }

  // Create blocked array for non-Rotom Pokemon
  const blocked: number[] = [];
  player.deck.cards.forEach((card, index) => {
    if (!(card instanceof PokemonCard && card.name.includes('Rotom'))) {
      blocked.push(index);
    }
  });

  let cards: Card[] = [];
  yield store.prompt(state, new ChooseCardsPrompt(
    player,
    GameMessage.CHOOSE_CARD_TO_PUT_ONTO_BENCH,
    player.deck,
    { superType: SuperType.POKEMON },
    { min: 0, max: Math.min(rotomPokemon.length, benchSlots.length), allowCancel: false, blocked }
  ), selected => {
    cards = selected || [];
    next();
  });

  // Place selected cards on bench using PlayPokemonFromDeckEffect
  if (cards.length > 0) {
    cards.forEach((card, index) => {
      if (index < benchSlots.length) {
        const playPokemonFromDeckEffect = new PlayPokemonFromDeckEffect(player, card as any, benchSlots[index]);
        store.reduceEffect(state, playPokemonFromDeckEffect);
      }
    });
  }

  return store.prompt(state, new ShuffleDeckPrompt(player.id), order => {
    player.deck.applyOrder(order);
  });
}

export class Rotom extends PokemonCard {
  public stage: Stage = Stage.BASIC;
  public cardType: CardType = P;
  public hp: number = 60;
  public weakness = [{ type: D }];
  public resistance = [{ type: F, value: -30 }];
  public retreat = [C];

  public attacks = [{
    name: 'Roto Call',
    cost: [C],
    damage: 0,
    text: 'You may search your deck for any number of Pokémon that have "Rotom" in their name and put them onto your Bench. Then, shuffle your deck.'
  },
  {
    name: 'Gadget Show',
    cost: [C, C],
    damage: 30,
    damageCalculation: 'x',
    text: 'This attack does 30 damage for each Pokémon Tool attached to all your Pokémon.'
  }];

  public regulationMark: string = 'I';
  public set: string = 'ASC';
  public cardImage: string = 'assets/cardback.png';
  public setNumber: string = '92';
  public name: string = 'Rotom';
  public fullName: string = 'Rotom M2a';

  public reduceEffect(store: StoreLike, state: State, effect: Effect): State {
    // Rotocall attack
    if (WAS_ATTACK_USED(effect, 0, this)) {
      const generator = useRotocall(() => generator.next(), store, state, effect);
      return generator.next().value;
    }

    // Gadget Show attack
    if (WAS_ATTACK_USED(effect, 1, this)) {
      const player = effect.player;
      let toolCount = 0;

      // Count tools on all player's Pokemon
      player.forEachPokemon(PlayerType.BOTTOM_PLAYER, (cardList) => {
        cardList.tools.forEach(card => {
          if (card instanceof TrainerCard && card.trainerType === TrainerType.TOOL) {
            toolCount++;
          }
        });
      });

      effect.damage = 30 * toolCount;
    }

    return state;
  }
}

