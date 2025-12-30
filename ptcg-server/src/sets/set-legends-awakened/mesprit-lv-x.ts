import { PokemonCard, Stage, StoreLike, State, GameMessage, StateUtils, CardTag, PlayerType, SuperType, GameError } from '../../game';
import { CheckPokemonAttacksEffect, CheckPokemonPowersEffect, CheckTableStateEffect } from '../../game/store/effects/check-effects';
import { Effect } from '../../game/store/effects/effect';
import { HealEffect } from '../../game/store/effects/game-effects';
import { PlayPokemonEffect } from '../../game/store/effects/play-card-effects';
import { WAS_ATTACK_USED, AFTER_ATTACK, DISCARD_ALL_ENERGY_FROM_POKEMON } from '../../game/store/prefabs/prefabs';

export class MespritLVX extends PokemonCard {
  public stage = Stage.LV_X;
  public evolvesFrom = 'Mesprit';
  public tags = [CardTag.POKEMON_LV_X];
  public cardType = P;
  public hp = 90;
  public weakness = [{ type: P }];
  public retreat = [C];

  public attacks = [{
    name: 'Healing Look',
    cost: [],
    damage: 0,
    text: 'Remove 3 damage counters from each of your Benched Pokémon.'
  }, {
    name: 'Supreme Blast',
    cost: [P, P],
    damage: 200,
    text: 'If don\'t have Uxie LV.X and Azelf LV.X in play, this attack does nothing. Discard all Energy attached to Mesprit.'
  }];

  public set: string = 'LA';
  public cardImage: string = 'assets/cardback.png';
  public setNumber: string = '143';
  public name: string = 'Mesprit';
  public fullName: string = 'Mesprit Lv. X LA';

  public reduceEffect(store: StoreLike, state: State, effect: Effect): State {

    // Healing Look
    if (AFTER_ATTACK(effect, 0, this)) {
      const player = effect.player;

      player.forEachPokemon(PlayerType.BOTTOM_PLAYER, card => {
        if (card !== player.active) {
          const healEffect = new HealEffect(player, card, 30);
          store.reduceEffect(state, healEffect);
        }
      });
    }

    // Supreme Blast
    if (WAS_ATTACK_USED(effect, 1, this)) {
      const player = effect.player;

      let isMespritInPlay = false;
      let isUxieInPlay = false;
      let isAzelfInPlay = false;
      player.forEachPokemon(PlayerType.BOTTOM_PLAYER, (cardList, card) => {
        if (card === this) {
          isMespritInPlay = true;
        } else if (card.name === 'Uxie' && card.stage === Stage.LV_X) {
          isUxieInPlay = true;
        } else if (card.name === 'Azelf' && card.stage === Stage.LV_X) {
          isAzelfInPlay = true;
        }
      });

      let isTrioInPlay = isMespritInPlay && isUxieInPlay && isAzelfInPlay;

      if (!isTrioInPlay) {
        effect.damage = 0;
        return state;
      }

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