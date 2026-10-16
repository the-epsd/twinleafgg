import { PokemonCard } from '../../../game/store/card/pokemon-card';
import { CardType, Stage, SuperType } from '../../../game/store/card/card-types';
import { CardTarget, GameMessage, MoveEnergyPrompt, PlayerType, SlotType, State, StateUtils, StoreLike } from '../../../game';
import { Effect } from '../../../game/store/effects/effect';
import { THIS_POKEMON_CANNOT_USE_THIS_ATTACK_NEXT_TURN, MOVE_CARDS, WAS_ATTACK_USED } from '../../../game/store/prefabs/prefabs';
import { DISCARD_UP_TO_X_ENERGY_FROM_YOUR_POKEMON } from '../../../game/store/prefabs/costs';

export class Raichu extends PokemonCard {
  public stage: Stage = Stage.STAGE_1;
  public evolvesFrom: string = 'Pikachu';
  public hp: number = 90;
  public cardType: CardType[] = [L];
  public weakness = [{ type: F, value: +20 }];
  public resistance = [{ type: M, value: -20 }];
  public retreat = [];

  public attacks = [{
    name: 'Slice',
    cost: [],
    damage: 30,
    text: 'Raichu can\'t use Slice during your next turn.'
  },
  {
    name: 'Split Ball',
    cost: [C, C, C],
    damage: 50,
    text: 'Move an Energy card attached to Raichu to 1 of your Benched Pokémon.'
  },
  {
    name: 'Burst Ball',
    cost: [L, L, C],
    damage: 100,
    text: 'Discard 3 Energy attached to any of your Pokémon in any way you like.'
  }];

  public set: string = 'SF';
  public cardImage: string = 'assets/cardback.png';
  public setNumber: string = '8';
  public name: string = 'Raichu';
  public fullName: string = 'Raichu SF';

  public reduceEffect(store: StoreLike, state: State, effect: Effect): State {
    // Slice
    if (WAS_ATTACK_USED(effect, 0, this)) {
      THIS_POKEMON_CANNOT_USE_THIS_ATTACK_NEXT_TURN(effect.player, this.attacks[0]);
    }

    // Split Ball
    if (WAS_ATTACK_USED(effect, 1, this)) {
      const player = effect.player;
      const raichuSlot = StateUtils.findPokemonSlot(state, this);
      if (!raichuSlot) {
        return state;
      }
      const hasEnergyOnRaichu = raichuSlot.cards.some(c => c.superType === SuperType.ENERGY);
      const hasBench = player.bench.some(b => b.cards.length > 0);
      if (!hasEnergyOnRaichu || !hasBench) {
        return state;
      }
      let raichuTarget: CardTarget | undefined;
      const blockedFrom: CardTarget[] = [];
      const blockedTo: CardTarget[] = [];
      player.forEachPokemon(PlayerType.BOTTOM_PLAYER, (list, _card, target) => {
        if (list === raichuSlot) {
          raichuTarget = target;
        } else {
          blockedFrom.push(target);
        }
        if (target.slot === SlotType.ACTIVE) {
          blockedTo.push(target);
        }
      });
      if (!raichuTarget) {
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

    // Burst Ball
    if (WAS_ATTACK_USED(effect, 2, this)) {
      DISCARD_UP_TO_X_ENERGY_FROM_YOUR_POKEMON(store, state, effect, 3, {}, 3);
    }

    return state;
  }
}
