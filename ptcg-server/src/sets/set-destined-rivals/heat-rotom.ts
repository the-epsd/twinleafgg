import { Attack, CardType, PlayerType, PokemonCard, Stage, State, StoreLike, Weakness } from '../../game';
import { Effect } from '../../game/store/effects/effect';
import { YOUR_OPPPONENTS_ACTIVE_POKEMON_IS_NOW_BURNED } from '../../game/store/prefabs/attack-effects';
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
    damageCalculation: 'x',
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
      YOUR_OPPPONENTS_ACTIVE_POKEMON_IS_NOW_BURNED(store, state, effect);
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