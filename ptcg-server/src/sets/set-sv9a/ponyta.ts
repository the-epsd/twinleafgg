import { PokemonCard } from '../../game/store/card/pokemon-card';
import { Stage, CardType } from '../../game/store/card/card-types';
import { StoreLike, State } from '../../game';
import { Effect } from '../../game/store/effects/effect';
import { COIN_FLIP_PROMPT, WAS_ATTACK_USED } from '../../game/store/prefabs/prefabs';

export class Ponyta extends PokemonCard {
  public regulationMark = 'I';
  public stage: Stage = Stage.BASIC;
  public cardType: CardType = R;
  public hp: number = 70;
  public weakness = [{ type: W }];
  public retreat = [ C ];

  public attacks = [
    {
      name: 'Double Strike',
      cost: [ C ],
      damage: 10,
      damageCalculation: 'x',
      text: 'Flip 2 coins. This attack does 10 damage for each heads.'
    }
  ];

  public set: string = 'SV9a';
  public cardImage: string = 'assets/cardback.png';
  public setNumber: string = '13';
  public name: string = 'Ponyta';
  public fullName: string = 'Ponyta SV9a';

  public reduceEffect(store: StoreLike, state: State, effect: Effect): State {
    // Double Strike
    if (WAS_ATTACK_USED(effect, 0, this)){
      const player = effect.player;

      let heads = 0;
      COIN_FLIP_PROMPT(store, state, player, result => {
        if (result){ heads++; }
      });
      COIN_FLIP_PROMPT(store, state, player, result => {
        if (result){ heads++; }
      });
      
      effect.damage = heads * 10;
    }
    
    return state;
  }
}