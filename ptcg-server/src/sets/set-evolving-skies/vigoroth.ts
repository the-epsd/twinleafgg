import { PokemonCard } from '../../game/store/card/pokemon-card';
import { Stage, CardType } from '../../game/store/card/card-types';
import { StoreLike, State, StateUtils } from '../../game';
import { Effect } from '../../game/store/effects/effect';
import { AFTER_ATTACK, MOVE_CARDS } from '../../game/store/prefabs/prefabs';

export class Vigoroth extends PokemonCard {
  public stage: Stage = Stage.STAGE_1;
  public evolvesFrom = 'Slakoth';
  public cardType: CardType = CardType.COLORLESS;
  public hp: number = 90;
  public weakness = [{ type: CardType.FIGHTING }];
  public retreat = [CardType.COLORLESS];

  public attacks = [{
    name: 'Shatter',
    cost: [CardType.COLORLESS],
    damage: 20,
    text: 'Discard a Stadium in play.'
  },
  {
    name: 'Slash',
    cost: [CardType.COLORLESS, CardType.COLORLESS],
    damage: 50,
    text: ''
  }];

  public set: string = 'EVS';
  public regulationMark: string = 'E';
  public cardImage: string = 'assets/cardback.png';
  public setNumber: string = '130';
  public name: string = 'Vigoroth';
  public fullName: string = 'Vigoroth EVS';

  public reduceEffect(store: StoreLike, state: State, effect: Effect): State {

    if (AFTER_ATTACK(effect, 0, this)) {
      const stadiumCard = StateUtils.getStadiumCard(state);
      if (stadiumCard !== undefined) {

        // Discard Stadium
        const cardList = StateUtils.findCardList(state, stadiumCard);
        const player = StateUtils.findOwner(state, cardList);
        MOVE_CARDS(store, state, cardList, player.discard, { cards: [stadiumCard], sourceCard: this, sourceEffect: this.attacks[0] });
        return state;
      }

    }

    return state;
  }

}