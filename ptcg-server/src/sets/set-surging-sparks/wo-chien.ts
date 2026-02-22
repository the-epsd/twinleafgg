import { PokemonCard } from '../../game/store/card/pokemon-card';
import { Stage, CardType } from '../../game/store/card/card-types';
import { ChoosePokemonPrompt, GameMessage, PlayerType, SlotType, State, StateUtils, StoreLike } from '../../game';
import { Effect } from '../../game/store/effects/effect';

import { PutDamageEffect } from '../../game/store/effects/attack-effects';
import { DISCARD_TOP_X_CARDS_FROM_YOUR_DECK, WAS_ATTACK_USED } from '../../game/store/prefabs/prefabs';

export class Wochien extends PokemonCard {

  public stage: Stage = Stage.BASIC;
  public cardType: CardType = G;
  public hp: number = 130;
  public weakness = [{ type: R }];
  public retreat = [C, C, C];

  public attacks = [
    {
      name: 'Hazardous Greed',
      cost: [G, C],
      damage: 20,
      text:
        'If there are 3 or fewer cards in your deck, this attack also ' +
        'does 120 damage to 2 of your opponent\'s Benched Pokémon. ' +
        '(Don\'t apply Weakness and Resistance for Benched Pokémon.)'
    },
    {
      name: 'Entangling Whip',
      cost: [G, G, C],
      damage: 130,
      text: 'Discard the top 3 cards of your deck.'
    }
  ];

  public set: string = 'SSP';
  public name: string = 'Wo-Chien';
  public fullName: string = 'Wo-chien SSP';
  public setNumber: string = '15';
  public regulationMark = 'H';
  public cardImage: string = 'assets/cardback.png';

  public reduceEffect(store: StoreLike, state: State, effect: Effect): State {
    // Hazardous Greed
    if (WAS_ATTACK_USED(effect, 0, this)) {
      const player = effect.player;
      const opponent = StateUtils.getOpponent(state, player);

      if (player.deck.cards.length <= 3) {
        const benched = opponent.bench.reduce((left, b) => left + (b.cards.length ? 1 : 0), 0);
        if (benched === 0) {
          return state;
        }
        const count = Math.min(2, benched);

        return store.prompt(state, new ChoosePokemonPrompt(
          player.id,
          GameMessage.CHOOSE_POKEMON_TO_DAMAGE,
          PlayerType.TOP_PLAYER,
          [SlotType.BENCH],
          { allowCancel: false, min: count, max: count }
        ), targets => {
          targets.forEach(target => {
            const damageEffect = new PutDamageEffect(effect, 120);
            damageEffect.target = target;
            store.reduceEffect(state, damageEffect);
          });
        });
      }
    }

    // Entangling Whip
    if (WAS_ATTACK_USED(effect, 1, this)) {
      const player = effect.player;

      // Legacy implementation:
      // - Moved top 3 cards directly from deck to discard.
      //
      // Converted to prefab version (DISCARD_TOP_X_CARDS_FROM_YOUR_DECK).
      return DISCARD_TOP_X_CARDS_FROM_YOUR_DECK(store, state, player, 3, this, effect);
    }

    return state;
  }
}
