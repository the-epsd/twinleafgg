import { PokemonCard } from '../../game/store/card/pokemon-card';
import { Stage, CardType, CardTag } from '../../game/store/card/card-types';
import { State } from '../../game/store/state/state';
import { PowerType, StateUtils, PlayerType } from '../../game';
import { StoreLike } from '../../game/store/store-like';
import { Effect } from '../../game/store/effects/effect';
import { DiscardCardsEffect } from '../../game/store/effects/attack-effects';
import { CheckProvidedEnergyEffect, CheckTableStateEffect } from '../../game/store/effects/check-effects';
import { IS_ABILITY_BLOCKED, WAS_ATTACK_USED } from '../../game/store/prefabs/prefabs';

export class Rotomex extends PokemonCard {
  public stage: Stage = Stage.BASIC;
  public tags = [CardTag.POKEMON_ex];
  public cardType: CardType = L;
  public hp: number = 190;
  public weakness = [{ type: F }];
  public retreat = [C];

  public powers = [{
    name: 'Multi Adapter',
    useWhenInPlay: true,
    powerType: PowerType.ABILITY,
    text: 'Each of your Pokémon that has "Rotom" in its name may have up to 2 Pokémon Tool cards attached. If this Ability goes away, discard Pokémon Tools from those Pokémon until only 1 remains on each.'
  }];

  public attacks = [{
    name: 'Thunderbolt',
    cost: [L, C],
    damage: 130,
    text: 'Discard all Energy from this Pokemon.',
  }];

  public regulationMark = 'I';
  public set: string = 'PFL';
  public cardImage: string = 'assets/cardback.png';
  public setNumber: string = '29';
  public name: string = 'Rotom ex';
  public fullName: string = 'Rotom ex M2';

  public reduceEffect(store: StoreLike, state: State, effect: Effect): State {

    if (effect instanceof CheckTableStateEffect && StateUtils.isPokemonInPlay(effect.player, this)) {
      const player = effect.player;

      // Try to reduce PowerEffect, to check if something is blocking our ability
      if (IS_ABILITY_BLOCKED(store, state, player, this)) {
        return state;
      }

      // Multi Adapter: Set maxTools to 2 for any Pokemon with "Rotom" in their name
      effect.player.forEachPokemon(PlayerType.BOTTOM_PLAYER, (cardList, card) => {
        if (card && card.name.includes('Rotom')) {
          card.maxTools = 2;
        }
      });
    }

    if (WAS_ATTACK_USED(effect, 0, this)) {
      const player = effect.player;

      // Discard all Energy from this Pokemon
      const checkProvidedEnergy = new CheckProvidedEnergyEffect(player, player.active);
      store.reduceEffect(state, checkProvidedEnergy);

      const energyCards = checkProvidedEnergy.energyMap.map(e => e.card);
      if (energyCards.length > 0) {
        const discardEnergy = new DiscardCardsEffect(effect, energyCards);
        discardEnergy.target = player.active;
        store.reduceEffect(state, discardEnergy);
      }
    }

    return state;
  }
}
