import { PokemonCard } from '../../../game/store/card/pokemon-card';
import { CardTag, CardType, EnergyType, SpecialCondition, Stage, SuperType } from '../../../game/store/card/card-types';
import { EnergyCard, GameError, GameMessage, PlayerType, PowerType, State, StateUtils, StoreLike } from '../../../game';
import { Effect } from '../../../game/store/effects/effect';
import { DealDamageEffect } from '../../../game/store/effects/attack-effects';
import { CheckPokemonAttacksEffect, CheckPokemonPowersEffect, CheckPokemonTypeEffect, CheckTableStateEffect } from '../../../game/store/effects/check-effects';
import { KnockOutEffect } from '../../../game/store/effects/game-effects';
import { BetweenTurnsEffect } from '../../../game/store/effects/game-phase-effects';
import { PlayPokemonEffect } from '../../../game/store/effects/play-card-effects';
import { YOUR_OPPPONENTS_ACTIVE_POKEMON_IS_NOW_ASLEEP } from '../../../game/store/prefabs/attack-effects';
import { ADD_MARKER, HAS_MARKER, IS_POKEBODY_BLOCKED, MULTIPLE_COIN_FLIPS_PROMPT, REMOVE_MARKER, WAS_ATTACK_USED } from '../../../game/store/prefabs/prefabs';

export class DarkraiLVX extends PokemonCard {
  public stage: Stage = Stage.LV_X;
  protected _tags = [CardTag.POKEMON_LV_X];
  public evolvesFrom: string = 'Darkrai';
  public hp: number = 100;
  public cardType: CardType[] = [D];
  public weakness = [{ type: F }];
  public resistance = [{ type: P, value: -20 }];
  public retreat = [C];

  public powers = [{
    name: 'Dark Shadow',
    powerType: PowerType.POKEBODY,
    text: 'Each basic Darkness Energy card attached to your Darkness Pokémon now has the effect "If the Pokémon Darkness Energy is attached to attacks, the attack does 10 more damage to the Active Pokémon (before applying Weakness and Resistance)." You can\'t use more than 1 Dark Shadow Poké-Body each turn.'
  }];

  public attacks = [{
    name: 'Endless Darkness',
    cost: [D, D, C],
    damage: 40,
    text: 'The Defending Pokémon is now Asleep. Flip 2 coins instead of 1 between turns. If either of them is tails, the Defending Pokémon is still Asleep. If both of them are tails, the Defending Pokémon is Knocked Out.'
  }];

  public set: string = 'GE';
  public cardImage: string = 'assets/cardback.png';
  public setNumber: string = '104';
  public name: string = 'Darkrai';
  public fullName: string = 'Darkrai LV.X GE';

  public readonly ENDLESS_DARKNESS_MARKER = 'ENDLESS_DARKNESS_MARKER';

  public reduceEffect(store: StoreLike, state: State, effect: Effect): State {
    // Lv.X must be played onto Active
    if (effect instanceof PlayPokemonEffect && effect.pokemonCard === this) {
      if (effect.target !== effect.player.active) {
        throw new GameError(GameMessage.CANNOT_PLAY_THIS_CARD);
      }
    }

    // Dark Shadow
    if (effect instanceof DealDamageEffect && effect.damage > 0) {
      const player = effect.player;
      const opponent = StateUtils.getOpponent(state, player);
      if (effect.target !== opponent.active) {
        return state;
      }

      const dealEffect = effect as DealDamageEffect & { darkShadowApplied?: boolean };
      if (dealEffect.darkShadowApplied) {
        return state;
      }

      let isInPlay = false;
      player.forEachPokemon(PlayerType.BOTTOM_PLAYER, (_list, card) => {
        if (card === this) {
          isInPlay = true;
        }
      });
      if (!isInPlay) {
        return state;
      }
      if (IS_POKEBODY_BLOCKED(store, state, player, this)) {
        return state;
      }

      const checkType = new CheckPokemonTypeEffect(effect.source);
      store.reduceEffect(state, checkType);
      if (!checkType.cardTypes.includes(CardType.DARK)) {
        return state;
      }

      const basicDarknessCount = effect.source.cards.filter(c =>
        c instanceof EnergyCard &&
        c.energyType === EnergyType.BASIC &&
        c.provides.includes(CardType.DARK)
      ).length;

      if (basicDarknessCount > 0) {
        dealEffect.darkShadowApplied = true;
        effect.damage += 10 * basicDarknessCount;
      }
    }

    // Endless Darkness
    if (WAS_ATTACK_USED(effect, 0, this)) {
      YOUR_OPPPONENTS_ACTIVE_POKEMON_IS_NOW_ASLEEP(store, state, effect);
      effect.opponent.active.sleepFlips = 2;
      ADD_MARKER(this.ENDLESS_DARKNESS_MARKER, effect.opponent.active, this);
    }

    // Endless Darkness — custom between-turns (both tails = KO)
    if (effect instanceof BetweenTurnsEffect) {
      const player = effect.player;
      if (!HAS_MARKER(this.ENDLESS_DARKNESS_MARKER, player.active, this)) {
        return state;
      }

      if (!player.active.specialConditions.includes(SpecialCondition.ASLEEP)) {
        REMOVE_MARKER(this.ENDLESS_DARKNESS_MARKER, player.active, this);
        return state;
      }

      effect.asleepFlipResult = false;
      MULTIPLE_COIN_FLIPS_PROMPT(store, state, player, 2, results => {
        if (results.every(r => r === true)) {
          player.active.removeSpecialCondition(SpecialCondition.ASLEEP);
          REMOVE_MARKER(this.ENDLESS_DARKNESS_MARKER, player.active, this);
          return;
        }
        if (results.every(r => r === false)) {
          REMOVE_MARKER(this.ENDLESS_DARKNESS_MARKER, player.active, this);
          store.reduceEffect(state, new KnockOutEffect(player, player.active));
        }
      });
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
