import { PokemonCard } from '../../game/store/card/pokemon-card';
import { Stage, CardType, CardTag } from '../../game/store/card/card-types';
import { StoreLike,State, PlayerType } from '../../game';
import { Effect } from '../../game/store/effects/effect';
import { AttackEffect } from '../../game/store/effects/game-effects';

export class GreatTusk2 extends PokemonCard {
  public stage: Stage = Stage.BASIC;
  public tags = [ CardTag.ANCIENT ];
  public cardType: CardType = F;
  public hp: number = 140;
  public weakness = [{ type: P }];
  public retreat = [ C, C, C, C ];

  public attacks = [
    { 
      name: 'Lunge Out', 
      cost: [F, C], 
      damage: 30, 
      text: '' 
    },
    { 
      name: 'Wrathgul Charge', 
      cost: [F, C, C], 
      damage: 80,
      damageCalculation: '+', 
      text: 'If your Benched Pokémon have any damage counters on them, this attack does 80 more damage.' 
    },
    
  ];

  public set: string = 'TEF';
  public regulationMark = 'H';
  public cardImage: string = 'assets/cardback.png';
  public setNumber: string = '96';

  public name: string = 'Great Tusk';
  public fullName: string = 'Great Tusk TEF';

  public reduceEffect(store: StoreLike, state: State, effect: Effect): State {
    // Wrathful Charge
    if (effect instanceof AttackEffect && effect.attack === this.attacks[1]) {
      const player = effect.player;

      // checking if this pokemon is in play
      let isThereDamage = false;
      player.forEachPokemon(PlayerType.BOTTOM_PLAYER, (cardList) => {
        if (cardList === player.active) {
          return;
        }
        if (cardList.damage > 0) {
          isThereDamage = true;
        }
      });
      if (isThereDamage) {
        effect.damage += 80;
      }
    }
    
    return state;
  }
  
}