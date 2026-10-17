import { PokemonCard } from '../../../game/store/card/pokemon-card';
import { CardType, EnergyType, Stage, SuperType } from '../../../game/store/card/card-types';
import { ChooseCardsPrompt, EnergyCard, GameMessage, PokemonCardList, State, StoreLike } from '../../../game';
import { Effect } from '../../../game/store/effects/effect';
import { AttachEnergyEffect, PlayPokemonFromDeckEffect } from '../../../game/store/effects/play-card-effects';
import { BLOCK_RETREAT } from '../../../game/store/prefabs/effect-of-attack-prefabs';
import { YOUR_OPPPONENTS_ACTIVE_POKEMON_IS_NOW_CONFUSED } from '../../../game/store/prefabs/attack-effects';
import { COIN_FLIP_PROMPT, MOVE_CARDS, SEARCH_DISCARD_PILE_FOR_CARDS_TO_HAND, SHUFFLE_DECK, WAS_ATTACK_USED } from '../../../game/store/prefabs/prefabs';

export class Drifblim extends PokemonCard {
  public stage: Stage = Stage.STAGE_1;
  public evolvesFrom: string = 'Drifloon';
  public hp: number = 90;
  public cardType: CardType[] = [P];
  public weakness = [{ type: D, value: +20 }];
  public resistance = [{ type: C, value: -20 }];
  public retreat = [];

  public attacks = [{
    name: 'Delivery',
    cost: [],
    damage: 0,
    text: 'Put any 1 card from your discard pile into your hand.'
  },
  {
    name: 'Lifting',
    cost: [],
    damage: 0,
    text: 'Search your deck for up to 2 Basic Pokémon and put them onto your Bench. For each Basic Pokémon you put onto your Bench, you may search your deck for a basic Energy card and attach it to that Pokémon. Shuffle your deck afterward.'
  },
  {
    name: 'Ominous Wind',
    cost: [P, C],
    damage: 40,
    text: 'Flip a coin. If heads, the Defending Pokémon is now Confused and can\'t retreat during your opponent\'s next turn.'
  }];

  public set: string = 'SF';
  public cardImage: string = 'assets/cardback.png';
  public setNumber: string = '16';
  public name: string = 'Drifblim';
  public fullName: string = 'Drifblim SF';

  public reduceEffect(store: StoreLike, state: State, effect: Effect): State {
    // Delivery
    if (WAS_ATTACK_USED(effect, 0, this)) {
      SEARCH_DISCARD_PILE_FOR_CARDS_TO_HAND(store, state, effect.player, this, {}, { min: 0, max: 1, allowCancel: true });
    }

    // Lifting
    if (WAS_ATTACK_USED(effect, 1, this)) {
      const player = effect.player;
      const slots: PokemonCardList[] = player.bench.filter(b => b.cards.length === 0);
      const max = Math.min(slots.length, 2);
      if (max === 0 || player.deck.cards.length === 0) {
        return state;
      }

      return store.prompt(state, new ChooseCardsPrompt(
        player,
        GameMessage.CHOOSE_CARD_TO_PUT_ONTO_BENCH,
        player.deck,
        { superType: SuperType.POKEMON, stage: Stage.BASIC },
        { min: 0, max, allowCancel: true },
      ), selected => {
        const cards = selected || [];
        const filledSlots: PokemonCardList[] = [];
        cards.forEach((card, index) => {
          if (index < slots.length) {
            store.reduceEffect(state, new PlayPokemonFromDeckEffect(player, card as PokemonCard, slots[index]));
            filledSlots.push(slots[index]);
          }
        });

        const attachEnergyToSlot = (slotIndex: number) => {
          if (slotIndex >= filledSlots.length) {
            SHUFFLE_DECK(store, state, player);
            return;
          }
          const slot = filledSlots[slotIndex];
          if (player.deck.cards.length === 0) {
            attachEnergyToSlot(slotIndex + 1);
            return;
          }
          store.prompt(state, new ChooseCardsPrompt(
            player,
            GameMessage.ATTACH_ENERGY_CARDS,
            player.deck,
            { superType: SuperType.ENERGY, energyType: EnergyType.BASIC },
            { min: 0, max: 1, allowCancel: true },
          ), energySelected => {
            const energyCards = energySelected || [];
            if (energyCards.length > 0) {
              const energyCard = energyCards[0];
              MOVE_CARDS(store, state, player.deck, slot, { cards: [energyCard], sourceCard: this });
              store.reduceEffect(state, new AttachEnergyEffect(player, energyCard as EnergyCard, slot));
            }
            attachEnergyToSlot(slotIndex + 1);
          });
        };
        attachEnergyToSlot(0);
      });
    }

    // Ominous Wind
    if (WAS_ATTACK_USED(effect, 2, this)) {
      COIN_FLIP_PROMPT(store, state, effect.player, result => {
        if (result) {
          YOUR_OPPPONENTS_ACTIVE_POKEMON_IS_NOW_CONFUSED(store, state, effect);
          BLOCK_RETREAT(store, state, effect, this);
        }
      });
    }

    return state;
  }
}
