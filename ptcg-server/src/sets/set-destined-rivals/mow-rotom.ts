import { Attack, CardType, PlayerType, PokemonCard, Stage, State, StateUtils, StoreLike, Weakness } from '../../game';
import { Effect } from '../../game/store/effects/effect';
import { MOVE_CARDS, WAS_ATTACK_USED } from '../../game/store/prefabs/prefabs';

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
    damageCalculation: 'x',
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
        const owner = StateUtils.findOwner(state, cardList);
        MOVE_CARDS(store, state, cardList, owner.discard, { cards: [stadiumCard], sourceCard: this, sourceEffect: this.attacks[0] });
      }
    }

    if (WAS_ATTACK_USED(effect, 1, this)) {
      const player = effect.player;
      let toolCount = 0;

      player.forEachPokemon(PlayerType.BOTTOM_PLAYER, (cardList) => {
        toolCount += cardList.tools.length;
      });
      effect.damage = 30 * toolCount;
    }
    return state;
  }
}