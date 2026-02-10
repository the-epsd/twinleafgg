import { PokemonCard } from '../../game/store/card/pokemon-card';
import { Stage, CardType, SuperType, EnergyType } from '../../game/store/card/card-types';
import { StoreLike, State, StateUtils, GameMessage, EnergyCard, AttachEnergyPrompt, PlayerType, SlotType } from '../../game';
import { Effect } from '../../game/store/effects/effect';
import { AttackEffect } from '../../game/store/effects/game-effects';
import { WAS_ATTACK_USED } from '../../game/store/prefabs/prefabs';

export class Bisharp extends PokemonCard {
  public stage: Stage = Stage.STAGE_1;
  public evolvesFrom = 'Pawniard';
  public cardType: CardType = M;
  public hp: number = 100;
  public weakness = [{ type: R }];
  public resistance = [{ type: P, value: -20 }];
  public retreat = [C, C];

  public attacks = [{
    name: 'Energy Stream',
    cost: [C],
    damage: 20,
    text: 'Attach a [M] Energy card from your discard pile to this Pokemon.'
  },
  {
    name: 'Metal Scissors',
    cost: [C, C, C],
    damage: 40,
    damageCalculation: '+',
    text: 'Does 20 more damage for each [M] Energy attached to this Pokemon.'
  }];

  public set: string = 'NVI';
  public cardImage: string = 'assets/cardback.png';
  public setNumber: string = '82';
  public name: string = 'Bisharp';
  public fullName: string = 'Bisharp NVI';

  public reduceEffect(store: StoreLike, state: State, effect: Effect): State {
    if (WAS_ATTACK_USED(effect, 0, this)) {
      const player = effect.player;

      const hasMetalEnergyInDiscard = player.discard.cards.some(c => {
        return c instanceof EnergyCard
          && c.energyType === EnergyType.BASIC
          && c.provides && c.provides.includes(CardType.METAL);
      });

      if (!hasMetalEnergyInDiscard) {
        return state;
      }

      return store.prompt(state, new AttachEnergyPrompt(
        player.id,
        GameMessage.ATTACH_ENERGY_TO_ACTIVE,
        player.discard,
        PlayerType.BOTTOM_PLAYER,
        [SlotType.ACTIVE],
        { superType: SuperType.ENERGY, energyType: EnergyType.BASIC, name: 'Metal Energy' },
        { allowCancel: false, min: 0, max: 1 }
      ), transfers => {
        transfers = transfers || [];
        if (transfers.length > 0) {
          for (const transfer of transfers) {
            const target = StateUtils.getTarget(state, player, transfer.to);
            player.discard.moveCardTo(transfer.card, target);
          }
        }
      });
    }

    if (WAS_ATTACK_USED(effect, 1, this)) {
      const player = effect.player;
      let metalEnergyCount = 0;

      player.active.cards.forEach(card => {
        if (card instanceof EnergyCard && card.provides && card.provides.includes(CardType.METAL)) {
          metalEnergyCount++;
        }
      });

      (effect as AttackEffect).damage += 20 * metalEnergyCount;
    }

    return state;
  }
}
