import { PokemonCard } from '../../../game/store/card/pokemon-card';
import { CardTag, CardType, EnergyType, Stage, SuperType } from '../../../game/store/card/card-types';
import { CardList, EnergyCard, GameError, GameMessage, PlayerType, State, StateUtils, StoreLike } from '../../../game';
import { Effect } from '../../../game/store/effects/effect';
import { CheckPokemonAttacksEffect, CheckPokemonPowersEffect, CheckTableStateEffect } from '../../../game/store/effects/check-effects';
import { PlayPokemonEffect } from '../../../game/store/effects/play-card-effects';
import { MOVE_CARDS, SHOW_CARDS_TO_PLAYER, SHUFFLE_DECK, WAS_ATTACK_USED } from '../../../game/store/prefabs/prefabs';

export class RhyperiorLVX extends PokemonCard {
  public stage: Stage = Stage.LV_X;
  protected _tags = [CardTag.POKEMON_LV_X];
  public evolvesFrom: string = 'Rhyperior';
  public hp: number = 170;
  public cardType: CardType[] = [F];
  public weakness = [{ type: W, value: +30 }];
  public resistance = [{ type: L, value: -20 }];
  public retreat = [C, C, C, C];

  public attacks = [{
    name: 'Hard Crush',
    cost: [],
    damage: 50,
    damageCalculation: 'x',
    text: 'Discard the top 5 cards from your deck. This attack does 50 damage for each Energy card you discarded.'
  },
  {
    name: 'Upthrow',
    cost: [F, F, C],
    damage: 60,
    text: 'Search your discard pile for all Fighting Energy cards, show them to your opponent, and shuffle them into your deck.'
  }];

  public set: string = 'LA';
  public cardImage: string = 'assets/cardback.png';
  public setNumber: string = '145';
  public name: string = 'Rhyperior';
  public fullName: string = 'Rhyperior LV.X LA';

  public reduceEffect(store: StoreLike, state: State, effect: Effect): State {
    if (effect instanceof PlayPokemonEffect && effect.pokemonCard === this) {
      if (effect.target !== effect.player.active) {
        throw new GameError(GameMessage.CANNOT_PLAY_THIS_CARD);
      }
    }

    // Hard Crush
    if (WAS_ATTACK_USED(effect, 0, this)) {
      const player = effect.player;
      const discarded = new CardList();
      const count = Math.min(5, player.deck.cards.length);
      MOVE_CARDS(store, state, player.deck, discarded, { count, sourceCard: this, sourceEffect: effect });
      const energyCount = discarded.cards.filter(c => c.superType === SuperType.ENERGY).length;
      discarded.cards.forEach(c => {
        MOVE_CARDS(store, state, discarded, player.discard, { cards: [c], sourceCard: this, sourceEffect: effect });
      });
      effect.damage = energyCount * 50;
    }

    // Upthrow
    if (WAS_ATTACK_USED(effect, 1, this)) {
      const player = effect.player;
      const opponent = StateUtils.getOpponent(state, player);
      const fightingEnergy = player.discard.cards.filter(
        c => c instanceof EnergyCard &&
          c.energyType === EnergyType.BASIC &&
          c.name === 'Fighting Energy',
      );
      if (fightingEnergy.length === 0) {
        return state;
      }
      SHOW_CARDS_TO_PLAYER(store, state, opponent, fightingEnergy);
      fightingEnergy.forEach(card => {
        MOVE_CARDS(store, state, player.discard, player.deck, { cards: [card], sourceCard: this, sourceEffect: effect });
      });
      SHUFFLE_DECK(store, state, player);
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
