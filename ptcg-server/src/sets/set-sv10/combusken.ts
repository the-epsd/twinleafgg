import { PokemonCard, Stage, CardType, State, StoreLike } from '../../game';
import { Effect } from '../../game/store/effects/effect';
import { COIN_FLIP_PROMPT, WAS_ATTACK_USED } from '../../game/store/prefabs/prefabs';

export class Combusken extends PokemonCard {
  public stage: Stage = Stage.STAGE_1;
  public evolvesFrom = 'Torchic';
  public cardType: CardType = R;
  public hp: number = 100;
  public weakness = [{ type: W }];
  public retreat = [ C, C ];

  public attacks = [
    {
      name: 'Combustion',
      cost: [ R ],
      damage: 20,
      text: ''
    },
    {
      name: 'Double Kick',
      cost: [ R, C ],
      damage: 40,
      damageCalculation: 'x',
      text: 'Flip 2 coins. This attack does 40 damage for each heads.'
    },
  ];

  public set: string = 'SV10';
  public regulationMark = 'I';
  public cardImage: string = 'assets/cardback.png';
  public setNumber: string = '20';
  public name: string = 'Combusken';
  public fullName: string = 'Combusken SV10';

  public reduceEffect(store: StoreLike, state: State, effect: Effect): State {
    if (WAS_ATTACK_USED(effect, 1, this)){
      let heads = 0;
      COIN_FLIP_PROMPT(store, state, effect.player, result => { if (result) { heads++; } });
      COIN_FLIP_PROMPT(store, state, effect.player, result => { if (result) { heads++; } });
      effect.damage = 40 * heads;
    }
    
    return state;
  }
}
