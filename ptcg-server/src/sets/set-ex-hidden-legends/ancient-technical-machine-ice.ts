import { Attack, CardTarget, ChoosePokemonPrompt, GameError, GameMessage, PlayerType, SlotType, StateUtils } from '../../game';
import { CardTag, CardType, TrainerType } from '../../game/store/card/card-types';
import { ColorlessCostReducer } from '../../game/store/card/pokemon-interface';
import { TrainerCard } from '../../game/store/card/trainer-card';
import { CheckAttackCostEffect, CheckPokemonAttacksEffect, CheckTableStateEffect } from '../../game/store/effects/check-effects';
import { Effect } from '../../game/store/effects/effect';

import { EndTurnEffect } from '../../game/store/effects/game-phase-effects';
import { WAS_TRAINER_USED } from '../../game/store/prefabs/trainer-prefabs';
import { State } from '../../game/store/state/state';
import { StoreLike } from '../../game/store/store-like';
import { AttackEffect } from '../../game/store/effects/game-effects';
import { CLEAR_MARKER_AND_OPPONENTS_POKEMON_MARKER_AT_END_OF_TURN, MOVE_CARDS, PREVENT_DAMAGE } from '../../game/store/prefabs/prefabs';
import { MarkerConstants } from '../../game/store/markers/marker-constants';
import { AbstractAttackEffect } from '../../game/store/effects/attack-effects';

export class AncientTechnicalMachineIce extends TrainerCard {
  public trainerType: TrainerType = TrainerType.ITEM;
  public tags = [CardTag.TECHNICAL_MACHINE];
  public set: string = 'HL';
  public cardImage: string = 'assets/cardback.png';
  public setNumber: string = '84';
  public name: string = 'Ancient Technical Machine [Ice]';
  public fullName: string = 'Ancient Technical Machine [Ice] HL';

  public attacks: Attack[] = [{
    name: 'Ice Generator',
    cost: [C],
    damage: 0,
    text: 'Discard all of your opponent\'s Trainer cards in play. If you do, prevent all effects, including damage, done to the Pokémon using this attack during your opponent\'s next turn.'
  }];

  public text: string =
    'Attach this card to 1 of your Evolved Pokémon (excluding Pokémon-ex and Pokémon that has an owner in its name) in play. That Pokémon may use this card\'s attack instead of its own. At the end of your turn, discard Ancient Technical Machine [Ice].';

  public reduceEffect(store: StoreLike, state: State, effect: Effect): State {

    if (WAS_TRAINER_USED(effect, this)) {
      const player = effect.player;

      // Find slots to attach TM
      const blocked: CardTarget[] = [];
      let eligibleCount = 0;
      player.forEachPokemon(PlayerType.BOTTOM_PLAYER, (cardList, card, index) => {
        if (cardList.getPokemons().length < 2 || card.tags.includes(CardTag.POKEMON_ex)) {
          blocked.push(index);
        } else {
          eligibleCount++;
        }
      });

      // Error if no slots
      if (eligibleCount === 0) {
        throw new GameError(GameMessage.CANNOT_PLAY_THIS_CARD);
      }

      state = store.prompt(state, new ChoosePokemonPrompt(
        player.id,
        GameMessage.CHOOSE_POKEMON_TO_ATTACH_CARDS,
        PlayerType.BOTTOM_PLAYER,
        [SlotType.BENCH, SlotType.ACTIVE],
        { min: 1, max: 1, allowCancel: false, blocked },
      ), transfers => {
        player.supporter.moveCardTo(effect.trainerCard, transfers[0]);
      });
    }

    if (effect instanceof EndTurnEffect) {
      const player = effect.player;

      player.forEachPokemon(PlayerType.BOTTOM_PLAYER, (cardList, card, index) => {
        if (cardList.cards.includes(this)) {
          cardList.moveCardTo(this, player.discard);

        }
      });
    }

    if (effect instanceof CheckTableStateEffect) {
      state.players.forEach(player => {
        player.forEachPokemon(PlayerType.BOTTOM_PLAYER, cardList => {
          if (!cardList.cards.includes(this)) {
            return;
          }

          const attachedTo = cardList.getPokemonCard();

          if (!!attachedTo && (attachedTo.tags.includes(CardTag.POKEMON_ex) || cardList.getPokemons().length < 2)) {
            cardList.moveCardTo(this, player.discard);
          }
        });
      });
    }

    if (effect instanceof CheckAttackCostEffect && effect.attack === this.attacks[0]) {
      const pokemonCard = effect.player.active.getPokemonCard();
      if (pokemonCard && 'getColorlessReduction' in pokemonCard) {
        const reduction = (pokemonCard as ColorlessCostReducer).getColorlessReduction(state);
        for (let i = 0; i < reduction && effect.cost.includes(CardType.COLORLESS); i++) {
          const index = effect.cost.indexOf(CardType.COLORLESS);
          if (index !== -1) {
            effect.cost.splice(index, 1);
          }
        }
      }
    }

    if (effect instanceof CheckPokemonAttacksEffect && effect.player.active.cards.includes(this) &&
      !effect.attacks.includes(this.attacks[0])) {
      effect.attacks.push(this.attacks[0]);
    }

    if (effect instanceof AttackEffect && effect.attack === this.attacks[0]) {
      const player = effect.player;
      const opponent = StateUtils.getOpponent(state, player);

      PREVENT_DAMAGE(store, state, effect, this);

      // Discard stadium if it is opponent's
      if (opponent.stadium.cards.length > 0) {
        MOVE_CARDS(store, state, opponent.stadium, opponent.discard, { cards: opponent.stadium.cards });
      }

      // Discard all of opponent's Trainer cards in play
      opponent.forEachPokemon(PlayerType.TOP_PLAYER, cardList => {
        const topPokemon = cardList.getPokemonCard() as unknown as TrainerCard | undefined;
        const pokemonsInStack = cardList.getPokemons();
        const trainerCards = cardList.cards.filter(c => c instanceof TrainerCard);
        const tools = cardList.tools.slice();

        // Tools are Trainer cards in play and should always be discarded.
        if (tools.length > 0) {
          MOVE_CARDS(store, state, cardList, opponent.discard, { cards: tools });
        }

        for (const card of trainerCards) {
          // Fossil (or similar trainer) currently acting as the Pokemon in play:
          // discard the whole card list.
          if (card === topPokemon) {
            const allCards = cardList.cards.slice();
            if (allCards.length > 0) {
              MOVE_CARDS(store, state, cardList, opponent.discard, { cards: allCards });
            }
            break;
          }

          // Trainer card that appears in the Pokemon stack but is not the top Pokemon
          // should not be discarded by this attack.
          if (pokemonsInStack.some(pokemon => (pokemon as unknown as TrainerCard) === card)) {
            continue;
          }

          MOVE_CARDS(store, state, cardList, opponent.discard, { cards: [card] });
        }
      });
    }

    if (effect instanceof AbstractAttackEffect) {
      const opponent = StateUtils.getOpponent(state, effect.player);
      const sourceCard = effect.source.getPokemonCard();

      if (sourceCard && opponent.active.marker.hasMarker(MarkerConstants.PREVENT_DAMAGE_DURING_OPPONENTS_NEXT_TURN_MARKER, this)) {
        effect.preventDefault = true;
      }
    }

    CLEAR_MARKER_AND_OPPONENTS_POKEMON_MARKER_AT_END_OF_TURN(state, effect, MarkerConstants.CLEAR_PREVENT_DAMAGE_DURING_OPPONENTS_NEXT_TURN_MARKER, MarkerConstants.PREVENT_DAMAGE_DURING_OPPONENTS_NEXT_TURN_MARKER, this);

    return state;
  }
}