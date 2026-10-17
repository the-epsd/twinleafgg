import { PokemonCard } from '../../../game/store/card/pokemon-card';
import { CardType, EnergyType, Stage, SuperType } from '../../../game/store/card/card-types';
import { AttachEnergyPrompt, CardTarget, EnergyCard, GameMessage, MoveEnergyPrompt, PlayerType, SlotType, State, StateUtils, StoreLike } from '../../../game';
import { Effect } from '../../../game/store/effects/effect';
import { MOVE_CARDS, WAS_ATTACK_USED } from '../../../game/store/prefabs/prefabs';

export class Rotom extends PokemonCard {
  public stage: Stage = Stage.BASIC;
  public hp: number = 60;
  public cardType: CardType[] = [L];
  public weakness = [{ type: D, value: +20 }];
  public resistance = [{ type: C, value: -20 }];
  public retreat = [C];

  public attacks = [{
    name: 'Dual Trans',
    cost: [],
    damage: 0,
    text: 'Search your discard pile for up to 2 basic Energy cards and attach them to 1 of your Pokémon.'
  },
  {
    name: 'Reflect Energy',
    cost: [L, C],
    damage: 30,
    text: 'Move an Energy card attached to Rotom to 1 of your Benched Pokémon.'
  }];

  public set: string = 'MD';
  public cardImage: string = 'assets/cardback.png';
  public setNumber: string = '13';
  public name: string = 'Rotom';
  public fullName: string = 'Rotom MD';

  public reduceEffect(store: StoreLike, state: State, effect: Effect): State {
    // Dual Trans
    if (WAS_ATTACK_USED(effect, 0, this)) {
      const player = effect.player;
      const hasBasicEnergy = player.discard.cards.some(
        c => c instanceof EnergyCard && c.energyType === EnergyType.BASIC,
      );
      if (!hasBasicEnergy) {
        return state;
      }

      return store.prompt(state, new AttachEnergyPrompt(
        player.id,
        GameMessage.ATTACH_ENERGY_CARDS,
        player.discard,
        PlayerType.BOTTOM_PLAYER,
        [SlotType.ACTIVE, SlotType.BENCH],
        { superType: SuperType.ENERGY, energyType: EnergyType.BASIC },
        { min: 0, max: 2, allowCancel: false, sameTarget: true },
      ), transfers => {
        transfers = transfers || [];
        for (const transfer of transfers) {
          const target = StateUtils.getTarget(state, player, transfer.to);
          MOVE_CARDS(store, state, player.discard, target, { cards: [transfer.card], sourceCard: this });
        }
      });
    }

    // Reflect Energy
    if (WAS_ATTACK_USED(effect, 1, this)) {
      const player = effect.player;
      const rotomSlot = StateUtils.findPokemonSlot(state, this);
      if (!rotomSlot) {
        return state;
      }

      const hasEnergyOnRotom = rotomSlot.cards.some(c => c.superType === SuperType.ENERGY);
      const hasBench = player.bench.some(b => b.cards.length > 0);
      if (!hasEnergyOnRotom || !hasBench) {
        return state;
      }

      let rotomTarget: CardTarget | undefined;
      const blockedFrom: CardTarget[] = [];
      const blockedTo: CardTarget[] = [];
      player.forEachPokemon(PlayerType.BOTTOM_PLAYER, (list, _card, target) => {
        if (list === rotomSlot) {
          rotomTarget = target;
        } else {
          blockedFrom.push(target);
        }
        if (target.slot === SlotType.ACTIVE) {
          blockedTo.push(target);
        }
      });

      if (!rotomTarget) {
        return state;
      }

      return store.prompt(state, new MoveEnergyPrompt(
        player.id,
        GameMessage.MOVE_ENERGY_CARDS,
        PlayerType.BOTTOM_PLAYER,
        [SlotType.ACTIVE, SlotType.BENCH],
        { superType: SuperType.ENERGY },
        { allowCancel: false, min: 1, max: 1, blockedFrom, blockedTo },
      ), transfers => {
        transfers = transfers || [];
        for (const transfer of transfers) {
          const source = StateUtils.getTarget(state, player, transfer.from);
          const target = StateUtils.getTarget(state, player, transfer.to);
          MOVE_CARDS(store, state, source, target, { cards: [transfer.card], sourceCard: this });
        }
      });
    }

    return state;
  }
}
