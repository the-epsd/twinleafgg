import { PokemonCard, Stage, PowerType, StoreLike, State, GameMessage, StateUtils, CardTag, PlayerType, SuperType, GameError } from '../../game';
import { AbstractAttackEffect } from '../../game/store/effects/attack-effects';
import { CheckPokemonAttacksEffect, CheckPokemonPowersEffect, CheckTableStateEffect } from '../../game/store/effects/check-effects';
import { Effect } from '../../game/store/effects/effect';
import { PlayPokemonEffect } from '../../game/store/effects/play-card-effects';
import { DISCARD_ALL_ENERGY_FROM_POKEMON, IS_POKEBODY_BLOCKED, WAS_ATTACK_USED } from '../../game/store/prefabs/prefabs';

export class MewtwoLVX extends PokemonCard {
  public stage = Stage.LV_X;
  public evolvesFrom = 'Mewtwo';
  public tags = [CardTag.POKEMON_LV_X];
  public cardType = P;
  public hp = 120;
  public weakness = [{ type: P }];
  public retreat = [C, C];

  public powers = [{
    name: 'Psybarrier',
    powerType: PowerType.POKEBODY,
    text: 'Prevent all effects of attacks, including damage, done to Mewtwo by your opponent\'s Pokémon that isn\'t an Evolved Pokémon.'
  }];

  public attacks = [{
    name: 'Giga Burn',
    cost: [P, P, C],
    damage: 120,
    text: 'Discard all Energy attached to Mewtwo.'
  }];

  public set: string = 'LA';
  public cardImage: string = 'assets/cardback.png';
  public setNumber: string = '144';
  public name: string = 'Mewtwo';
  public fullName: string = 'Mewtwo Lv. X LA';

  public reduceEffect(store: StoreLike, state: State, effect: Effect): State {

    // Prevent effects of attacks, including damage
    if (effect instanceof AbstractAttackEffect && effect.target.getPokemonCard() === this) {
      const pokemonCard = effect.target.getPokemonCard();
      const sourceCard = effect.source.getPokemonCard();

      if (pokemonCard !== this) {
        return state;
      }

      if (!(effect.source.getPokemons().length > 1 && !sourceCard?.tags.includes(CardTag.LEGEND) && !sourceCard?.tags.includes(CardTag.POKEMON_VUNION))) {
        const player = StateUtils.findOwner(state, effect.target);
        if (IS_POKEBODY_BLOCKED(store, state, player, this)) {
          return state;
        }

        effect.preventDefault = true;
      }
    }

    if (WAS_ATTACK_USED(effect, 0, this)) {
      DISCARD_ALL_ENERGY_FROM_POKEMON(store, state, effect, this);
    }

    //Lv. X Stuff
    // making sure it gets put on the active pokemon
    if (effect instanceof PlayPokemonEffect && effect.pokemonCard === this) {
      if (effect.target !== effect.player.active) { throw new GameError(GameMessage.CANNOT_PLAY_THIS_CARD); }
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

    if (effect instanceof CheckPokemonPowersEffect) {
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