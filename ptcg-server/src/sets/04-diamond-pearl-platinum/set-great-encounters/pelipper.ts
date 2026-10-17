import { PokemonCard } from '../../../game/store/card/pokemon-card';
import { CardType, EnergyType, Stage, SuperType } from '../../../game/store/card/card-types';
import { AttachEnergyPrompt, EnergyCard, GameMessage, PlayerType, SlotType, State, StateUtils, StoreLike } from '../../../game';
import { Effect } from '../../../game/store/effects/effect';
import { HealEffect } from '../../../game/store/effects/game-effects';
import { MOVE_CARDS, SHUFFLE_DECK, WAS_ATTACK_USED } from '../../../game/store/prefabs/prefabs';

export class Pelipper extends PokemonCard {
  public stage: Stage = Stage.STAGE_1;
  public evolvesFrom: string = 'Wingull';
  public hp: number = 80;
  public cardType: CardType[] = [W];
  public weakness = [{ type: L, value: +20 }];
  public resistance = [{ type: F, value: -20 }];
  public retreat = [C];

  public attacks = [{
    name: 'Guzzle',
    cost: [],
    damage: 0,
    text: 'Choose up to 2 basic Water Energy cards from your hand and attach them to Pelipper. Remove 2 damage counters for each Energy card attached in this way.'
  },
  {
    name: 'Jet Return',
    cost: [W, C, C],
    damage: 30,
    damageCalculation: 'x',
    text: 'Does 30 times the number of Energy cards attached to Pelipper. Then, put all Energy cards attached to Pelipper on top of your deck. Shuffle your deck afterward.'
  }];

  public set: string = 'GE';
  public cardImage: string = 'assets/cardback.png';
  public setNumber: string = '48';
  public name: string = 'Pelipper';
  public fullName: string = 'Pelipper GE';

  public reduceEffect(store: StoreLike, state: State, effect: Effect): State {
    // Guzzle
    if (WAS_ATTACK_USED(effect, 0, this)) {
      const player = effect.player;
      const hasWater = player.hand.cards.some(
        c => c instanceof EnergyCard &&
          c.energyType === EnergyType.BASIC &&
          c.provides.includes(CardType.WATER)
      );
      if (!hasWater) {
        return state;
      }
      return store.prompt(state, new AttachEnergyPrompt(
        player.id,
        GameMessage.ATTACH_ENERGY_CARDS,
        player.hand,
        PlayerType.BOTTOM_PLAYER,
        [SlotType.ACTIVE],
        { superType: SuperType.ENERGY, energyType: EnergyType.BASIC, name: 'Water Energy' },
        { allowCancel: true, min: 0, max: 2 }
      ), transfers => {
        transfers = transfers || [];
        for (const transfer of transfers) {
          const target = StateUtils.getTarget(state, player, transfer.to);
          MOVE_CARDS(store, state, player.hand, target, {
            cards: [transfer.card],
            sourceCard: this,
            sourceEffect: this.attacks[0],
          });
        }
        if (transfers.length > 0) {
          const healEffect = new HealEffect(player, player.active, transfers.length * 20);
          store.reduceEffect(state, healEffect);
        }
      });
    }

    // Jet Return
    if (WAS_ATTACK_USED(effect, 1, this)) {
      const player = effect.player;
      const energies = player.active.cards.filter(c => c instanceof EnergyCard);
      effect.damage = 30 * energies.length;
      if (energies.length > 0) {
        energies.forEach(card => {
          player.active.moveCardTo(card, player.deck);
        });
        SHUFFLE_DECK(store, state, player);
      }
    }

    return state;
  }
}
