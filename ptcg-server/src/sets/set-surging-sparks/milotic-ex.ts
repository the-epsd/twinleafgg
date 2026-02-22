import { PokemonCard, Stage, CardType, CardTag, PowerType, StoreLike, State, SpecialCondition, GamePhase, StateUtils } from '../../game';
import { AbstractAttackEffect, AddSpecialConditionsEffect, PutDamageEffect } from '../../game/store/effects/attack-effects';
import { Effect } from '../../game/store/effects/effect';
import { PowerEffect } from '../../game/store/effects/game-effects';
import { WAS_ATTACK_USED } from '../../game/store/prefabs/prefabs';

export class Miloticex extends PokemonCard {
  public stage: Stage = Stage.STAGE_1;
  public evolvesFrom: string = 'Feebas';
  public cardType: CardType = CardType.WATER;
  public hp: number = 270;
  public weakness = [{ type: CardType.LIGHTNING }];
  public resistance = [];
  public retreat = [CardType.COLORLESS, CardType.COLORLESS];
  public tags = [CardTag.POKEMON_ex];

  public powers = [{
    name: 'Sparkling Scales',
    powerType: PowerType.ABILITY,
    text: 'Prevent all damage and effects done to this Pokémon by your opponent\'s Tera Pokémon\'s attacks.'
  }];

  public attacks = [{
    name: 'Hypno Splash',
    cost: [CardType.WATER, CardType.COLORLESS, CardType.COLORLESS],
    damage: 160,
    text: 'Your opponent\'s Active Pokémon is now Asleep.'
  }];

  public regulationMark = 'H';
  public set: string = 'SSP';
  public setNumber: string = '42';
  public cardImage: string = 'assets/cardback.png';
  public name: string = 'Milotic ex';
  public fullName: string = 'Milotic ex SSP';

  public reduceEffect(store: StoreLike, state: State, effect: Effect): State {

    // if (effect instanceof BetweenTurnsEffect) {
    //   const player = effect.player;
    //   player.forEachPokemon(PlayerType.BOTTOM_PLAYER, cardList => {
    //     if (cardList.getPokemonCard() === this && cardList.marker.markers.length > 0) {
    //       cardList.clearAttackEffects();
    //       cardList.clearEffects();
    //     }
    //   });
    // }

    if (effect instanceof AbstractAttackEffect && effect.target.cards.includes(this)) {
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

      if (sourceCard.tags.includes(CardTag.POKEMON_TERA)) {

        // Try to reduce PowerEffect, to check if something is blocking our ability
        try {
          const stub = new PowerEffect(player, {
            name: 'test',
            powerType: PowerType.ABILITY,
            text: ''
          }, this);
          store.reduceEffect(state, stub);
        } catch {
          return state;
        }
        effect.preventDefault = true;
      }
    }

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

      if (sourceCard.tags.includes(CardTag.POKEMON_TERA)) {

        // Try to reduce PowerEffect, to check if something is blocking our ability
        try {
          const stub = new PowerEffect(player, {
            name: 'test',
            powerType: PowerType.ABILITY,
            text: ''
          }, this);
          store.reduceEffect(state, stub);
        } catch {
          return state;
        }
        effect.damage = 0;
        effect.preventDefault = true;
      }
    }

    if (WAS_ATTACK_USED(effect, 0, this)) {
      const specialConditionEffect = new AddSpecialConditionsEffect(effect, [SpecialCondition.ASLEEP]);
      state = store.reduceEffect(state, specialConditionEffect);
    }

    return state;
  }
}
