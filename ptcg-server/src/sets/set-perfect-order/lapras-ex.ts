import { PokemonCard, Stage, CardTag, CardType, StoreLike, State, PlayerType } from "../../game";
import { CheckProvidedEnergyEffect } from "../../game/store/effects/check-effects";
import { Effect } from "../../game/store/effects/effect";
import { WAS_ATTACK_USED, AFTER_ATTACK, SWITCH_ACTIVE_WITH_BENCHED } from "../../game/store/prefabs/prefabs";


export class Laprasex extends PokemonCard {
  public stage: Stage = Stage.STAGE_1;
  public tags = [CardTag.POKEMON_ex];
  public cardType: CardType = W;
  public hp: number = 210;
  public weakness = [{ type: L }];
  public retreat = [C, C];

  public attacks = [{
    name: 'Hydro Turn',
    cost: [W],
    damage: 30,
    damageCalculation: 'x',
    text: 'This attack does 30 damage for each [W] Energy attached to this Pokémon. Switch this Pokémon with 1 of your Benched Pokémon.'
  },
  {
    name: 'Surf',
    cost: [W, W, W],
    damage: 140,
    text: ''
  }];

  public regulationMark = 'I';
  public set: string = 'POR';
  public cardImage: string = 'assets/cardback.png';
  public setNumber: string = '22';
  public name: string = 'Lapras ex';
  public fullName: string = 'Lapras ex POR';

  public reduceEffect(store: StoreLike, state: State, effect: Effect): State {
    if (WAS_ATTACK_USED(effect, 0, this)) {
      const player = effect.player;
      player.forEachPokemon(PlayerType.BOTTOM_PLAYER, (cardList, card, target) => {
        if (cardList.getPokemonCard() === this) {
          const checkProvidedEnergy = new CheckProvidedEnergyEffect(player, cardList);
          store.reduceEffect(state, checkProvidedEnergy);

          const waterEnergyCount = checkProvidedEnergy.energyMap.reduce((sum, em) =>
            sum + em.provides.filter(t => t === CardType.WATER || t === CardType.ANY).length, 0);

          effect.damage = waterEnergyCount * 30;
        }
      });
      return state;
    }

    if (AFTER_ATTACK(effect, 0, this)) {
      const player = effect.player;
      SWITCH_ACTIVE_WITH_BENCHED(store, state, player);
      return state;
    }

    return state;
  }
}
