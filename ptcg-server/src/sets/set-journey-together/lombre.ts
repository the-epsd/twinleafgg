import { Attack, CardType, PokemonCard, Stage, State, StoreLike, Weakness } from '../../game';
import { Effect } from '../../game/store/effects/effect';
import { WAS_ATTACK_USED } from '../../game/store/prefabs/prefabs';

export class Lombre extends PokemonCard {

  public stage: Stage = Stage.STAGE_1;
  public evolvesFrom: string = 'Lotad';
  public cardType: CardType = W;
  public hp: number = 90;
  public weakness: Weakness[] = [{ type: L }];
  public retreat: CardType[] = [C];

  public attacks: Attack[] = [{
    name: 'Aqua Slash',
    cost: [W, W],
    damage: 70,
    text: 'During your next turn, this Pokémon can\'t attack.'
  }];

  public set: string = 'JTG';
  public regulationMark: string = 'I';
  public cardImage: string = 'assets/cardback.png';
  public setNumber: string = '36';
  public name: string = 'Lombre';
  public fullName: string = 'Lombre JTG';

  public reduceEffect(store: StoreLike, state: State, effect: Effect): State {
    // Aqua Slash
    if (WAS_ATTACK_USED(effect, 0, this)) {
      const player = effect.player;
      player.active.cannotAttackNextTurnPending = true;
    }
    
    return state;
  }
}