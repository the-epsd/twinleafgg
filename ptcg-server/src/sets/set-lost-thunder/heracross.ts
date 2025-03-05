import { PlayerType, State, StoreLike } from '../../game';
import { CardType, Stage } from '../../game/store/card/card-types';
import { PokemonCard } from '../../game/store/card/pokemon-card';
import { Effect } from '../../game/store/effects/effect';
import { WAS_ATTACK_USED } from '../../game/store/prefabs/prefabs';


export class Heracross extends PokemonCard {

  public stage: Stage = Stage.BASIC;  
  
  public cardType: CardType = CardType.GRASS;

  public hp: number = 120;

  public weakness = [{ type: CardType.FIRE }];

  public retreat = [ CardType.COLORLESS, CardType.COLORLESS ];

  public attacks = [
    {
      name: 'Tackle',
      cost: [ CardType.COLORLESS ],
      damage: 20,
      text: ''
    },
    {
      name: 'Powerful Friends',
      cost: [ CardType.GRASS, CardType.COLORLESS ],
      damage: 30,
      damageCalculation: '+',
      text: 'If you have any Stage 2 Pokémon on your Bench, this attack does 90 more damage.'
    },
  ];

  public set: string = 'BRS';

  public cardImage: string = 'assets/cardback.png';

  public setNumber: string = '12';

  public name: string = 'Heracross';

  public fullName: string = 'Heracross BRS';

  public reduceEffect(store: StoreLike, state: State, effect: Effect): State {
    if (WAS_ATTACK_USED(effect, 1, this)) {
      const player = effect.player;

      let hasStage2 = false;
      player.forEachPokemon(PlayerType.BOTTOM_PLAYER, (cardList, card) => {
        if (card.stage === Stage.STAGE_2) {
          hasStage2 = true;
        }
      });

      if (hasStage2) {
        effect.damage += 90;
      }
    }
    
    return state;
  }  
}