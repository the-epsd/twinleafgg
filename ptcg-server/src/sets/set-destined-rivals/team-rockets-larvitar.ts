import { PokemonCard } from '../../game/store/card/pokemon-card';
import { Stage, CardType, CardTag } from '../../game/store/card/card-types';
import { StoreLike, State } from '../../game';
import { Effect } from '../../game/store/effects/effect';
import { MOVE_CARDS, WAS_ATTACK_USED } from '../../game/store/prefabs/prefabs';

export class TeamRocketsLarvitar extends PokemonCard {
  public stage: Stage = Stage.BASIC;
  public tags = [CardTag.TEAM_ROCKET];
  public cardType: CardType = F;
  public hp: number = 70;
  public weakness = [{ type: G }];
  public retreat = [C];

  public attacks = [
    {
      name: 'Mountain Munch',
      cost: [C],
      damage: 10,
      text: 'Discard the top card of your opponent\'s deck.'
    }
  ];

  public regulationMark = 'I';
  public set: string = 'DRI';
  public setNumber: string = '94';
  public cardImage: string = 'assets/cardback.png';
  public name: string = 'Team Rocket\'s Larvitar';
  public fullName: string = 'Team Rocket\'s Larvitar DRI';

  public reduceEffect(store: StoreLike, state: State, effect: Effect): State {
    if (WAS_ATTACK_USED(effect, 0, this)) {
      MOVE_CARDS(store, state, effect.opponent.deck, effect.opponent.discard, { count: 1 });
    }

    return state;
  }
}
