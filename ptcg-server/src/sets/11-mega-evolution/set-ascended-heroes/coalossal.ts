import { PokemonCard } from '../../../game/store/card/pokemon-card';
import { CardType, EnergyType, Stage } from '../../../game/store/card/card-types';
import { State, StoreLike } from '../../../game';
import { Effect } from '../../../game/store/effects/effect';
import { EnergyCard } from '../../../game/store/card/energy-card';
import { THIS_ATTACK_DOES_X_DAMAGE_TO_1_OF_YOUR_OPPONENTS_POKEMON } from '../../../game/store/prefabs/attack-effects';
import { WAS_ATTACK_USED } from '../../../game/store/prefabs/prefabs';
import { DISCARD_X_ENERGY_FROM_THIS_POKEMON } from '../../../game/store/prefabs/costs';

export class Coalossal extends PokemonCard {
  public stage: Stage = Stage.STAGE_2;
  public evolvesFrom: string = 'Carkol';
  public hp: number = 180;
  public cardType: CardType[] = [F];
  public weakness = [{ type: G }];
  public retreat = [C, C, C, C];

  public attacks = [{
    name: 'Tar Cannon',
    cost: [F],
    damage: 0,
    text: 'This attack does 140 damage to 1 of your opponent\'s Pokémon. If you don\'t have 10 or more Basic Fighting Energy cards in your discard pile, this attack does nothing. (Don\'t apply Weakness and Resistance for Benched Pokémon.)'
  },
  {
    name: 'Bulky Bump',
    cost: [F, C, C, C],
    damage: 220,
    text: 'Discard 3 Energy from this Pokémon.'
  }];

  public regulationMark = 'I';
  public set: string = 'ASC';
  public cardImage: string = 'assets/cardback.png';
  public setNumber: string = '120';
  public name: string = 'Coalossal';
  public fullName: string = 'Coalossal ASC';

  public reduceEffect(store: StoreLike, state: State, effect: Effect): State {
    // Tar Cannon
    if (WAS_ATTACK_USED(effect, 0, this)) {
      const player = effect.player;
      const basicFightingEnergyInDiscard = player.discard.cards.filter(c =>
        c instanceof EnergyCard
        && c.energyType === EnergyType.BASIC
        && c.provides.includes(CardType.FIGHTING)
      ).length;

      if (basicFightingEnergyInDiscard < 10) {
        effect.damage = 0;
        return state;
      }
      THIS_ATTACK_DOES_X_DAMAGE_TO_1_OF_YOUR_OPPONENTS_POKEMON(140, effect, store, state);
    }

    // Bulky Bump
    if (WAS_ATTACK_USED(effect, 1, this)) {
      DISCARD_X_ENERGY_FROM_THIS_POKEMON(store, state, effect, 3);
    }

    return state;
  }
}
