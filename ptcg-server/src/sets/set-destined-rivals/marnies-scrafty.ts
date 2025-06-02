import { PokemonCard } from '../../game/store/card/pokemon-card';
import { Stage, CardType, CardTag } from '../../game/store/card/card-types';
import { StoreLike, State } from '../../game';
import { Effect } from '../../game/store/effects/effect';
import { WAS_ATTACK_USED } from '../../game/store/prefabs/prefabs';
import { DealDamageEffect } from '../../game/store/effects/attack-effects';

export class MarniesScrafty extends PokemonCard {
  public stage: Stage = Stage.STAGE_1;
  public evolvesFrom = 'Marnie\'s Scraggy';
  public tags = [CardTag.MARNIES];
  public cardType: CardType = D;
  public hp: number = 120;
  public weakness = [{ type: G }];
  public retreat = [C, C];

  public attacks = [{
    name: 'Rear Kick',
    cost: [D],
    damage: 40,
    text: ''
  }, {
    name: 'Wild Tackle',
    cost: [D, D, C],
    damage: 160,
    text: 'This Pokémon also does 30 damage to itself.'
  }];

  public regulationMark = 'I';
  public set: string = 'DRI';
  public setNumber = '133';
  public cardImage: string = 'assets/cardback.png';
  public name: string = 'Marnie\'s Scrafty';
  public fullName: string = 'Marnie\'s Scrafty DRI';

  public reduceEffect(store: StoreLike, state: State, effect: Effect): State {
    if (WAS_ATTACK_USED(effect, 1, this)) {
      const player = effect.player;
      const dealDamage = new DealDamageEffect(effect, 30);
      dealDamage.target = player.active;
      return store.reduceEffect(state, dealDamage);
    }
    return state;
  }
}
