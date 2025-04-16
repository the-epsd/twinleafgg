import { PokemonCard } from '../../game/store/card/pokemon-card';
import { Stage, CardType, CardTag } from '../../game/store/card/card-types';
import {StoreLike,State} from '../../game';
import {Effect} from '../../game/store/effects/effect';
import {COIN_FLIP_PROMPT, WAS_ATTACK_USED} from '../../game/store/prefabs/prefabs';

export class TeamRocketsNidoranFemale extends PokemonCard {
  public stage: Stage = Stage.BASIC;
  public tags = [CardTag.TEAM_ROCKET];
  public cardType: CardType = D;
  public hp: number = 70;
  public weakness = [{ type: F }];
  public retreat = [ C ];

  public attacks = [
    {
      name: 'Suprise Attack',
      cost: [D],
      damage: 30,
      text: 'Flip a coin. If tails, this attack does nothing.'
    }
  ];

  public regulationMark = 'I';
  public set: string = 'SV10';
  public setNumber: string = '58';
  public cardImage: string = 'assets/cardback.png';
  public name: string = 'Team Rocket\'s Nidoran F';
  public fullName: string = 'Team Rocket\'s Nidoran F SV10';

  public reduceEffect(store: StoreLike, state: State, effect: Effect): State {
    if (WAS_ATTACK_USED(effect, 0, this)){
      COIN_FLIP_PROMPT(store, state, effect.player, result => { if (!result){ effect.damage = 0; } });
    }
    
    return state;
  }
}
