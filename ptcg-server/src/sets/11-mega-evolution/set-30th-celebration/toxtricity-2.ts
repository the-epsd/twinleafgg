import { PokemonCard } from '../../../game/store/card/pokemon-card';
import { Stage, CardType } from '../../../game/store/card/card-types';
import { StoreLike, State } from '../../../game';
import { Effect } from '../../../game/store/effects/effect';
import { WAS_ATTACK_USED } from '../../../game/store/prefabs/prefabs';

export class Toxtricity2 extends PokemonCard {
  public stage: Stage = Stage.STAGE_1;
  public evolvesFrom: string = 'Toxel';
  public hp: number = 140;
  public cardType: CardType[] = [L];
  public weakness = [{ type: F }];
  public retreat = [C, C];

  public attacks = [{
    name: 'Light Punch',
    cost: [L],
    damage: 40,
    text: ''
  },
  {
    name: 'Thunderous Bolt',
    cost: [L, C, C],
    damage: 150,
    text: 'During your next turn, this Pokémon can\'t use attacks.'
  }];

  public regulationMark: string = 'J';
  public set: string = '30C';
  public cardImage: string = 'assets/cardback.png';
  public setNumber: string = '60';
  public name: string = 'Toxtricity';
  public fullName: string = 'Toxtricity 30C 60';

  public reduceEffect(store: StoreLike, state: State, effect: Effect): State {
    // Thunderous Bolt
    if (WAS_ATTACK_USED(effect, 1, this)) {
      effect.player.active.cannotAttackNextTurnPending = true;
    }

    return state;
  }
}
