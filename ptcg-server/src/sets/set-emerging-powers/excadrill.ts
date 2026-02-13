import { PokemonCard } from '../../game/store/card/pokemon-card';
import { Stage, CardType, SuperType } from '../../game/store/card/card-types';
import { StoreLike, State, StateUtils } from '../../game';
import { Effect } from '../../game/store/effects/effect';
import { WAS_ATTACK_USED } from '../../game/store/prefabs/prefabs';

export class Excadrill extends PokemonCard {
  public stage: Stage = Stage.STAGE_1;
  public evolvesFrom: string = 'Drilbur';
  public cardType: CardType = F;
  public hp: number = 110;
  public weakness = [{ type: W }];
  public resistance = [{ type: L, value: -20 }];
  public retreat = [C, C];

  public attacks = [
    {
      name: 'Metal Claw',
      cost: [C],
      damage: 30,
      text: ''
    },
    {
      name: 'Drill Run',
      cost: [F, F, F],
      damage: 80,
      text: 'Discard an Energy attached to the Defending Pokémon.'
    }
  ];

  public set: string = 'EPO';
  public cardImage: string = 'assets/cardback.png';
  public setNumber: string = '56';
  public name: string = 'Excadrill';
  public fullName: string = 'Excadrill EPO';

  public reduceEffect(store: StoreLike, state: State, effect: Effect): State {
    if (WAS_ATTACK_USED(effect, 1, this)) {
      const player = effect.player;
      const opponent = StateUtils.getOpponent(state, player);
      const opponentActive = opponent.active;
      const energyCards = opponentActive.cards.filter(c => c.superType === SuperType.ENERGY);

      if (energyCards.length > 0) {
        opponentActive.moveCardTo(energyCards[0], opponent.discard);
      }
    }
    return state;
  }
}
