import { PokemonCard } from '../../game/store/card/pokemon-card';
import { Stage, CardType } from '../../game/store/card/card-types';
import { StoreLike, State } from '../../game';
import { Effect } from '../../game/store/effects/effect';
import { WAS_ATTACK_USED } from '../../game/store/prefabs/prefabs';

export class Tinkatuff extends PokemonCard {
  public stage: Stage = Stage.STAGE_1;
  public cardType: CardType = CardType.PSYCHIC;
  public hp: number = 80;
  public weakness = [{ type: CardType.METAL }];
  public retreat = [CardType.COLORLESS, CardType.COLORLESS];
  public evolvesFrom: string = 'Tinkatink';

  public attacks = [{
    name: 'Light Punch',
    cost: [CardType.COLORLESS],
    damage: 30,
    text: ''
  },
  {
    name: 'Boundless Power',
    cost: [CardType.PSYCHIC, CardType.COLORLESS],
    damage: 80,
    text: 'During your next turn, this Pokemon can\'t attack.'
  }];

  public regulationMark: string = 'G';
  public set: string = 'PAL';
  public cardImage: string = 'assets/cardback.png';
  public setNumber: string = '103';
  public name: string = 'Tinkatuff';
  public fullName: string = 'Tinkatuff PAL';

  public reduceEffect(store: StoreLike, state: State, effect: Effect): State {
    // Boundless Power
    if (WAS_ATTACK_USED(effect, 1, this)) {
      const player = effect.player;
      player.active.cannotAttackNextTurnPending = true;
    }
    return state;
  }
}