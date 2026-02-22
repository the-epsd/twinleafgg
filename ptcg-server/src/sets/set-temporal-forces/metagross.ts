import { PokemonCard } from '../../game/store/card/pokemon-card';
import { Stage, CardType } from '../../game/store/card/card-types';
import { Card, ChooseEnergyPrompt, GameMessage, State, StoreLike } from '../../game';
import { Effect } from '../../game/store/effects/effect';

import { DiscardCardsEffect } from '../../game/store/effects/attack-effects';
import { CheckProvidedEnergyEffect } from '../../game/store/effects/check-effects';
import { NEXT_TURN_ATTACK_BONUS, WAS_ATTACK_USED } from '../../game/store/prefabs/prefabs';

export class Metagross extends PokemonCard {

  public stage: Stage = Stage.STAGE_2;

  public evolvesFrom = 'Metang';

  public regulationMark = 'H';

  public cardType: CardType = CardType.METAL;

  public hp: number = 180;

  public weakness = [{ type: CardType.FIRE }];

  public resistance = [{ type: CardType.GRASS, value: -30 }];

  public retreat = [CardType.COLORLESS, CardType.COLORLESS, CardType.COLORLESS];

  public attacks = [
    {
      name: 'Meteor Mash',
      cost: [CardType.METAL],
      damage: 60,
      text: 'During your next turn, this Pokémon\'s Meteor Mash attack does 60 more damage (before applying Weakness and Resistance).'
    },
    {
      name: 'Luster Blast',
      cost: [CardType.METAL, CardType.COLORLESS, CardType.COLORLESS, CardType.COLORLESS],
      damage: 200,
      text: 'Discard 2 Energy from this Pokémon.'
    }
  ];

  public set: string = 'TEF';

  public cardImage: string = 'assets/cardback.png';

  public setNumber: string = '115';

  public name: string = 'Metagross';

  public fullName: string = 'Metagross TEF';

  public readonly NEXT_TURN_MORE_DAMAGE_MARKER = 'NEXT_TURN_MORE_DAMAGE_MARKER';
  public readonly NEXT_TURN_MORE_DAMAGE_MARKER_2 = 'NEXT_TURN_MORE_DAMAGE_MARKER_2';

  public reduceEffect(store: StoreLike, state: State, effect: Effect): State {

    if (WAS_ATTACK_USED(effect, 1, this)) {
      const player = effect.player;

      const checkProvidedEnergy = new CheckProvidedEnergyEffect(player);
      state = store.reduceEffect(state, checkProvidedEnergy);

      state = store.prompt(state, new ChooseEnergyPrompt(
        player.id,
        GameMessage.CHOOSE_ENERGIES_TO_DISCARD,
        checkProvidedEnergy.energyMap,
        [CardType.COLORLESS, CardType.COLORLESS],
        { allowCancel: false }
      ), energy => {
        const cards: Card[] = (energy || []).map(e => e.card);
        const discardEnergy = new DiscardCardsEffect(effect, cards);
        discardEnergy.target = player.active;
        store.reduceEffect(state, discardEnergy);
      });
    }

    // Refs: set-boundaries-crossed/meloetta.ts (Echoed Voice), prefabs/prefabs.ts (NEXT_TURN_ATTACK_BONUS)
    NEXT_TURN_ATTACK_BONUS(effect, {
      attack: this.attacks[0],
      source: this,
      bonusDamage: 60,
      bonusMarker: this.NEXT_TURN_MORE_DAMAGE_MARKER,
      clearMarker: this.NEXT_TURN_MORE_DAMAGE_MARKER_2
    });

    return state;
  }
}
