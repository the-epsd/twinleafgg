import { GameError, GameMessage, PlayerType, PokemonCardList, PowerType, StateUtils } from '../../game';
import { CardType, EnergyType, Stage } from '../../game/store/card/card-types';
import { EnergyCard } from '../../game/store/card/energy-card';
import { CheckPokemonPowersEffect } from '../../game/store/effects/check-effects';
import { Effect } from '../../game/store/effects/effect';
import { PowerEffect } from '../../game/store/effects/game-effects';

import { EndTurnEffect } from '../../game/store/effects/game-phase-effects';
import { SEARCH_YOUR_DECK_FOR_POKEMON_AND_PUT_ONTO_BENCH } from '../../game/store/prefabs/prefabs';
import { State } from '../../game/store/state/state';
import { StoreLike } from '../../game/store/store-like';

export class CallEnergy extends EnergyCard {
  public provides: CardType[] = [CardType.COLORLESS];
  public energyType = EnergyType.SPECIAL;
  public set: string = 'MD';
  public cardImage: string = 'assets/cardback.png';
  public setNumber: string = '92';
  public name = 'Call Energy';
  public fullName = 'Call Energy MD';

  public powers = [{
    name: 'Call Energy',
    text: 'Call Energy provides [C] Energy. Once during your turn, if the Pokémon Call Energy is attached to is your Active Pokémon, you may search your deck for up to 2 Basic Pokémon and put them onto your Bench. If you do, shuffle your deck and your turn ends.',
    useWhenInPlay: true,
    exemptFromAbilityLock: true,
    powerType: PowerType.ENERGY_ABILITY
  }];

  public reduceEffect(store: StoreLike, state: State, effect: Effect): State {

    if (effect instanceof CheckPokemonPowersEffect && StateUtils.findCardList(state, effect.target) instanceof PokemonCardList &&
      StateUtils.findCardList(state, effect.target).cards.includes(this) &&
      !effect.powers.find(p => p.name === this.powers[0].name)) {
      effect.powers.push(this.powers[0]);
    }

    if (effect instanceof PowerEffect && effect.power === this.powers[0]) {
      const player = effect.player;
      // Has to be active
      player.forEachPokemon(PlayerType.BOTTOM_PLAYER, cardList => {
        if (cardList.cards.includes(this)) {
          if (cardList !== player.active) {
            throw new GameError(GameMessage.CANNOT_USE_POWER);
          }
        }
      });

      SEARCH_YOUR_DECK_FOR_POKEMON_AND_PUT_ONTO_BENCH(store, state, player, { stage: Stage.BASIC }, { min: 0, max: 2 });
      const endTurnEffect = new EndTurnEffect(player);
      return store.reduceEffect(state, endTurnEffect);
    }
    return state;
  }

}
