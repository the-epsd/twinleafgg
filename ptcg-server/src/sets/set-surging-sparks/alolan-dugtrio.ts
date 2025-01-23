import { PokemonCard } from '../../game/store/card/pokemon-card';
import { Stage, CardType } from '../../game/store/card/card-types';
import { State, StoreLike } from '../../game';
import { Effect } from '../../game/store/effects/effect';
import { AttackEffect } from '../../game/store/effects/game-effects';

export class AlolanDugtrio extends PokemonCard {

  public stage: Stage = Stage.STAGE_1;
  
  public evolvesFrom = 'Alolan Diglett';

  public cardType: CardType = CardType.METAL;

  public hp: number = 110;

  public weakness = [{ type: CardType.FIRE }];

  public resistance = [{ type: CardType.GRASS, value: -30 }];

  public retreat = [ CardType.COLORLESS, CardType.COLORLESS ];

  public attacks = [
    { 
      name: 'Trio-Cheehoo', 
      cost: [ ], 
      damage: 120, 
      text: 'If you don\'t have exactly 3 cards in your hand, this attack does nothing.' }
  ];

  public set: string = 'SSP';

  public setNumber = '123';

  public cardImage = 'assets/cardback.png';

  public regulationMark: string = 'H';

  public name: string = 'Alolan Dugtrio';

  public fullName: string = 'Alolan Dugtrio SSP';

  public reduceEffect(store: StoreLike, state: State, effect: Effect): State {
    // Trio-Cheehoo
    if (effect instanceof AttackEffect && effect.attack === this.attacks[0]){
      const player = effect.player;

      if (player.hand.cards.length != 3) {
        effect.damage = 0;
      }
    }

    return state;
  }
}
