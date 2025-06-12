import { State, StoreLike } from '../../game';
import { CardTag, CardType, Stage } from '../../game/store/card/card-types';
import { PokemonCard } from '../../game/store/card/pokemon-card';
import { Effect } from '../../game/store/effects/effect';
import { DRAW_CARDS, WAS_ATTACK_USED } from '../../game/store/prefabs/prefabs';

export class TeamMagmasNumel extends PokemonCard {
  public stage: Stage = Stage.BASIC;
  public tags = [CardTag.TEAM_MAGMA];
  public cardType: CardType = R;
  public hp: number = 50;
  public weakness = [{ type: W }];
  public retreat = [C];

  public attacks = [{
    name: 'Collect',
    cost: [C],
    damage: 0,
    text: 'Draw a card.'
  },
  {
    name: 'Combustion',
    cost: [R, C],
    damage: 10,
    text: ''
  }];


  public set: string = 'MA';
  public cardImage: string = 'assets/cardback.png';
  public setNumber: string = '64';
  public name: string = 'Team Magma\'s Numel';
  public fullName: string = 'Team Magma\'s Numel MA';

  public reduceEffect(store: StoreLike, state: State, effect: Effect): State {

    if (WAS_ATTACK_USED(effect, 0, this)) {
      DRAW_CARDS(effect.player, 1);
    }

    return state;
  }
}