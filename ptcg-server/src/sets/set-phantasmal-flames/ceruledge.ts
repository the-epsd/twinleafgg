import { PokemonCard } from '../../game/store/card/pokemon-card';
import { Stage, CardType, EnergyType, SuperType } from '../../game/store/card/card-types';
import { State } from '../../game/store/state/state';

import { StoreLike } from '../../game/store/store-like';
import { Effect } from '../../game/store/effects/effect';
import { ChooseCardsPrompt, GameMessage } from '../../game';
import { MOVE_CARDS, WAS_ATTACK_USED } from '../../game/store/prefabs/prefabs';

export class Ceruledge extends PokemonCard {
  public stage: Stage = Stage.STAGE_1;
  public evolvesFrom = 'Charcadet';
  public cardType: CardType = R;
  public hp: number = 140;
  public weakness = [{ type: W }];
  public retreat = [C, C];

  public attacks = [{
    name: 'Purgatory Slash',
    cost: [R],
    damage: 220,
    text: 'Discard 4 Basic [R] Energy cards from your hand or this attack does nothing.',
  }];

  public regulationMark = 'I';
  public set: string = 'PFL';
  public cardImage: string = 'assets/cardback.png';
  public setNumber: string = '20';
  public name: string = 'Ceruledge';
  public fullName: string = 'Ceruledge M2';

  public reduceEffect(store: StoreLike, state: State, effect: Effect): State {
    if (WAS_ATTACK_USED(effect, 0, this)) {
      const player = effect.player;

      // Check if player has at least 4 Basic Fire Energy cards in hand
      const fireEnergyInHand = player.hand.cards.filter(card =>
        card.superType === SuperType.ENERGY &&
        card.energyType === EnergyType.BASIC &&
        card.name === 'Fire Energy'
      );

      if (fireEnergyInHand.length < 4) {
        // Not enough energy, attack does nothing
        effect.damage = 0;
        return state;
      }

      // Prompt to discard 4 Basic Fire Energy cards
      return store.prompt(state, new ChooseCardsPrompt(
        player,
        GameMessage.CHOOSE_CARD_TO_DISCARD,
        player.hand,
        { superType: SuperType.ENERGY, energyType: EnergyType.BASIC, name: 'Fire Energy' },
        { min: 4, max: 4, allowCancel: false }
      ), cards => {
        cards = cards || [];
        // Filter to ensure only Fire Energy cards are selected
        const fireEnergyCards = cards.filter(card =>
          card.superType === SuperType.ENERGY &&
          card.energyType === EnergyType.BASIC &&
          card.name === 'Fire Energy'
        );

        if (fireEnergyCards.length === 4) {
          MOVE_CARDS(store, state, player.hand, player.discard, { cards: fireEnergyCards, sourceCard: this });
        } else {
          // If not exactly 4 Fire Energy cards selected, attack does nothing
          effect.damage = 0;
        }
      });
    }

    return state;
  }
}
