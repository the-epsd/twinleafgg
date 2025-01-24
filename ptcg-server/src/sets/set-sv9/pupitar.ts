import { PokemonCard } from '../../game/store/card/pokemon-card';
import { Stage, CardType } from '../../game/store/card/card-types';
import { StoreLike, State } from '../../game';
import { AttackEffect } from '../../game/store/effects/game-effects';
import { Effect } from '../../game/store/effects/effect';
import { PutDamageEffect } from '../../game/store/effects/attack-effects';

export class Pupitar extends PokemonCard {
  public stage: Stage = Stage.STAGE_1;
  public evolvesFrom = 'Larvitar';
  public cardType: CardType = CardType.FIGHTING;
  public hp: number = 90;
  public weakness = [{ type: CardType.GRASS }];
  public retreat = [ CardType.COLORLESS ];

  public attacks = [
    { name: 'Take Down', 
      cost: [ CardType.COLORLESS, CardType.COLORLESS ], 
      damage: 60, 
      text: 'This Pokémon also does 20 damage to itself.' }
  ];

  public set: string = 'SV9';
  public regulationMark = 'I';
  public cardImage: string = 'assets/cardback.png';
  public setNumber: string = '48';

  public name: string = 'Pupitar';
  public fullName: string = 'Pupitar SV9';

  
  public reduceEffect(store: StoreLike, state: State, effect: Effect): State {
    if (effect instanceof AttackEffect && effect.attack === this.attacks[0]){
      const player = effect.player;
      
      const damageEffect = new PutDamageEffect(effect, 20);
      damageEffect.target = player.active;
      store.reduceEffect(state, damageEffect);
    }

    return state;
  }
  
}