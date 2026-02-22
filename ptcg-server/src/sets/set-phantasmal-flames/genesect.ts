import { PokemonCard } from '../../game/store/card/pokemon-card';
import { Stage, CardType } from '../../game/store/card/card-types';
import { State } from '../../game/store/state/state';

import { StoreLike } from '../../game/store/store-like';
import { Effect } from '../../game/store/effects/effect';
import { ChoosePokemonPrompt, GameMessage, PlayerType, SlotType } from '../../game';
import { DAMAGE_OPPONENT_POKEMON, WAS_ATTACK_USED } from '../../game/store/prefabs/prefabs';
import { CheckProvidedEnergyEffect } from '../../game/store/effects/check-effects';

export class Genesect extends PokemonCard {
  public stage = Stage.BASIC;
  public cardType = CardType.GRASS;
  public hp = 120;
  public weakness = [{ type: R }];
  public retreat = [C, C];

  public attacks = [{
    name: 'Bug\'s Cannon',
    cost: [G],
    damage: 0,
    text: 'Choose 1 of your opponent\'s Pokémon. This attack does 20 damage to it for each [G] Energy attached to this Pokémon. (Don\'t apply Weakness and Resistance for Benched Pokémon.)'
  },
  {
    name: 'Speed Attack',
    cost: [G, G, C],
    damage: 110,
    text: ''
  }];

  public regulationMark = 'I';
  public set: string = 'PFL';
  public cardImage: string = 'assets/cardback.png';
  public setNumber: string = '8';
  public name: string = 'Genesect';
  public fullName: string = 'Genesect M2';

  public reduceEffect(store: StoreLike, state: State, effect: Effect): State {

    if (WAS_ATTACK_USED(effect, 0, this)) {
      const player = effect.player;

      // Count Grass energy attached to this Pokemon
      const checkProvidedEnergy = new CheckProvidedEnergyEffect(player, player.active);
      state = store.reduceEffect(state, checkProvidedEnergy);

      const grassEnergyCount = checkProvidedEnergy.energyMap.reduce((sum: number, energy: any) => {
        return sum + energy.provides.filter((type: CardType) => type === CardType.GRASS || type === CardType.ANY).length;
      }, 0);

      const damageOutput = grassEnergyCount * 20;

      const max = Math.min(1);
      return store.prompt(state, new ChoosePokemonPrompt(
        player.id,
        GameMessage.CHOOSE_POKEMON_TO_DAMAGE,
        PlayerType.TOP_PLAYER,
        [SlotType.ACTIVE, SlotType.BENCH],
        { min: max, max, allowCancel: false }
      ), selected => {
        const targets = selected || [];
        DAMAGE_OPPONENT_POKEMON(store, state, effect, damageOutput, targets);
      });
    }
    return state;
  }
}
