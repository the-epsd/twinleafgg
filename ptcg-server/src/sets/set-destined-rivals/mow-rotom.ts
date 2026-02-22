import { Attack, CardType, PokemonCard, Stage, State, StateUtils, StoreLike, Weakness } from '../../game';
import { Effect } from '../../game/store/effects/effect';

import { WAS_ATTACK_USED } from '../../game/store/prefabs/prefabs';

export class MowRotom extends PokemonCard {

  public stage: Stage = Stage.BASIC;
  public cardType: CardType = G;
  public hp: number = 70;
  public weakness: Weakness[] = [{ type: F }];
  public retreat: CardType[] = [C];

  public attacks: Attack[] = [{
    name: 'Trimming Mower',
    cost: [G],
    damage: 0,
    text: 'Discard a Stadium in play.'
  }, {
    name: 'Gadget Show',
    cost: [C, C],
    damage: 30,
    text: 'This attack does 30 damage for each Pokémon Tool attached to all of your Pokémon.',
  }];

  public regulationMark: string = 'I';
  public set: string = 'DRI';
  public setNumber: string = '9';
  public cardImage: string = 'assets/cardback.png';
  public name: string = 'Mow Rotom';
  public fullName: string = 'Mow Rotom DRI';

  public reduceEffect(store: StoreLike, state: State, effect: Effect): State {

    if (WAS_ATTACK_USED(effect, 0, this)) {
      const stadiumCard = StateUtils.getStadiumCard(state);
      if (stadiumCard) {
        const cardList = StateUtils.findCardList(state, stadiumCard);
        if (cardList) {
          const player = StateUtils.findOwner(state, cardList);
          cardList.moveTo(player.discard);
        }
      }
    }

    if (WAS_ATTACK_USED(effect, 1, this)) {
      const player = effect.player;
      let toolCount = 0;

      [player.active, ...player.bench].forEach(list => {
        list.cards.forEach(card => {
          if (card instanceof PokemonCard && card.tools.length > 0) {
            toolCount += card.tools.length;
          }
        });
      });
      effect.damage = 30 * toolCount;
    }
    return state;
  }
}