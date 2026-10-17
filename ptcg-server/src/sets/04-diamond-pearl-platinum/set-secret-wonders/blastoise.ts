import { PokemonCard } from '../../../game/store/card/pokemon-card';
import { CardType, EnergyType, Stage, SuperType } from '../../../game/store/card/card-types';
import { AttachEnergyPrompt, EnergyCard, GameError, GameMessage, PlayerType, PowerType, SlotType, State, StateUtils, StoreLike } from '../../../game';
import { Effect } from '../../../game/store/effects/effect';
import { CheckAttackCostEffect, CheckProvidedEnergyEffect } from '../../../game/store/effects/check-effects';
import { EndTurnEffect } from '../../../game/store/effects/game-phase-effects';
import { AttachEnergyEffect } from '../../../game/store/effects/play-card-effects';
import { ABILITY_USED, BLOCK_IF_HAS_SPECIAL_CONDITION, IS_POKEPOWER_BLOCKED, REMOVE_MARKER_AT_END_OF_TURN, USE_ABILITY_ONCE_PER_TURN, WAS_ATTACK_USED, WAS_POWER_USED } from '../../../game/store/prefabs/prefabs';

export class Blastoise extends PokemonCard {
  public stage: Stage = Stage.STAGE_2;
  public evolvesFrom: string = 'Wartortle';
  public hp: number = 120;
  public cardType: CardType[] = [W];
  public weakness = [{ type: L, value: +30 }];
  public retreat = [C, C];

  public powers = [{
    name: 'Waterlog',
    powerType: PowerType.POKEPOWER,
    text: 'Once during your turn (before your attack), you may attach as many basic Water Energy cards from your hand to any of your Pokémon in any way you like. If you do, your turn ends. This power can\'t be used if Blastoise is affected by a Special Condition.',
    useWhenInPlay: true
  }];

  public attacks = [{
    name: 'Hydro Pump',
    cost: [W, W, C],
    damage: 50,
    damageCalculation: '+',
    text: 'Does 50 damage plus 20 more damage for each Water Energy attached to Blastoise but not used to pay for this attack\'s Energy cost. You can\'t add more than 40 damage in this way.'
  }];

  public set: string = 'SW';
  public cardImage: string = 'assets/cardback.png';
  public setNumber: string = '2';
  public name: string = 'Blastoise';
  public fullName: string = 'Blastoise SW';

  public readonly ABILITY_USED_MARKER = 'ABILITY_USED_MARKER';

  public reduceEffect(store: StoreLike, state: State, effect: Effect): State {
    // Waterlog
    if (WAS_POWER_USED(effect, 0, this)) {
      const player = effect.player;

      if (IS_POKEPOWER_BLOCKED(store, state, player, this)) {
        throw new GameError(GameMessage.BLOCKED_BY_EFFECT);
      }
      BLOCK_IF_HAS_SPECIAL_CONDITION(player, this);

      const hasEnergyInHand = player.hand.cards.some(c =>
        c instanceof EnergyCard
        && c.energyType === EnergyType.BASIC
        && c.provides.includes(CardType.WATER)
      );
      if (!hasEnergyInHand) {
        throw new GameError(GameMessage.CANNOT_USE_POWER);
      }

      USE_ABILITY_ONCE_PER_TURN(player, this.ABILITY_USED_MARKER, this);
      ABILITY_USED(player, this);

      return store.prompt(state, new AttachEnergyPrompt(
        player.id,
        GameMessage.ATTACH_ENERGY_CARDS,
        player.hand,
        PlayerType.BOTTOM_PLAYER,
        [SlotType.BENCH, SlotType.ACTIVE],
        { superType: SuperType.ENERGY, energyType: EnergyType.BASIC, name: 'Water Energy' },
        { allowCancel: true, min: 0 }
      ), transfers => {
        transfers = transfers || [];
        for (const transfer of transfers) {
          const target = StateUtils.getTarget(state, player, transfer.to);
          const energyCard = transfer.card as EnergyCard;
          const attachEnergyEffect = new AttachEnergyEffect(player, energyCard, target);
          store.reduceEffect(state, attachEnergyEffect);
        }
        if (transfers.length > 0) {
          const endTurnEffect = new EndTurnEffect(player);
          store.reduceEffect(state, endTurnEffect);
        }
      });
    }

    // Hydro Pump
    if (WAS_ATTACK_USED(effect, 0, this)) {
      const player = effect.player;
      const checkCost = new CheckAttackCostEffect(player, this.attacks[0]);
      state = store.reduceEffect(state, checkCost);
      const checkEnergy = new CheckProvidedEnergyEffect(player, player.active);
      state = store.reduceEffect(state, checkEnergy);
      const waterEnergy = checkEnergy.energyMap.filter(e =>
        e.provides.includes(CardType.WATER) || e.provides.includes(CardType.ANY)
      );
      const extraWaterEnergy = Math.min(waterEnergy.length - checkCost.cost.length, 2);
      if (extraWaterEnergy > 0) {
        effect.damage += extraWaterEnergy * 20;
      }
    }

    REMOVE_MARKER_AT_END_OF_TURN(effect, this.ABILITY_USED_MARKER, this);
    return state;
  }
}
