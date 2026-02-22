import { PokemonCard } from '../../game/store/card/pokemon-card';
import { Stage, CardType, CardTag } from '../../game/store/card/card-types';
import { StoreLike, State, PowerType, GamePhase } from '../../game';
import { Effect } from '../../game/store/effects/effect';
import { StateUtils } from '../../game';
import { CheckProvidedEnergyEffect } from '../../game/store/effects/check-effects';
import { AddSpecialConditionsEffect } from '../../game/store/effects/attack-effects';
import { SpecialCondition } from '../../game/store/card/card-types';
import { PutDamageEffect } from '../../game/store/effects/attack-effects';
import { BLOCK_IF_GX_ATTACK_USED, IS_ABILITY_BLOCKED, WAS_ATTACK_USED } from '../../game/store/prefabs/prefabs';
export class ShuckleGX extends PokemonCard {

  public tags = [CardTag.POKEMON_GX];

  public stage: Stage = Stage.BASIC;

  public cardType: CardType = CardType.GRASS;

  public hp: number = 170;

  public weakness = [{ type: CardType.FIRE }];

  public retreat = [CardType.COLORLESS];

  public powers = [{
    name: 'Protective Shell',
    useWhenInPlay: false,
    powerType: PowerType.ABILITY,
    text: 'Prevent all damage done to this Pokémon by attacks from your opponent\'s Pokémon that have 2 or fewer Energy attached to them.'
  }];

  public attacks = [
    {
      name: 'Triple Poison',
      cost: [CardType.COLORLESS],
      damage: 0,
      text: 'Your opponent\'s Active Pokémon is now Poisoned. Put 3 damage counters instead of 1 on that Pokémon between turns. '
    },
    {
      name: 'Wrap-GX',
      cost: [CardType.COLORLESS],
      damage: 40,
      gxAttack: true,
      text: 'Your opponent\'s Active Pokémon is now Paralyzed. (You can\'t use more than 1 GX attack in a game.)'
    }
  ];

  public set: string = 'LOT';

  public setNumber: string = '17';

  public cardImage: string = 'assets/cardback.png';

  public name: string = 'Shuckle-GX';

  public fullName: string = 'Shuckle-GX LOT';

  public reduceEffect(store: StoreLike, state: State, effect: Effect): State {
    // Protective Shell
    if (effect instanceof PutDamageEffect && effect.target.cards.includes(this)) {
      const pokemonCard = effect.target.getPokemonCard();
      const sourceCard = effect.source.getPokemonCard();

      // Card is not active, or damage source is unknown
      if (pokemonCard !== this || sourceCard === undefined) {
        return state;
      }

      // Do not ignore self-damage from Pokemon-Ex
      const player = StateUtils.findOwner(state, effect.target);
      const opponent = StateUtils.findOwner(state, effect.source);
      if (player === opponent) {
        return state;
      }

      // It's not an attack
      if (state.phase !== GamePhase.ATTACK) {
        return state;
      }

      // Checking if the opponent has more than 2 energy attached
      const opponentProvidedEnergy = new CheckProvidedEnergyEffect(opponent);
      store.reduceEffect(state, opponentProvidedEnergy);
      const opponentEnergyCount = opponentProvidedEnergy.energyMap
        .reduce((left, p) => left + p.provides.length, 0);

      if (opponentEnergyCount > 2) {
        return state;
      }

      // Try to reduce PowerEffect, to check if something is blocking our ability
      if (IS_ABILITY_BLOCKED(store, state, player, this)) {
        return state;
      }

      effect.preventDefault = true;
    }

    // Triple Poison
    if (WAS_ATTACK_USED(effect, 0, this)) {
      const specialCondition = new AddSpecialConditionsEffect(effect, [SpecialCondition.POISONED]);
      specialCondition.poisonDamage = 30;
      return store.reduceEffect(state, specialCondition);
    }

    // Wrap-GX
    if (WAS_ATTACK_USED(effect, 1, this)) {
      const player = effect.player;

      // Check if player has used GX attack
      BLOCK_IF_GX_ATTACK_USED(player);
      // set GX attack as used for game
      player.usedGX = true;

      const specialCondition = new AddSpecialConditionsEffect(effect, [SpecialCondition.PARALYZED]);
      return store.reduceEffect(state, specialCondition);
    }

    return state;
  }
}