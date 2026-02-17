import { PokemonCard } from '../../game/store/card/pokemon-card';
import { Stage, CardType } from '../../game/store/card/card-types';
import { GamePhase, PowerType, StoreLike, State, StateUtils } from '../../game';
import { PutDamageEffect } from '../../game/store/effects/attack-effects';
import { Effect } from '../../game/store/effects/effect';
import { IS_ABILITY_BLOCKED } from '../../game/store/prefabs/prefabs';

export class Swadloon extends PokemonCard {
  public stage: Stage = Stage.STAGE_1;
  public evolvesFrom: string = 'Sewaddle';
  public cardType: CardType = G;
  public hp: number = 70;
  public weakness = [{ type: R }];
  public retreat = [C, C];

  public powers = [{
    name: 'Swaddling Leaves',
    powerType: PowerType.ABILITY,
    text: 'This Pokémon takes 30 less damage from attacks (after applying Weakness and Resistance).'
  }];

  public attacks = [
    {
      name: 'Bug Bite',
      cost: [C],
      damage: 10,
      text: ''
    }
  ];

  public set: string = 'UNM';
  public setNumber: string = '8';
  public cardImage: string = 'assets/cardback.png';
  public name: string = 'Swadloon';
  public fullName: string = 'Swadloon UNM';

  public reduceEffect(store: StoreLike, state: State, effect: Effect): State {
    // Ability: Swaddling Leaves (passive - reduce damage by 30)
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

      effect.damage = Math.max(0, effect.damage - 30);
    }

    return state;
  }
}
