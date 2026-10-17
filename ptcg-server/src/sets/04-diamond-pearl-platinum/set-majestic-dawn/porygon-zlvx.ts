import { CardList, ChooseCardsPrompt, EnergyCard, GameError, GameMessage, OrderCardsPrompt, PlayerType, PokemonCard, PowerType, State, StateUtils, StoreLike, SuperType } from '../../../game';
import { CardTag, CardType, EnergyType, Stage } from '../../../game/store/card/card-types';
import { Effect } from '../../../game/store/effects/effect';
import { CheckPokemonAttacksEffect, CheckPokemonPowersEffect, CheckTableStateEffect } from '../../../game/store/effects/check-effects';
import { PlayPokemonEffect } from '../../../game/store/effects/play-card-effects';
import { ABILITY_USED, BLOCK_IF_HAS_SPECIAL_CONDITION, CONFIRMATION_PROMPT, IS_POKEPOWER_BLOCKED, MOVE_CARDS, REMOVE_MARKER_AT_END_OF_TURN, SHUFFLE_DECK, USE_ABILITY_ONCE_PER_TURN, WAS_POWER_USED } from '../../../game/store/prefabs/prefabs';

export class PorygonZLVX extends PokemonCard {
  public stage: Stage = Stage.LV_X;
  protected _tags = [CardTag.POKEMON_LV_X];
  public evolvesFrom: string = 'Porygon-Z';
  public hp: number = 130;
  public cardType: CardType[] = [C];
  public weakness = [{ type: F, value: +20 }];
  public retreat = [C, C];

  public powers = [{
    name: 'Mode Crash',
    powerType: PowerType.POKEPOWER,
    text: 'Once during your turn (before your attack), when you put Porygon-Z LV.X from your hand onto your Active Porygon-Z, you may discard all of your opponent\'s Special Energy cards in play.',
    useWhenInPlay: true
  },
  {
    name: 'Decode',
    powerType: PowerType.POKEPOWER,
    text: 'Once during your turn (before your attack), you may search your deck for up to any 2 cards and shuffle your deck afterward. Then, put those cards on top of your deck in any order. This power can\'t be used if Porygon-Z is affected by a Special Condition.',
    useWhenInPlay: true
  }];

  public set: string = 'MD';
  public cardImage: string = 'assets/cardback.png';
  public setNumber: string = '100';
  public name: string = 'Porygon-Z LV.X';
  public fullName: string = 'Porygon-Z LV.X MD';

  public readonly DECODE_MARKER = 'DECODE_MARKER';

  public reduceEffect(store: StoreLike, state: State, effect: Effect): State {
    REMOVE_MARKER_AT_END_OF_TURN(effect, this.DECODE_MARKER, this);

    if (effect instanceof PlayPokemonEffect && effect.pokemonCard === this) {
      if (effect.target !== effect.player.active) {
        throw new GameError(GameMessage.CANNOT_PLAY_THIS_CARD);
      }
    }

    // Mode Crash
    if (effect instanceof PlayPokemonEffect && effect.pokemonCard === this) {
      const player = effect.player;
      const opponent = StateUtils.getOpponent(state, player);

      if (IS_POKEPOWER_BLOCKED(store, state, player, this)) {
        return state;
      }

      CONFIRMATION_PROMPT(store, state, player, wantToUse => {
        if (!wantToUse) {
          return;
        }

        opponent.forEachPokemon(PlayerType.BOTTOM_PLAYER, (cardList) => {
          const specialEnergy = cardList.cards.filter(
            c => c instanceof EnergyCard && c.energyType === EnergyType.SPECIAL,
          );
          if (specialEnergy.length > 0) {
            MOVE_CARDS(store, state, cardList, opponent.discard, {
              cards: specialEnergy,
              sourceCard: this,
              sourceEffect: this.powers[0],
            });
          }
        });
      }, GameMessage.WANT_TO_USE_ABILITY);
    }

    // Decode
    if (WAS_POWER_USED(effect, 1, this)) {
      const player = effect.player;
      if (IS_POKEPOWER_BLOCKED(store, state, player, this)) {
        throw new GameError(GameMessage.BLOCKED_BY_EFFECT);
      }
      BLOCK_IF_HAS_SPECIAL_CONDITION(player, this);

      if (player.deck.cards.length === 0) {
        throw new GameError(GameMessage.CANNOT_USE_POWER);
      }

      USE_ABILITY_ONCE_PER_TURN(player, this.DECODE_MARKER, this);
      ABILITY_USED(player, this);

      const deckTop = new CardList();
      const maxPick = Math.min(2, player.deck.cards.length);

      return store.prompt(state, new ChooseCardsPrompt(
        player,
        GameMessage.CHOOSE_CARD_TO_DECK,
        player.deck,
        {},
        { min: 0, max: maxPick, allowCancel: false },
      ), selected => {
        const cards = selected || [];
        MOVE_CARDS(store, state, player.deck, deckTop, { cards, sourceCard: this, sourceEffect: this.powers[1] });
        SHUFFLE_DECK(store, state, player);

        if (deckTop.cards.length === 0) {
          return;
        }

        store.waitPrompt(state, () => {
          store.prompt(state, new OrderCardsPrompt(
            player.id,
            GameMessage.CHOOSE_CARDS_ORDER,
            deckTop,
            { allowCancel: false },
          ), order => {
            if (order === null) {
              return;
            }
            deckTop.applyOrder(order);
            deckTop.moveToTopOfDestination(player.deck);
          });
        });
      });
    }

    if (effect instanceof CheckTableStateEffect) {
      const player = effect.player;
      const cardList = StateUtils.findCardList(state, this);
      const owner = StateUtils.findOwner(state, cardList);
      if (owner !== player) {
        return state;
      }
      owner.forEachPokemon(PlayerType.BOTTOM_PLAYER, (_cardList, card) => {
        if (card === this) {
          player.showAllStageAbilities = true;
        }
      });
    }

    if (effect instanceof CheckPokemonAttacksEffect) {
      const player = effect.player;
      const cardList = StateUtils.findCardList(state, this);
      const owner = StateUtils.findOwner(state, cardList);
      if (owner !== player) {
        return state;
      }
      let isThisInPlay = false;
      owner.forEachPokemon(PlayerType.BOTTOM_PLAYER, (_cardList, card) => {
        if (card === this) {
          isThisInPlay = true;
        }
      });
      if (!isThisInPlay) {
        return state;
      }
      for (const evolutionCard of cardList.cards) {
        if (
          evolutionCard.superType === SuperType.POKEMON &&
          evolutionCard !== this &&
          evolutionCard.name === this.evolvesFrom
        ) {
          effect.attacks.push(...(evolutionCard.attacks || []));
        }
      }
    }

    if (effect instanceof CheckPokemonPowersEffect) {
      const player = effect.player;
      const cardList = StateUtils.findCardList(state, this);
      const owner = StateUtils.findOwner(state, cardList);
      if (owner !== player) {
        return state;
      }
      let isThisInPlay = false;
      owner.forEachPokemon(PlayerType.BOTTOM_PLAYER, (_cardList, card) => {
        if (card === this) {
          isThisInPlay = true;
        }
      });
      if (!isThisInPlay) {
        return state;
      }
      for (const evolutionCard of cardList.cards) {
        if (
          evolutionCard.superType === SuperType.POKEMON &&
          evolutionCard !== this &&
          evolutionCard.name === this.evolvesFrom
        ) {
          effect.powers.push(...(evolutionCard.powers || []));
        }
      }
    }

    return state;
  }
}
