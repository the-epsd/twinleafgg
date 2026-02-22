import { Attack, CardType, PlayerType, PokemonCard, PokemonCardList, SpecialCondition, Stage, State, StoreLike, Weakness } from '../../game';
import { AddSpecialConditionsEffect } from '../../game/store/effects/attack-effects';
import { Effect } from '../../game/store/effects/effect';

import { WAS_ATTACK_USED } from '../../game/store/prefabs/prefabs';

export class HeatRotom extends PokemonCard {

  public stage: Stage = Stage.BASIC;
  public cardType: CardType = R;
  public hp: number = 80;
  public weakness: Weakness[] = [{ type: W }];
  public retreat: CardType[] = [C, C];

  public attacks: Attack[] = [{
    name: 'Singe',
    cost: [R],
    damage: 0,
    text: 'Your opponent\'s Active Pokémon is now Burned.'
  }, {
    name: 'Gadget Show',
    cost: [C, C],
    damage: 30,
    text: 'This attack does 30 damage for each Pokémon Tool attached to all of your Pokémon.',
  }];

  public regulationMark: string = 'I';
  public set: string = 'DRI';
  public setNumber: string = '43';
  public cardImage: string = 'assets/cardback.png';
  public name: string = 'Heat Rotom';
  public fullName: string = 'Heat Rotom DRI';

  public reduceEffect(store: StoreLike, state: State, effect: Effect): State {

    if (WAS_ATTACK_USED(effect, 0, this)) {
      const player = effect.player;
      player.forEachPokemon(PlayerType.TOP_PLAYER, (cardList: PokemonCardList) => {
        const specialConditionEffect = new AddSpecialConditionsEffect(effect, [SpecialCondition.BURNED]);
        state = store.reduceEffect(state, specialConditionEffect);
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