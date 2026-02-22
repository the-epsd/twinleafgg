import { PokemonCard } from '../../game/store/card/pokemon-card';
import { Stage, CardType, SuperType } from '../../game/store/card/card-types';
import { StoreLike } from '../../game/store/store-like';
import { State } from '../../game/store/state/state';
import { Effect } from '../../game/store/effects/effect';

import { GameMessage } from '../../game/game-message';
import { Card } from '../../game';
import { CheckProvidedEnergyEffect } from '../../game/store/effects/check-effects';
import { ChooseEnergyPrompt } from '../../game';
import { DiscardCardsEffect } from '../../game/store/effects/attack-effects';
import { StateUtils } from '../../game/store/state-utils';
import { IS_ABILITY_BLOCKED, WAS_ATTACK_USED } from '../../game/store/prefabs/prefabs';

export class ShiningLugia extends PokemonCard {

  public stage: Stage = Stage.BASIC;
  public cardType: CardType = C;
  public hp: number = 130;
  public weakness = [{ type: L }];
  public resistance = [{ type: F, value: -20 }];
  public retreat = [C, C];

  public attacks = [{
    name: 'Argent Wing',
    cost: [C, C, C],
    damage: 60,
    text: 'If your opponent\'s Active Pokémon has an Ability, this attack does 60 more damage.'
  }, {
    name: 'Aero Force',
    cost: [C, C, C, C],
    damage: 130,
    text: 'Discard an Energy from this Pokémon.'
  }];

  public set: string = 'SMP';
  public setNumber = '82';
  public cardImage = 'assets/cardback.png';
  public name: string = 'Shining Lugia';
  public fullName: string = 'Shining Lugia SMP';

  public reduceEffect(store: StoreLike, state: State, effect: Effect): State {
    if (WAS_ATTACK_USED(effect, 0, this)) {
      const player = effect.player;
      const opponent = StateUtils.getOpponent(state, player);
      const target = opponent.active.getPokemonCard();

      if (target !== undefined && target.powers.length > 0)
        if (!IS_ABILITY_BLOCKED(store, state, player, target))
          effect.damage += 60;
    }

    if (WAS_ATTACK_USED(effect, 1, this)) {
      const player = effect.player;

      if (!player.active.cards.some(c => c.superType === SuperType.ENERGY)) {
        return state;
      }

      const checkProvidedEnergy = new CheckProvidedEnergyEffect(player);
      state = store.reduceEffect(state, checkProvidedEnergy);

      state = store.prompt(state, new ChooseEnergyPrompt(
        player.id,
        GameMessage.CHOOSE_ENERGIES_TO_DISCARD,
        checkProvidedEnergy.energyMap,
        [C],
        { allowCancel: false }
      ), energy => {
        const cards: Card[] = (energy || []).map(e => e.card);
        const discardEnergy = new DiscardCardsEffect(effect, cards);
        discardEnergy.target = player.active;
        store.reduceEffect(state, discardEnergy);
      });

    }

    return state;
  }

}
