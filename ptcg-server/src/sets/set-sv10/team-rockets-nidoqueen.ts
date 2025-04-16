import { PokemonCard } from '../../game/store/card/pokemon-card';
import { Stage, CardType, CardTag } from '../../game/store/card/card-types';
import {StoreLike,State, PlayerType} from '../../game';
import {Effect} from '../../game/store/effects/effect';
import {WAS_ATTACK_USED} from '../../game/store/prefabs/prefabs';

export class TeamRocketsNidoqueen extends PokemonCard {
  public stage: Stage = Stage.STAGE_2;
  public evolvesFrom = 'Team Rocket\'s Nidorina';
  public tags = [CardTag.TEAM_ROCKET];
  public cardType: CardType = D;
  public hp: number = 170;
  public weakness = [{ type: F }];
  public retreat = [ C, C, C ];

  public attacks = [
    {
      name: 'Love Impact',
      cost: [D],
      damage: 60,
      damageCalculation: '+',
      text: 'If you have any Benched Pokémon with Nidoking in its name, this attack does 120 more damage.'
    },
    {
      name: 'Mega Kick',
      cost: [D, D],
      damage: 130,
      text: ''
    }
  ];

  public regulationMark = 'I';
  public set: string = 'SV10';
  public setNumber: string = '60';
  public cardImage: string = 'assets/cardback.png';
  public name: string = 'Team Rocket\'s Nidoqueen';
  public fullName: string = 'Team Rocket\'s Nidoqueen SV10';

  public reduceEffect(store: StoreLike, state: State, effect: Effect): State {
    // Love Impact
    if (WAS_ATTACK_USED(effect, 0, this)){
      const player = effect.player;

      let isNidokingInPlay = false;
      player.forEachPokemon(PlayerType.BOTTOM_PLAYER, card => {
        if (card.getPokemonCard()?.name.includes('Nidoking')){
          isNidokingInPlay = true;
        }
      });
      
      if (isNidokingInPlay){ effect.damage += 120; }
    }
    
    return state;
  }
}
