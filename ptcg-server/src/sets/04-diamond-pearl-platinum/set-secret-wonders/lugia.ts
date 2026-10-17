import { PokemonCard } from '../../../game/store/card/pokemon-card';
import { CardType, Stage, SuperType } from '../../../game/store/card/card-types';
import { ChooseCardsPrompt, EnergyCard, GameMessage, State, StoreLike } from '../../../game';
import { Effect } from '../../../game/store/effects/effect';
import { CheckProvidedEnergyEffect } from '../../../game/store/effects/check-effects';
import { COIN_FLIP_PROMPT, MOVE_CARDS, WAS_ATTACK_USED } from '../../../game/store/prefabs/prefabs';

export class Lugia extends PokemonCard {
  public stage: Stage = Stage.BASIC;
  public hp: number = 90;
  public cardType: CardType[] = [C];
  public weakness = [{ type: P, value: +20 }];
  public resistance = [{ type: F, value: -20 }];
  public retreat = [C, C];

  public attacks = [{
    name: 'Silver Wing',
    cost: [C],
    damage: 20,
    text: 'Flip a coin. If heads, choose an Energy card attached to the Defending Pokémon and return it to your opponent\'s hand.'
  },
  {
    name: 'Psychic Destruction',
    cost: [P, C, C],
    damage: 120,
    text: 'If the Defending Pokémon has any Energy cards attached to it, this attack\'s base damage is 40 instead of 120.'
  }];

  public set: string = 'SW';
  public cardImage: string = 'assets/cardback.png';
  public setNumber: string = '14';
  public name: string = 'Lugia';
  public fullName: string = 'Lugia SW';

  public reduceEffect(store: StoreLike, state: State, effect: Effect): State {
    // Silver Wing
    if (WAS_ATTACK_USED(effect, 0, this)) {
      const player = effect.player;
      const opponent = effect.opponent;
      const hasEnergy = opponent.active.cards.some(c => c instanceof EnergyCard);
      if (!hasEnergy) {
        return state;
      }

      return COIN_FLIP_PROMPT(store, state, player, result => {
        if (!result) {
          return;
        }
        store.prompt(state, new ChooseCardsPrompt(
          player,
          GameMessage.CHOOSE_CARD_TO_HAND,
          opponent.active,
          { superType: SuperType.ENERGY },
          { min: 1, max: 1, allowCancel: false }
        ), selected => {
          const cards = selected || [];
          if (cards.length > 0) {
            MOVE_CARDS(store, state, opponent.active, opponent.hand, { cards, sourceCard: this });
          }
        });
      });
    }

    // Psychic Destruction
    if (WAS_ATTACK_USED(effect, 1, this)) {
      const opponent = effect.opponent;
      const hasEnergy = new CheckProvidedEnergyEffect(opponent, opponent.active);
      store.reduceEffect(state, hasEnergy);
      if (hasEnergy.energyMap.length > 0) {
        effect.damage = 40;
      }
    }

    return state;
  }
}
