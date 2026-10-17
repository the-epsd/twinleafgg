import { PokemonCard } from '../../../game/store/card/pokemon-card';
import { CardType, Stage, SuperType } from '../../../game/store/card/card-types';
import { ChooseCardsPrompt, GameMessage, PowerType, State, StoreLike } from '../../../game';
import { Effect } from '../../../game/store/effects/effect';
import { CONFIRMATION_PROMPT, IS_POKEPOWER_BLOCKED, JUST_EVOLVED, MOVE_CARDS, WAS_ATTACK_USED } from '../../../game/store/prefabs/prefabs';

export class Ninjask extends PokemonCard {
  public stage: Stage = Stage.STAGE_1;
  public evolvesFrom: string = 'Nincada';
  public hp: number = 80;
  public cardType: CardType[] = [G];
  public weakness = [{ type: R, value: +20 }];
  public resistance = [{ type: F, value: -20 }];
  public retreat = [];

  public powers = [{
    name: 'Cast-off Shell',
    powerType: PowerType.POKEPOWER,
    text: 'Once during your turn, when you play Ninjask from your hand to evolve 1 of your Pokémon and if your Bench isn\'t full, you may put Shedinja onto your Bench as a Basic Pokémon from your hand or your discard pile.',
    useWhenInPlay: true
  }];

  public attacks = [{
    name: 'Chip Off',
    cost: [G],
    damage: 30,
    text: 'If your opponent has 6 or more cards in his or her hand, discard a number of cards without looking until your opponent has 5 cards left in his or her hand.'
  }];

  public set: string = 'LA';
  public cardImage: string = 'assets/cardback.png';
  public setNumber: string = '67';
  public name: string = 'Ninjask';
  public fullName: string = 'Ninjask LA';

  public reduceEffect(store: StoreLike, state: State, effect: Effect): State {
    // Cast-off Shell
    if (JUST_EVOLVED(effect, this) && !IS_POKEPOWER_BLOCKED(store, state, effect.player, this)) {
      const player = effect.player;
      if (player.bench.every(b => b.cards.length > 0)) {
        return state;
      }
      const openSlot = player.bench.find(b => b.cards.length === 0);
      if (!openSlot) {
        return state;
      }
      const hasShedinja = player.hand.cards.some(c => c instanceof PokemonCard && c.name === 'Shedinja')
        || player.discard.cards.some(c => c instanceof PokemonCard && c.name === 'Shedinja');
      if (!hasShedinja) {
        return state;
      }
      CONFIRMATION_PROMPT(store, state, player, wantToUse => {
        if (!wantToUse) {
          return;
        }
        const fromHand = player.hand.cards.some(c => c instanceof PokemonCard && c.name === 'Shedinja');
        const source = fromHand ? player.hand : player.discard;
        store.prompt(state, new ChooseCardsPrompt(
          player,
          GameMessage.CHOOSE_CARD_TO_PUT_ONTO_BENCH,
          source,
          { superType: SuperType.POKEMON, name: 'Shedinja' },
          { min: 1, max: 1, allowCancel: true },
        ), selected => {
          const cards = selected || [];
          if (cards.length === 0) {
            return;
          }
          MOVE_CARDS(store, state, source, openSlot, { cards, sourceCard: this });
          openSlot.pokemonPlayedTurn = state.turn;
        });
      }, GameMessage.WANT_TO_USE_ABILITY);
    }

    // Chip Off
    if (WAS_ATTACK_USED(effect, 0, this)) {
      const opponent = effect.opponent;
      if (opponent.hand.cards.length < 6) {
        return state;
      }
      while (opponent.hand.cards.length > 5) {
        const randomIndex = Math.floor(Math.random() * opponent.hand.cards.length);
        const randomCard = opponent.hand.cards[randomIndex];
        MOVE_CARDS(store, state, opponent.hand, opponent.discard, {
          cards: [randomCard],
          sourceCard: this,
        });
      }
    }

    return state;
  }
}
