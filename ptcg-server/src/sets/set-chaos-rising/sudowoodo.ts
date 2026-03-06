import { CardType, Stage, SuperType } from '../../game/store/card/card-types';
import { Effect } from '../../game/store/effects/effect';
import { PokemonCard, StoreLike, State } from '../../game';
import { WAS_ATTACK_USED } from '../../game/store/prefabs/prefabs';
import { SEARCH_DECK_FOR_CARDS_TO_HAND } from '../../game/store/prefabs/prefabs';

export class Sudowoodo extends PokemonCard {
  public stage: Stage = Stage.BASIC;
  public hp: number = 110;
  public cardType: CardType = F;
  public weakness = [{ type: G }];
  public retreat = [C];

  public attacks = [{
    name: 'Learning Journey',
    cost: [C],
    damage: 0,
    text: 'Search your deck for up to 2 Book of Transformation, reveal them, and put them into your hand. Then, shuffle your deck.'
  },
  {
    name: 'Rock Hurl',
    cost: [F],
    damage: 30,
    text: 'This attack damage isn\'t affected by Resistance.'
  }];

  public regulationMark = 'J';
  public set: string = 'M4';
  public cardImage: string = 'assets/cardback.png';
  public setNumber: string = '43';
  public name: string = 'Sudowoodo';
  public fullName: string = 'Sudowoodo M4';

  public reduceEffect(store: StoreLike, state: State, effect: Effect): State {
    if (WAS_ATTACK_USED(effect, 0, this)) {
      const player = effect.player;
      SEARCH_DECK_FOR_CARDS_TO_HAND(store, state, player, this,
        { superType: SuperType.TRAINER, name: 'Book of Transformation' },
        { min: 0, max: 2, allowCancel: false },
        this.attacks[0]
      );
    }
    if (WAS_ATTACK_USED(effect, 1, this)) {
      effect.ignoreResistance = true;
    }
    return state;
  }
}
