import { PokemonCard } from '../../game/store/card/pokemon-card';
import { Stage, CardType } from '../../game/store/card/card-types';
import { StoreLike, State } from '../../game';
import { Effect } from '../../game/store/effects/effect';
import { WAS_ATTACK_USED } from '../../game/store/prefabs/prefabs';

export class Lucario extends PokemonCard {
  public stage: Stage = Stage.STAGE_1;
  public evolvesFrom = 'Riolu';
  public cardType: CardType = F;
  public hp: number = 90;
  public weakness = [{ type: P }];
  public retreat = [C];

  public attacks = [{
    name: 'Dimension Sphere',
    cost: [C, C],
    damage: 30,
    damageCalculation: '+',
    text: 'Does 30 damage plus 20 more damage for each of your Pokémon in the Lost Zone.'
  },
  {
    name: 'Sky Uppercut',
    cost: [F, F, C],
    damage: 70,
    text: 'This attack\'s damage isn\'t affected by Resistance.'
  }];

  public set: string = 'CL';
  public setNumber = '14';
  public cardImage = 'assets/cardback.png';
  public name: string = 'Lucario';
  public fullName: string = 'Lucario CL';

  public reduceEffect(store: StoreLike, state: State, effect: Effect): State {
    if (WAS_ATTACK_USED(effect, 0, this)) {
      const player = effect.player;

      let pokemonCount = 0;
      player.lostzone.cards.forEach(c => {
        if (c instanceof PokemonCard/* && !c.tags.includes(CardTag.PRISM_STAR)*/) {
          pokemonCount += 1;
        }
      });

      effect.damage += pokemonCount * 20;
    }

    if (WAS_ATTACK_USED(effect, 1, this)) {
      effect.ignoreResistance = true;
    }

    return state;
  }

}
