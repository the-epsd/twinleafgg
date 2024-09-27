import { PokemonCard, Stage, CardType, CardTag, PowerType, StoreLike, State, SpecialCondition, StateUtils } from '../../game';
import { AbstractAttackEffect, DealDamageEffect, AddSpecialConditionsEffect, PutDamageEffect } from '../../game/store/effects/attack-effects';
import { Effect } from '../../game/store/effects/effect';
import { AttackEffect } from '../../game/store/effects/game-effects';

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
  public set: string = 'SV8';
  public setNumber: string = '26';
  public cardImage: string = 'assets/cardback.png';
  public name: string = 'Milotic ex';
  public fullName: string = 'Milotic ex SV8';

  public reduceEffect(store: StoreLike, state: State, effect: Effect): State {

    if (effect instanceof AbstractAttackEffect && effect.target.cards.includes(this)) {
      const player = effect.player;
      const opponent = StateUtils.getOpponent(state, player);
      const opponentActive = opponent.active.getPokemonCard();

      if (opponentActive && opponentActive.tags.includes(CardTag.POKEMON_TERA)) {
        effect.preventDefault = true;
      }
    }

    if (effect instanceof PutDamageEffect && effect.target.cards.includes(this)) {
      const player = effect.player;
      const opponent = StateUtils.getOpponent(state, player);
      const opponentActive = opponent.active.getPokemonCard();

      if (opponentActive && opponentActive.tags.includes(CardTag.POKEMON_TERA)) {
        effect.preventDefault = true;
      }
    }

    if (effect instanceof DealDamageEffect && effect.target.cards.includes(this)) {
      const player = effect.player;
      const opponent = StateUtils.getOpponent(state, player);
      const opponentActive = opponent.active.getPokemonCard();

      if (opponentActive && opponentActive.tags.includes(CardTag.POKEMON_TERA)) {
        effect.preventDefault = true;
      }
    }

    if (effect instanceof AttackEffect && effect.attack === this.attacks[0]) {
      const specialConditionEffect = new AddSpecialConditionsEffect(effect, [SpecialCondition.ASLEEP]);
      state = store.reduceEffect(state, specialConditionEffect);
    }

    return state;
  }
}
