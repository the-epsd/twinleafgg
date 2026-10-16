import { PokemonCard } from '../../../game/store/card/pokemon-card';
import { CardType, Stage, SuperType } from '../../../game/store/card/card-types';
import { AttachEnergyPrompt, CardTarget, GameMessage, PlayerType, State, StateUtils, StoreLike } from '../../../game';
import { Effect } from '../../../game/store/effects/effect';
import { DISCARD_X_ENERGY_FROM_THIS_POKEMON } from '../../../game/store/prefabs/costs';
import { HEAL_X_DAMAGE_FROM_THIS_POKEMON, MOVE_CARDS, WAS_ATTACK_USED } from '../../../game/store/prefabs/prefabs';

export class Mewtwo extends PokemonCard {
  public stage: Stage = Stage.BASIC;
  public hp: number = 90;
  public cardType: CardType[] = [P];
  public weakness = [{ type: P, value: +20 }];
  public retreat = [C, C];

  public attacks = [{
    name: 'Energy Absorption',
    cost: [],
    damage: 0,
    text: 'Search your discard pile for up to 2 Energy cards and attach them to Mewtwo.'
  },
  {
    name: 'Recover',
    cost: [P],
    damage: 0,
    text: 'Discard a Psychic Energy attached to Mewtwo and remove 6 damage counters from Mewtwo.'
  },
  {
    name: 'Psyburn',
    cost: [P, P, C],
    damage: 60,
    text: ''
  }];

  public set: string = 'MD';
  public cardImage: string = 'assets/cardback.png';
  public setNumber: string = '9';
  public name: string = 'Mewtwo';
  public fullName: string = 'Mewtwo MD';

  public reduceEffect(store: StoreLike, state: State, effect: Effect): State {
    // Energy Absorption
    if (WAS_ATTACK_USED(effect, 0, this)) {
      const player = effect.player;
      const hasEnergyInDiscard = player.discard.cards.some(c => c.superType === SuperType.ENERGY);
      if (!hasEnergyInDiscard) {
        return state;
      }

      const mewtwoSlot = StateUtils.findPokemonSlot(state, this);
      if (!mewtwoSlot) {
        return state;
      }

      let mewtwoTarget: CardTarget | undefined;
      const blockedTo: CardTarget[] = [];
      player.forEachPokemon(PlayerType.BOTTOM_PLAYER, (list, card, target) => {
        if (list === mewtwoSlot && card === this) {
          mewtwoTarget = target;
        } else {
          blockedTo.push(target);
        }
      });

      if (!mewtwoTarget) {
        return state;
      }

      return store.prompt(state, new AttachEnergyPrompt(
        player.id,
        GameMessage.ATTACH_ENERGY_CARDS,
        player.discard,
        PlayerType.BOTTOM_PLAYER,
        [mewtwoTarget.slot],
        { superType: SuperType.ENERGY },
        { min: 0, max: 2, allowCancel: false, sameTarget: true, blockedTo },
      ), transfers => {
        transfers = transfers || [];
        for (const transfer of transfers) {
          const target = StateUtils.getTarget(state, player, transfer.to);
          MOVE_CARDS(store, state, player.discard, target, { cards: [transfer.card], sourceCard: this });
        }
      });
    }

    // Recover
    if (WAS_ATTACK_USED(effect, 1, this)) {
      DISCARD_X_ENERGY_FROM_THIS_POKEMON(store, state, effect, 1, CardType.PSYCHIC);
      HEAL_X_DAMAGE_FROM_THIS_POKEMON(effect, store, state, 60);
    }

    return state;
  }
}
