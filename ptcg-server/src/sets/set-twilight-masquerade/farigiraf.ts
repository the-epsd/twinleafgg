import { PokemonCard } from '../../game/store/card/pokemon-card';
import { Stage, CardType } from '../../game/store/card/card-types';
import { StoreLike, State, PlayerType } from '../../game';
import { Effect } from '../../game/store/effects/effect';
import {ADD_CONFUSION_TO_PLAYER_ACTIVE, WAS_ATTACK_USED} from '../../game/store/prefabs/prefabs';

export class Farigiraf extends PokemonCard {
  public regulationMark = 'H';
  public stage: Stage = Stage.STAGE_1;
  public evolvesFrom = 'Girafarig'
  public cardType: CardType = P;
  public hp: number = 140;
  public weakness = [{ type: D }];
  public resistance = [{ type: F, value: -30 }];
  public retreat = [ C, C ];

  public attacks = [
    {
      name: 'One-derful Rumble',
      cost: [ C, C ],
      damage: 40,
      damageCalculation: 'x',
      text: 'This attack does 40 damage for each of your Stage 1 Pokémon in play.'
    },
    {
      name: 'Eerie Wave',
      cost: [ P, C, C ],
      damage: 80,
      text: 'Your opponent\'s Active Pokémon is now Confused.'
    }
  ];

  public set: string = 'TWM';
  public cardImage: string = 'assets/cardback.png';
  public setNumber: string = '84';
  public name: string = 'Farigiraf';
  public fullName: string = 'Farigiraf TWM';

  public reduceEffect(store: StoreLike, state: State, effect: Effect): State {
    // One-derful Rumble
    if (WAS_ATTACK_USED(effect, 0, this)){
      const player = effect.player;

      let stage1s = 0;

      player.forEachPokemon(PlayerType.BOTTOM_PLAYER, cardList => {
        if (cardList.getPokemonCard()?.stage === Stage.STAGE_1){
          stage1s++;
        }
      });

      effect.damage = 40 * stage1s;
    }

    // Eerie Wave
    if (WAS_ATTACK_USED(effect, 1, this)){
      ADD_CONFUSION_TO_PLAYER_ACTIVE(store, state, effect.opponent, this);
    }
    
    return state;
  }
}