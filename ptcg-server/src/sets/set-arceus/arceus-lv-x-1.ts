import { GameError, GameMessage, PlayerType, PowerType, State, StateUtils, StoreLike } from '../../game';
import { CardTag, CardType, Stage, SuperType } from '../../game/store/card/card-types';
import { PokemonCard } from '../../game/store/card/pokemon-card';
import {CheckPokemonAttacksEffect, CheckPokemonPowersEffect, CheckPokemonStatsEffect, CheckTableStateEffect} from '../../game/store/effects/check-effects';
import { Effect } from '../../game/store/effects/effect';
import {IS_POKEBODY_BLOCKED, WAS_ATTACK_USED} from '../../game/store/prefabs/prefabs';
import {PlayPokemonEffect} from '../../game/store/effects/play-card-effects';
import {DISCARD_X_ENERGY_FROM_THIS_POKEMON} from '../../game/store/prefabs/costs';

export class ArceusLvX1 extends PokemonCard {
  public stage: Stage = Stage.LV_X;
  public evolvesFrom = 'Arceus';
  public cardType: CardType = C;
  public tags = [ CardTag.POKEMON_LV_X, CardTag.ARCEUS ];
  public hp: number = 120;
  public retreat = [ C ];

  public powers = [
    {
      name: 'LV.X Rule',
      powerType: PowerType.LV_X_RULE,
      text: 'Put this card onto your Active Arceus. Arceus LV.X can use any attack, Poké-Power, or Poké-Body from its previous Level.'
    },
    {
      name: 'Arceus Rule',
      powerType: PowerType.ARCEUS_RULE,
      text: 'You may have as many of this card in your deck as you like.'
    },
    {
      name: 'Multitype',
      powerType: PowerType.POKEBODY,
      text: 'Arceus LV.X\'s type is the same type as its previous Level.'
    },
  ];

  public attacks = [{
    name: 'Psychic Bolt',
    cost: [L, P, C],
    damage: 100,
    text: 'Discard a [L] Energy and a [P] Energy attached to Arceus.'
  }];

  public set: string = 'AR';
  public cardImage: string = 'assets/cardback.png';
  public setNumber: string = '96';
  public name: string = 'Arceus';
  public fullName: string = 'Arceus LV.X 1 AR';

  public reduceEffect(store: StoreLike, state: State, effect: Effect): State {
    // Multitype
    if (effect instanceof CheckPokemonStatsEffect && effect.target.getPokemonCard() === this) {
      const player = StateUtils.findOwner(state, effect.target);

      if (IS_POKEBODY_BLOCKED(store, state, player, this)){ return state; }

      effect.target.cards.forEach(card => {
        if (card instanceof PokemonCard && card.name === 'Arceus' && card !== this){
          effect.target.getPokemonCard()?.cardType === card.cardType;
        }
      });
    }

    // Psychic Bolt
    if (WAS_ATTACK_USED(effect, 0, this)){
      DISCARD_X_ENERGY_FROM_THIS_POKEMON(store, state, effect, 1, CardType.LIGHTNING);
      DISCARD_X_ENERGY_FROM_THIS_POKEMON(store, state, effect, 1, CardType.PSYCHIC);
    }

    // making sure it gets put on the active pokemon
    if (effect instanceof PlayPokemonEffect && effect.pokemonCard === this){
      if (effect.target !== effect.player.active){ throw new GameError(GameMessage.CANNOT_PLAY_THIS_CARD); }
    }
    
    // Trying to get all of the previous stage's attacks and powers
    if (effect instanceof CheckTableStateEffect) {
      const player = effect.player;
      const cardList = StateUtils.findCardList(state, this);
      const owner = StateUtils.findOwner(state, cardList);

      if (owner !== player) {
        return state;
      }

      let isThisInPlay = false;
      owner.forEachPokemon(PlayerType.BOTTOM_PLAYER, (cardList, card) => {
        if (card === this) {
          isThisInPlay = true;
          player.showAllStageAbilities = true;
        }
      });

      if (!isThisInPlay) {
        return state;
      }
    }

    if (effect instanceof CheckPokemonAttacksEffect) {
      const player = effect.player;
      const cardList = StateUtils.findCardList(state, this);
      const owner = StateUtils.findOwner(state, cardList);

      if (owner !== player) {
        return state;
      }

      let isThisInPlay = false;
      owner.forEachPokemon(PlayerType.BOTTOM_PLAYER, (cardList, card) => {
        if (card === this) {
          isThisInPlay = true;
        }
      });

      if (!isThisInPlay) {
        return state;
      }

      // Add attacks from the previous stage to this one
      for (const evolutionCard of cardList.cards) {
        if (evolutionCard.superType === SuperType.POKEMON && evolutionCard !== this && evolutionCard.name === this.evolvesFrom) {
          effect.attacks.push(...(evolutionCard.attacks || []));
        }
      }
    }

    if (effect instanceof CheckPokemonPowersEffect){
      const player = effect.player;
      const cardList = StateUtils.findCardList(state, this);
      const owner = StateUtils.findOwner(state, cardList);

      if (owner !== player) {
        return state;
      }

      let isThisInPlay = false;
      owner.forEachPokemon(PlayerType.BOTTOM_PLAYER, (cardList, card) => {
        if (card === this) {
          isThisInPlay = true;
        }
      });

      if (!isThisInPlay) {
        return state;
      }

      // Adds the powers from the previous stage
      for (const evolutionCard of cardList.cards) {
        if (evolutionCard.superType === SuperType.POKEMON && evolutionCard !== this && evolutionCard.name === this.evolvesFrom) {
          effect.powers.push(...(evolutionCard.powers || []));
        }
      }
    }

    return state;
  }
}