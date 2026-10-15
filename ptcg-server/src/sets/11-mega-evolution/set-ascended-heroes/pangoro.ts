import { PokemonCard } from '../../../game/store/card/pokemon-card';
import { CardType, Stage } from '../../../game/store/card/card-types';
import { PlayerType, State, StoreLike } from '../../../game';
import { Effect } from '../../../game/store/effects/effect';
import { WAS_ATTACK_USED } from '../../../game/store/prefabs/prefabs';

export class Pangoro extends PokemonCard {
  public stage: Stage = Stage.STAGE_1;
  public evolvesFrom: string = 'Pancham';
  public hp: number = 140;
  public cardType: CardType[] = [D];
  public weakness = [{ type: G }];
  public retreat = [C, C, C];

  public attacks = [{
    name: 'Corkscrew Punch',
    cost: [D],
    damage: 40,
    text: ''
  },
  {
    name: 'Master\'s Punch',
    cost: [D, D, C],
    damage: 80,
    damageCalculation: '+',
    text: 'If any of your Benched Pancham have any damage counters on them, this attack does 120 more damage.'
  }];

  public regulationMark = 'I';
  public set: string = 'ASC';
  public cardImage: string = 'assets/cardback.png';
  public setNumber: string = '140';
  public name: string = 'Pangoro';
  public fullName: string = 'Pangoro ASC';

  public reduceEffect(store: StoreLike, state: State, effect: Effect): State {
    // Master's Punch
    if (WAS_ATTACK_USED(effect, 1, this)) {
      const player = effect.player;
      let hasDamagedBenchedPancham = false;
      player.forEachPokemon(PlayerType.BOTTOM_PLAYER, (cardList, card) => {
        if (cardList !== player.active && card.name === 'Pancham' && cardList.damage > 0) {
          hasDamagedBenchedPancham = true;
        }
      });
      if (hasDamagedBenchedPancham) {
        effect.damage += 120;
      }
    }

    return state;
  }
}
