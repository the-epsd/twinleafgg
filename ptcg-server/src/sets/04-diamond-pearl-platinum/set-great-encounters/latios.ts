import { PokemonCard } from '../../../game/store/card/pokemon-card';
import { CardType, EnergyType, Stage, SuperType } from '../../../game/store/card/card-types';
import { AttachEnergyPrompt, GameMessage, PlayerType, SlotType, State, StateUtils, StoreLike } from '../../../game';
import { Effect } from '../../../game/store/effects/effect';
import { COIN_FLIP_PROMPT, MOVE_CARDS, SHUFFLE_DECK, WAS_ATTACK_USED } from '../../../game/store/prefabs/prefabs';
import { DISCARD_X_ENERGY_FROM_THIS_POKEMON } from '../../../game/store/prefabs/costs';

export class Latios extends PokemonCard {
  public stage: Stage = Stage.BASIC;
  public hp: number = 90;
  public cardType: CardType[] = [C];
  public weakness = [{ type: C, value: +20 }];
  public resistance = [{ type: F, value: -20 }];
  public retreat = [C, C];

  public attacks = [{
    name: 'Energy Draw',
    cost: [C],
    damage: 10,
    text: 'Flip a coin. If heads, search your deck for a basic Energy card and attach it to Latios. Shuffle your deck afterward.'
  },
  {
    name: 'Luster Purge',
    cost: [G, L, C, C],
    damage: 120,
    text: 'Discard 3 Energy attached to Latios.'
  }];

  public set: string = 'GE';
  public cardImage: string = 'assets/cardback.png';
  public setNumber: string = '23';
  public name: string = 'Latios';
  public fullName: string = 'Latios GE';

  public reduceEffect(store: StoreLike, state: State, effect: Effect): State {
    // Energy Draw
    if (WAS_ATTACK_USED(effect, 0, this)) {
      const player = effect.player;
      COIN_FLIP_PROMPT(store, state, player, result => {
        if (!result) {
          return;
        }
        store.prompt(state, new AttachEnergyPrompt(
          player.id,
          GameMessage.ATTACH_ENERGY_CARDS,
          player.deck,
          PlayerType.BOTTOM_PLAYER,
          [SlotType.ACTIVE],
          { superType: SuperType.ENERGY, energyType: EnergyType.BASIC },
          { allowCancel: true, min: 0, max: 1 }
        ), transfers => {
          transfers = transfers || [];
          for (const transfer of transfers) {
            const target = StateUtils.getTarget(state, player, transfer.to);
            MOVE_CARDS(store, state, player.deck, target, {
              cards: [transfer.card],
              sourceCard: this,
              sourceEffect: this.attacks[0],
            });
          }
          SHUFFLE_DECK(store, state, player);
        });
      });
    }

    // Luster Purge
    if (WAS_ATTACK_USED(effect, 1, this)) {
      DISCARD_X_ENERGY_FROM_THIS_POKEMON(store, state, effect, 3);
    }

    return state;
  }
}
