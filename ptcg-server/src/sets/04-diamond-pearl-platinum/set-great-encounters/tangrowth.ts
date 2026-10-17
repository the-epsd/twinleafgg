import { PokemonCard } from '../../../game/store/card/pokemon-card';
import { CardType, EnergyType, Stage } from '../../../game/store/card/card-types';
import { EnergyCard, State, StoreLike } from '../../../game';
import { Effect } from '../../../game/store/effects/effect';
import { HEAL_X_DAMAGE_FROM_THIS_POKEMON, WAS_ATTACK_USED } from '../../../game/store/prefabs/prefabs';
import { BLOCK_RETREAT } from '../../../game/store/prefabs/effect-of-attack-prefabs';
import { THIS_ATTACK_DOES_X_DAMAGE_TO_1_OF_YOUR_OPPONENTS_POKEMON } from '../../../game/store/prefabs/attack-effects';

export class Tangrowth extends PokemonCard {
  public stage: Stage = Stage.STAGE_1;
  public evolvesFrom: string = 'Tangela';
  public hp: number = 110;
  public cardType: CardType[] = [G];
  public weakness = [{ type: R, value: +30 }];
  public resistance = [{ type: W, value: -20 }];
  public retreat = [C, C];

  public attacks = [{
    name: 'Power Whip',
    cost: [G],
    damage: 0,
    text: 'Choose 1 of your opponent\'s Pokémon. This attack does 10 damage for each basic Energy card attached to Tangrowth to that Pokémon. (Don\'t apply Weakness and Resistance for Benched Pokémon.)'
  },
  {
    name: 'Stick and Absorb',
    cost: [G, G, C, C],
    damage: 60,
    text: 'Remove 3 damage counters from Tangrowth. The Defending Pokémon can\'t retreat during your opponent\'s next turn.'
  }];

  public set: string = 'GE';
  public cardImage: string = 'assets/cardback.png';
  public setNumber: string = '10';
  public name: string = 'Tangrowth';
  public fullName: string = 'Tangrowth GE';

  public reduceEffect(store: StoreLike, state: State, effect: Effect): State {
    // Power Whip
    if (WAS_ATTACK_USED(effect, 0, this)) {
      const basicEnergy = effect.player.active.cards.filter(
        c => c instanceof EnergyCard && c.energyType === EnergyType.BASIC
      ).length;
      THIS_ATTACK_DOES_X_DAMAGE_TO_1_OF_YOUR_OPPONENTS_POKEMON(10 * basicEnergy, effect, store, state);
    }

    // Stick and Absorb
    if (WAS_ATTACK_USED(effect, 1, this)) {
      HEAL_X_DAMAGE_FROM_THIS_POKEMON(effect, store, state, 30);
      return BLOCK_RETREAT(store, state, effect, this);
    }

    return state;
  }
}
