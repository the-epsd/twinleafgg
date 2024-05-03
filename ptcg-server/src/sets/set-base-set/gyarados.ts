import { PokemonCard } from '../../game/store/card/pokemon-card';
import { Stage, CardType, SpecialCondition } from '../../game/store/card/card-types';
import { StoreLike, State, GameMessage } from '../../game';
import { AttackEffect } from '../../game/store/effects/game-effects';
import { Effect } from '../../game/store/effects/effect';
import { CoinFlipPrompt } from '../../game/store/prompts/coin-flip-prompt';
import { AddSpecialConditionsEffect } from '../../game/store/effects/attack-effects';

export class Gyarados extends PokemonCard {
  
  public set = 'BS';
  
  public fullName = 'Gyarados BS';
  
  public name = 'Gyarados';

  public cardType: CardType = CardType.WATER;  
  
  public stage: Stage = Stage.STAGE_1;
  
  public evolvesFrom: string = 'Magikarp';

  public cardImage: string = 'assets/cardback.png';

  public setNumber: string = '6';
  
  public hp: number = 100;

  public weakness = [{ type: CardType.LIGHTNING }];

  public retreat = [CardType.COLORLESS, CardType.COLORLESS];

  public attacks = [
    {
      name: 'Dragon Rage', 
      cost: [CardType.WATER, CardType.WATER, CardType.WATER],
      damage: 40,
      text: ''
    },
    {
      name: 'Bubble Beam', 
      cost: [CardType.WATER, CardType.WATER, CardType.WATER, CardType.WATER],
      damage: 50,
      text: 'Flip a coin. If heads, the Defending Pokémon is now Paralyzed.'
    }
  ];

  public reduceEffect(store: StoreLike, state: State, effect: Effect): State {

    if (effect instanceof AttackEffect && effect.attack === this.attacks[1]) {
      
      const player = effect.player;      
      
      return store.prompt(state, [
        new CoinFlipPrompt(player.id, GameMessage.COIN_FLIP)
      ], result => {
        if (result === true) {
          const specialCondition = new AddSpecialConditionsEffect(effect, [SpecialCondition.PARALYZED]);
          store.reduceEffect(state, specialCondition);
        }
      });
    }

    return state;
  }

}