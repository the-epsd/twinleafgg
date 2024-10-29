import { PokemonCard } from '../../game/store/card/pokemon-card';
import { Stage, CardType } from '../../game/store/card/card-types';
import { StoreLike, State, CoinFlipPrompt, GameMessage, PlayerType, StateUtils } from '../../game';
import { Effect } from '../../game/store/effects/effect';
import { AbstractAttackEffect } from '../../game/store/effects/attack-effects';
import { AttackEffect } from '../../game/store/effects/game-effects';
import { EndTurnEffect } from '../../game/store/effects/game-phase-effects';
import { CheckAttackCostEffect, CheckProvidedEnergyEffect } from '../../game/store/effects/check-effects';

export class Seadra extends PokemonCard {
  public stage: Stage = Stage.STAGE_1;
  public evolvesFrom = 'Horsea';
  public cardType: CardType = CardType.WATER;
  public hp: number = 60;
  public weakness = [{ type: CardType.LIGHTNING }];
  public retreat = [CardType.COLORLESS];

  public attacks = [{
    name: 'Water Gun',
    cost: [W, C],
    damage: 20,
    text: 'Does 20 damage plus 10 more damage for each {W} Energy attached to Seadra but not used to pay for this attack\'s Energy cost. You can\'t add more than 20 damage in this way.'
  },
  {
    name: 'Agility',
    cost: [W, C, C],
    damage: 20,
    text: 'Flip a coin. If heads, during your opponent\'s next turn, prevent all effects of attacks, including damage, done to Seadra.'
  }];

  public set: string = 'FO';
  public cardImage: string = 'assets/cardback.png';
  public setNumber: string = '42';
  public name: string = 'Seadra';
  public fullName: string = 'Seadra FO';

  public readonly PREVENT_DAMAGE_DURING_OPPONENTS_NEXT_TURN_MARKER = 'PREVENT_DAMAGE_DURING_OPPONENTS_NEXT_TURN_MARKER';
  public readonly CLEAR_PREVENT_DAMAGE_DURING_OPPONENTS_NEXT_TURN_MARKER = 'CLEAR_PREVENT_DAMAGE_DURING_OPPONENTS_NEXT_TURN_MARKER';

  public reduceEffect(store: StoreLike, state: State, effect: Effect): State {

    if (effect instanceof AttackEffect && effect.attack === this.attacks[0]) {

      const player = effect.player;

      // Check attack cost
      const checkCost = new CheckAttackCostEffect(player, this.attacks[0]);
      state = store.reduceEffect(state, checkCost);

      // Check attached energy
      const checkEnergy = new CheckProvidedEnergyEffect(player);
      state = store.reduceEffect(state, checkEnergy);

      // Filter for only Water Energy
      const waterEnergy = checkEnergy.energyMap.filter(e =>
        e.provides.includes(CardType.WATER));

      // Get number of extra Water energy  
      const extraWaterEnergy = waterEnergy.length - checkCost.cost.length;

      // Apply damage boost based on extra Water energy
      if (extraWaterEnergy == 1) effect.damage += 10;
      if (extraWaterEnergy == 2) effect.damage += 20;

    }

    if (effect instanceof AttackEffect && effect.attack === this.attacks[1]) {
      const player = effect.player;
      const opponent = StateUtils.getOpponent(state, player);
      state = store.prompt(state, new CoinFlipPrompt(
        player.id, GameMessage.COIN_FLIP
      ), flipResult => {
        if (flipResult) {
          player.active.attackMarker.addMarker(this.PREVENT_DAMAGE_DURING_OPPONENTS_NEXT_TURN_MARKER, this);
          opponent.attackMarker.addMarker(this.CLEAR_PREVENT_DAMAGE_DURING_OPPONENTS_NEXT_TURN_MARKER, this);
        }
      });

      return state;
    }

    if (effect instanceof AbstractAttackEffect
      && effect.target.attackMarker.hasMarker(this.PREVENT_DAMAGE_DURING_OPPONENTS_NEXT_TURN_MARKER)) {
      effect.preventDefault = true;
      return state;
    }

    if (effect instanceof EndTurnEffect
      && effect.player.attackMarker.hasMarker(this.CLEAR_PREVENT_DAMAGE_DURING_OPPONENTS_NEXT_TURN_MARKER, this)) {

      effect.player.attackMarker.removeMarker(this.CLEAR_PREVENT_DAMAGE_DURING_OPPONENTS_NEXT_TURN_MARKER, this);

      const opponent = StateUtils.getOpponent(state, effect.player);
      opponent.forEachPokemon(PlayerType.TOP_PLAYER, (cardList) => {
        cardList.attackMarker.removeMarker(this.PREVENT_DAMAGE_DURING_OPPONENTS_NEXT_TURN_MARKER, this);
      });
    }

    return state;
  }

}