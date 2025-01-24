import { PokemonCard } from '../../game/store/card/pokemon-card';
import { Stage, CardType, SpecialCondition } from '../../game/store/card/card-types';
import { StoreLike, State } from '../../game';
import { Effect } from '../../game/store/effects/effect';
import { AttackEffect } from '../../game/store/effects/game-effects';
import { AddSpecialConditionsEffect } from '../../game/store/effects/attack-effects';
import { CheckAttackCostEffect } from '../../game/store/effects/check-effects';

export class Conkeldurr extends PokemonCard {

  public stage: Stage = Stage.STAGE_2;

  public evolvesFrom = 'Gurdurr';

  public cardType: CardType = CardType.FIGHTING;

  public hp: number = 180;

  public weakness = [{ type: CardType.PSYCHIC }];

  public retreat = [CardType.COLORLESS, CardType.COLORLESS, CardType.COLORLESS];

  public attacks = [
    {
      name: 'Tantrum',
      cost: [CardType.FIGHTING],
      damage: 80,
      text: 'This Pokémon is now Confused.'
    },

    {
      name: 'Gutsy Swing',
      cost: [CardType.FIGHTING, CardType.COLORLESS, CardType.COLORLESS, CardType.COLORLESS],
      damage: 250,
      text: 'If this Pokémon is affected by a Special Condition, ignore all Energy in this attack\'s cost.'
    }
  ];

  public set: string = 'TWM';

  public setNumber = '105';

  public cardImage = 'assets/cardback.png';

  public regulationMark: string = 'H';

  public name: string = 'Conkeldurr';

  public fullName: string = 'Conkeldurr TWM';

  public reduceEffect(store: StoreLike, state: State, effect: Effect): State {
    // Tantrum
    if (effect instanceof AttackEffect && effect.attack === this.attacks[0]) {
      const player = effect.player;

      const specialCondition = new AddSpecialConditionsEffect(effect, [SpecialCondition.CONFUSED]);
      specialCondition.target = player.active;
      return store.reduceEffect(state, specialCondition);
    }

    // Gutsy Swing
    if (effect instanceof CheckAttackCostEffect && effect.attack === this.attacks[1]) {
      const player = effect.player;

      if (effect.player !== player || player.active.getPokemonCard() !== this) {
        return state;
      }

      if (effect.player.active.specialConditions.length > 0) {
        effect.cost = [];
      }

      return state;
    }

    return state;
  }
}