import { PokemonCard } from '../../../game/store/card/pokemon-card';
import { Stage, CardType } from '../../../game/store/card/card-types';
import { StoreLike, State, PokemonCardList, StateUtils } from '../../../game';
import { Effect } from '../../../game/store/effects/effect';
import { HealEffect } from '../../../game/store/effects/game-effects';
import { WAS_ATTACK_USED } from '../../../game/store/prefabs/prefabs';

export class Slakoth extends PokemonCard {

  public stage: Stage = Stage.BASIC;

  public cardType: CardType = CardType.COLORLESS;

  public hp: number = 90;

  public weakness = [{ type: CardType.FIGHTING }];

  public retreat = [CardType.COLORLESS, CardType.COLORLESS];

  public attacks = [
    {
      name: 'Take It Easy',
      cost: [CardType.COLORLESS],
      damage: 0,
      text: 'Heal 60 damage from this Pokemon. During your next turn, this Pokemon can\'t retreat.'
    }
  ];

  public set: string = 'SSP';

  public setNumber = '145';

  public cardImage = 'assets/cardback.png';

  public regulationMark: string = 'H';

  public name: string = 'Slakoth';

  public fullName: string = 'Slakoth SSP';

  public reduceEffect(store: StoreLike, state: State, effect: Effect): State {
    // Take It Easy
    if (WAS_ATTACK_USED(effect, 0, this)) {
      const player = effect.player;
      const cardList = StateUtils.findCardList(state, this) as PokemonCardList;

      const healEffect = new HealEffect(player, cardList, 60);
      store.reduceEffect(state, healEffect);

      cardList.cannotRetreatNextTurnPending = true;
    }

    return state;
  }

}
