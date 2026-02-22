import { Attack, CardType, PlayerType, PokemonCard, PokemonCardList, Stage, State, StoreLike, Weakness } from '../../game';
import { Effect } from '../../game/store/effects/effect';
import { HealEffect } from '../../game/store/effects/game-effects';
import { WAS_ATTACK_USED } from '../../game/store/prefabs/prefabs';

export class WashRotom extends PokemonCard {

  public stage: Stage = Stage.BASIC;
  public cardType: CardType = W;
  public hp: number = 80;
  public weakness: Weakness[] = [{ type: L }];
  public retreat: CardType[] = [C, C];

  public attacks: Attack[] = [{
    name: 'Manual Wash',
    cost: [L],
    damage: 20,
    text: 'Heal 10 damage from each of your Pokémon.'
  }, {
    name: 'Gadget Show',
    cost: [C, C],
    damage: 30,
    text: 'This attack does 30 damage for each Pokémon Tool attached to all of your Pokémon.',
  }];

  public regulationMark: string = 'I';
  public set: string = 'DRI';
  public setNumber: string = '61';
  public cardImage: string = 'assets/cardback.png';
  public name: string = 'Wash Rotom';
  public fullName: string = 'Wash Rotom DRI';

  public reduceEffect(store: StoreLike, state: State, effect: Effect): State {

    if (WAS_ATTACK_USED(effect, 0, this)) {
      const player = effect.player;
      player.forEachPokemon(PlayerType.BOTTOM_PLAYER, (cardList: PokemonCardList) => {
        const healEffect = new HealEffect(player, cardList, 10);
        state = store.reduceEffect(state, healEffect);
        return state;
      });
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