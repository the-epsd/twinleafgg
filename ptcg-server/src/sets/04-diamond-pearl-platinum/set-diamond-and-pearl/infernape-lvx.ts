import { PokemonCard } from '../../../game/store/card/pokemon-card';
import { CardTag, CardType, EnergyType, Stage, SuperType } from '../../../game/store/card/card-types';
import { CardList, ChooseCardsPrompt, EnergyCard, GameError, GameMessage, PlayerType, PowerType, State, StateUtils, StoreLike } from '../../../game';
import { Effect } from '../../../game/store/effects/effect';
import { PlayPokemonEffect } from '../../../game/store/effects/play-card-effects';
import { CheckPokemonAttacksEffect, CheckPokemonPowersEffect, CheckTableStateEffect } from '../../../game/store/effects/check-effects';
import { ABILITY_USED, ADD_MARKER, BLOCK_IF_HAS_SPECIAL_CONDITION, HAS_MARKER, IS_POKEPOWER_BLOCKED, MOVE_CARDS, REMOVE_MARKER_AT_END_OF_TURN, SHOW_CARDS_TO_PLAYER, SHUFFLE_DECK, WAS_ATTACK_USED, WAS_POWER_USED } from '../../../game/store/prefabs/prefabs';

export class InfernapeLVX extends PokemonCard {
  public stage: Stage = Stage.LV_X;
  public evolvesFrom: string = 'Infernape';
  protected _tags = [CardTag.POKEMON_LV_X];
  public hp: number = 120;
  public cardType: CardType[] = [R];
  public weakness = [{ type: W, value: +30 }];
  public retreat = [];

  public powers = [{
    name: 'Burning Head',
    powerType: PowerType.POKEPOWER,
    useWhenInPlay: true,
    text: 'Once during your turn (before your attack), you may look at the top 3 cards of your deck, choose 1 of them, and put it into your hand. Discard the other 2 cards. This power can\'t be used if Infernape is affected by a Special Condition.',
  }];

  public attacks = [{
    name: 'Flare Up',
    cost: [R, R],
    damage: 150,
    text: 'Search your discard pile for 8 Fire Energy cards, show them to your opponent, and shuffle them into your deck. (This attack does nothing if you don\'t have 8 Fire Energy cards in your discard pile.)',
  }];

  public set: string = 'DP';
  public cardImage: string = 'assets/cardback.png';
  public setNumber: string = '121';
  public name: string = 'Infernape';
  public fullName: string = 'Infernape LV.X DP';

  public readonly ABILITY_USED_MARKER = 'ABILITY_USED_MARKER';

  public reduceEffect(store: StoreLike, state: State, effect: Effect): State {
    REMOVE_MARKER_AT_END_OF_TURN(effect, this.ABILITY_USED_MARKER, this);

    // Burning Head
    if (WAS_POWER_USED(effect, 0, this)) {
      const player = effect.player;

      if (IS_POKEPOWER_BLOCKED(store, state, player, this)) {
        throw new GameError(GameMessage.BLOCKED_BY_EFFECT);
      }
      BLOCK_IF_HAS_SPECIAL_CONDITION(player, this);

      if (HAS_MARKER(this.ABILITY_USED_MARKER, player, this)) {
        throw new GameError(GameMessage.POWER_ALREADY_USED);
      }
      if (player.deck.cards.length === 0) {
        throw new GameError(GameMessage.CANNOT_USE_POWER);
      }

      ADD_MARKER(this.ABILITY_USED_MARKER, player, this);
      ABILITY_USED(player, this);

      const deckTop = new CardList();
      MOVE_CARDS(store, state, player.deck, deckTop, {
        count: Math.min(3, player.deck.cards.length),
        sourceCard: this,
      });

      return store.prompt(state, new ChooseCardsPrompt(
        player,
        GameMessage.CHOOSE_CARD_TO_HAND,
        deckTop,
        {},
        { min: 1, max: 1, allowCancel: false }
      ), selected => {
        MOVE_CARDS(store, state, deckTop, player.hand, { cards: selected || [], sourceCard: this });
        MOVE_CARDS(store, state, deckTop, player.discard, { sourceCard: this });
      });
    }

    // Flare Up
    if (WAS_ATTACK_USED(effect, 0, this)) {
      const player = effect.player;
      const opponent = StateUtils.getOpponent(state, player);

      const fireEnergy = player.discard.cards.filter(c =>
        c instanceof EnergyCard &&
        c.energyType === EnergyType.BASIC &&
        c.provides.includes(CardType.FIRE)
      );

      if (fireEnergy.length < 8) {
        effect.damage = 0;
        return state;
      }

      const blocked: number[] = [];
      player.discard.cards.forEach((card, index) => {
        if (!(card instanceof EnergyCard) ||
          card.energyType !== EnergyType.BASIC ||
          !card.provides.includes(CardType.FIRE)) {
          blocked.push(index);
        }
      });

      return store.prompt(state, new ChooseCardsPrompt(
        player,
        GameMessage.CHOOSE_CARD_TO_DECK,
        player.discard,
        { superType: SuperType.ENERGY },
        { min: 8, max: 8, allowCancel: false, blocked }
      ), selected => {
        const cards = selected || [];
        if (cards.length < 8) {
          effect.damage = 0;
          return;
        }
        SHOW_CARDS_TO_PLAYER(store, state, opponent, cards);
        MOVE_CARDS(store, state, player.discard, player.deck, { cards, sourceCard: this });
        SHUFFLE_DECK(store, state, player);
      });
    }

    // Lv.X must be played onto Active
    if (effect instanceof PlayPokemonEffect && effect.pokemonCard === this) {
      if (effect.target !== effect.player.active) {
        throw new GameError(GameMessage.CANNOT_PLAY_THIS_CARD);
      }
    }

    // Inherit previous stage attacks / powers
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
