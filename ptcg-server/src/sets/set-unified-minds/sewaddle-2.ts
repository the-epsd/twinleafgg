import { PokemonCard } from '../../game/store/card/pokemon-card';
import { Stage, CardType } from '../../game/store/card/card-types';
import { GamePhase, PowerType, StoreLike, State, StateUtils } from '../../game';
import { PutDamageEffect } from '../../game/store/effects/attack-effects';
import { Effect } from '../../game/store/effects/effect';
import { WAS_ATTACK_USED, COIN_FLIP_PROMPT, IS_ABILITY_BLOCKED } from '../../game/store/prefabs/prefabs';

export class Sewaddle2 extends PokemonCard {
  public stage: Stage = Stage.BASIC;
  public cardType: CardType = G;
  public hp: number = 50;
  public weakness = [{ type: R }];
  public retreat = [C];

  public powers = [{
    name: 'Swaddling Leaves',
    powerType: PowerType.ABILITY,
    text: 'This Pokémon takes 10 less damage from attacks (after applying Weakness and Resistance).'
  }];

  public attacks = [
    {
      name: 'Surprise Attack',
      cost: [G],
      damage: 20,
      text: 'Flip a coin. If tails, this attack does nothing.'
    }
  ];

  public set: string = 'UNM';
  public setNumber: string = '7';
  public cardImage: string = 'assets/cardback.png';
  public name: string = 'Sewaddle';
  public fullName: string = 'Sewaddle UNM 7';

  public reduceEffect(store: StoreLike, state: State, effect: Effect): State {
    // Ability: Swaddling Leaves (passive - reduce damage)
    // Ref: set-unified-minds/sewaddle.ts (Swaddling Leaves)
    if (effect instanceof PutDamageEffect && effect.target.cards.includes(this)) {
      const pokemonCard = effect.target.getPokemonCard();

      if (pokemonCard !== this) {
        return state;
      }

      if (state.phase !== GamePhase.ATTACK) {
        return state;
      }

      const player = StateUtils.findOwner(state, effect.target);

      if (IS_ABILITY_BLOCKED(store, state, player, this)) {
        return state;
      }

      effect.damage = Math.max(0, effect.damage - 10);
    }

    // Attack 1: Surprise Attack
    // Ref: set-unified-minds/sewaddle.ts (Surprise Attack)
    if (WAS_ATTACK_USED(effect, 0, this)) {
      COIN_FLIP_PROMPT(store, state, effect.player, result => {
        if (!result) {
          effect.damage = 0;
        }
      });
    }

    return state;
  }
}
