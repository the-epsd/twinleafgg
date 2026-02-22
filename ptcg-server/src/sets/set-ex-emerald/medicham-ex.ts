import { GameError } from '../../game/game-error';
import { GameMessage } from '../../game/game-message';
import { CardType, Stage, CardTag } from '../../game/store/card/card-types';
import { PokemonCard } from '../../game/store/card/pokemon-card';
import { PowerType } from '../../game/store/card/pokemon-types';
import { Effect } from '../../game/store/effects/effect';
import { EffectOfAbilityEffect, PowerEffect } from '../../game/store/effects/game-effects';
import { CheckPokemonPowersEffect } from '../../game/store/effects/check-effects';
import { StateUtils } from '../../game/store/state-utils';
import { PokemonCardList } from '../../game/store/state/pokemon-card-list';
import { State } from '../../game/store/state/state';
import { StoreLike } from '../../game/store/store-like';
import { WAS_ATTACK_USED } from '../../game/store/prefabs/prefabs';
import { PUT_X_DAMAGE_COUNTERS_IN_ANY_WAY_YOU_LIKE } from '../../game/store/prefabs/attack-effects';

export class Medichamex extends PokemonCard {
  public stage: Stage = Stage.STAGE_1;
  public tags = [CardTag.POKEMON_ex];
  public cardType: CardType = F;
  public hp: number = 110;
  public weakness = [{ type: P }];
  public retreat = [C, C];

  public powers = [{
    name: 'Wise Aura',
    powerType: PowerType.ABILITY,
    text: 'As long as Medicham ex is your Active Pokémon, each Pokémon (excluding Pokémon-ex) (both yours and your opponent\'s) can\'t use any Poké-Powers.'
  }];

  public attacks = [
    {
      name: 'Pure Power',
      cost: [C, C],
      damage: 0,
      text: 'Put 3 damage counters on your opponent\'s Pokémon in any way you like.'
    },
    {
      name: 'Sky Kick',
      cost: [F, C, C],
      damage: 60,
      damageCalculation: '+',
      text: 'If the Defending Pokémon has Fighting Resistance, this attack does 60 damage plus 40 more damage.'
    }
  ];

  public set: string = 'EM';
  public setNumber: string = '95';
  public cardImage: string = 'assets/cardback.png';
  public name: string = 'Medicham ex';
  public fullName: string = 'Medicham ex EM';
  public evolvesFrom: string = 'Meditite';

  public reduceEffect(store: StoreLike, state: State, effect: Effect): State {
    // Handle Wise Aura Poké-Body
    if (effect instanceof CheckPokemonPowersEffect) {
      const player = effect.player;
      const opponent = StateUtils.getOpponent(state, player);

      // Medicham ex is not active Pokemon
      const playerHasMedicham = player.active.getPokemonCard() === this;
      const opponentHasMedicham = opponent.active.getPokemonCard() === this;
      if (!playerHasMedicham && !opponentHasMedicham) {
        return state;
      }

      const targetPokemon = effect.target;
      if (!targetPokemon) {
        return state;
      }

      // Check if the Pokemon is a Pokemon-ex
      if (targetPokemon.tags.includes(CardTag.POKEMON_ex)) {
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
      const cardList = effect.target;
      if (cardList instanceof PokemonCardList) {
        const canApplyAbility = new EffectOfAbilityEffect(playerHasMedicham ? player : opponent, this.powers[0], this, cardList);
        store.reduceEffect(state, canApplyAbility);
        if (!canApplyAbility.target) {
          return state;
        }
      }

      // Filter out Poké Powers
      effect.powers = effect.powers.filter(power =>
        power.powerType !== PowerType.POKEPOWER
      );
    }

    if (effect instanceof PowerEffect && effect.power.powerType === PowerType.POKEPOWER && effect.power.name !== 'Wise Aura') {
      const player = effect.player;
      const opponent = StateUtils.getOpponent(state, player);
      const cardList = StateUtils.findCardList(state, effect.card);

      // Medicham ex is not active Pokemon
      const playerHasMedicham = player.active.getPokemonCard() === this;
      const opponentHasMedicham = opponent.active.getPokemonCard() === this;
      if (!playerHasMedicham && !opponentHasMedicham) {
        return state;
      }

      // Check if the Pokemon is a Pokemon-ex
      if (effect.card.tags.includes(CardTag.POKEMON_ex)) {
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
        const canApplyAbility = new EffectOfAbilityEffect(playerHasMedicham ? player : opponent, this.powers[0], this, cardList);
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

    // Handle Pure Power attack
    if (WAS_ATTACK_USED(effect, 0, this)) {
      PUT_X_DAMAGE_COUNTERS_IN_ANY_WAY_YOU_LIKE(3, store, state, effect);
    }

    // Handle Sky Kick attack
    if (WAS_ATTACK_USED(effect, 1, this)) {
      const opponent = effect.opponent;
      const defendingPokemon = opponent.active.getPokemonCard();

      if (defendingPokemon && defendingPokemon.resistance) {
        const fightingResistance = defendingPokemon.resistance.find(r => r.type === CardType.FIGHTING);
        if (fightingResistance) {
          effect.damage += 40;
        }
      }
    }
    return state;
  }
} 