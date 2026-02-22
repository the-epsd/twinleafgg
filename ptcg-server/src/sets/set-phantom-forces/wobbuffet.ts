import { GameError } from '../../game/game-error';
import { GameMessage } from '../../game/game-message';
import { CardType, Stage } from '../../game/store/card/card-types';
import { PokemonCard } from '../../game/store/card/pokemon-card';
import { PowerType } from '../../game/store/card/pokemon-types';
import { CheckPokemonTypeEffect, CheckPokemonPowersEffect } from '../../game/store/effects/check-effects';
import { Effect } from '../../game/store/effects/effect';
import { EffectOfAbilityEffect, PowerEffect } from '../../game/store/effects/game-effects';
import { StateUtils } from '../../game/store/state-utils';
import { PokemonCardList } from '../../game/store/state/pokemon-card-list';
import { State } from '../../game/store/state/state';
import { StoreLike } from '../../game/store/store-like';
import { WAS_ATTACK_USED } from '../../game/store/prefabs/prefabs';

export class Wobbuffet extends PokemonCard {

  public stage: Stage = Stage.BASIC;
  public cardType: CardType = P;
  public hp: number = 110;
  public weakness = [{ type: P }];
  public retreat = [C, C];

  public powers = [{
    name: 'Bide Barricade',
    powerType: PowerType.ABILITY,
    text: 'As long as this Pokemon is your Active Pokemon, each Pokemon in ' +
      'play, in each player\'s hand, and in each player\'s discard pile has ' +
      'no Abilities (except for [P] Pokémon).'
  }];

  public attacks = [{
    name: 'Psychic Assault',
    cost: [P, C],
    damage: 10,
    damageCalculation: '+',
    text: 'This attack does 10 more damage for each damage counter on ' +
      'your opponent\'s Active Pokemon.'
  }];

  public set: string = 'PHF';
  public name: string = 'Wobbuffet';
  public fullName: string = 'Wobbuffet PHF';
  public cardImage: string = 'assets/cardback.png';
  public setNumber: string = '36';

  public reduceEffect(store: StoreLike, state: State, effect: Effect): State {

    if (WAS_ATTACK_USED(effect, 0, this)) {
      effect.damage += effect.opponent.active.damage;
      return state;
    }

    if (effect instanceof CheckPokemonPowersEffect) {
      const player = effect.player;
      const opponent = StateUtils.getOpponent(state, player);

      // Wobbuffet is not active Pokemon
      const playerHasWobb = player.active.getPokemonCard() === this;
      const opponentHasWobb = opponent.active.getPokemonCard() === this;
      if (!playerHasWobb && !opponentHasWobb) {
        return state;
      }

      let cardTypes = [effect.target.cardType].filter(Boolean) as CardType[];

      const cardList = effect.target;
      if (cardList instanceof PokemonCardList) {
        const checkPokemonType = new CheckPokemonTypeEffect(cardList);
        store.reduceEffect(state, checkPokemonType);
        cardTypes = checkPokemonType.cardTypes;
      }

      // We are not blocking the Abilities from Psychic Pokemon
      if (cardTypes.includes(CardType.PSYCHIC)) {
        return state;
      }

      // Try to reduce PowerEffect, to check if something is blocking our ability
      try {
        const powerEffect = new PowerEffect(player, this.powers[0], this);
        store.reduceEffect(state, powerEffect);
      } catch {
        return state;
      }

      // Check if we can apply the Ability lock to target Pokemon
      if (cardList instanceof PokemonCardList) {
        const canApplyAbility = new EffectOfAbilityEffect(playerHasWobb ? player : opponent, this.powers[0], this, cardList);
        store.reduceEffect(state, canApplyAbility);
        if (!canApplyAbility.target) {
          return state;
        }
      }

      // Filter out all abilities
      effect.powers = effect.powers.filter(power =>
        power.powerType !== PowerType.ABILITY
      );
    }

    if (effect instanceof PowerEffect && effect.power.powerType === PowerType.ABILITY && effect.power.name !== 'Bide Barricade') {
      const player = effect.player;
      const opponent = StateUtils.getOpponent(state, player);

      // Wobbuffet is not active Pokemon
      const playerHasWobb = player.active.getPokemonCard() === this;
      const opponentHasWobb = opponent.active.getPokemonCard() === this;
      if (!playerHasWobb && !opponentHasWobb) {
        return state;
      }

      let cardTypes = [effect.card.cardType];

      const cardList = StateUtils.findCardList(state, effect.card);
      if (cardList instanceof PokemonCardList) {
        const checkPokemonType = new CheckPokemonTypeEffect(cardList);
        store.reduceEffect(state, checkPokemonType);
        cardTypes = checkPokemonType.cardTypes;
      }

      // We are not blocking the Abilities from Psychic Pokemon
      if (cardTypes.includes(CardType.PSYCHIC)) {
        return state;
      }

      // Try to reduce PowerEffect, to check if something is blocking our ability
      try {
        const powerEffect = new PowerEffect(player, this.powers[0], this);
        store.reduceEffect(state, powerEffect);
      } catch {
        return state;
      }

      // Check if we can apply the Ability lock to target Pokemon
      if (cardList instanceof PokemonCardList) {
        const canApplyAbility = new EffectOfAbilityEffect(playerHasWobb ? player : opponent, this.powers[0], this, cardList);
        store.reduceEffect(state, canApplyAbility);
        if (!canApplyAbility.target) {
          return state;
        }
      }

      // Apply Ability lock
      if (!effect.power.exemptFromAbilityLock) {
        throw new GameError(GameMessage.BLOCKED_BY_ABILITY);
      }
    }
    return state;
  }
}
