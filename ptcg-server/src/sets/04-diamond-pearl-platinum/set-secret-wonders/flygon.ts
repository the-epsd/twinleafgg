import { PokemonCard } from '../../../game/store/card/pokemon-card';
import { CardType, EnergyType, Stage } from '../../../game/store/card/card-types';
import { PowerType, State, StateUtils, StoreLike } from '../../../game';
import { Effect } from '../../../game/store/effects/effect';
import { PlaceDamageCountersEffect } from '../../../game/store/effects/game-effects';
import { BetweenTurnsEffect, EndTurnEffect } from '../../../game/store/effects/game-phase-effects';
import { AttachEnergyEffect } from '../../../game/store/effects/play-card-effects';
import { CheckPokemonTypeEffect } from '../../../game/store/effects/check-effects';
import { IS_POKEBODY_BLOCKED, WAS_ATTACK_USED } from '../../../game/store/prefabs/prefabs';

export class Flygon extends PokemonCard {
  public stage: Stage = Stage.STAGE_2;
  public evolvesFrom: string = 'Vibrava';
  public hp: number = 120;
  public cardType: CardType[] = [F];
  public weakness = [{ type: W, value: +30 }];
  public resistance = [{ type: L, value: -20 }];
  public retreat = [C];

  public powers = [{
    name: 'Irritating Buzz',
    powerType: PowerType.POKEBODY,
    text: 'As long as Flygon is your Active Pokémon, put 1 damage counter on each of your opponent\'s Active Pokémon between turns, excluding Fighting Pokémon.'
  }];

  public attacks = [{
    name: 'Sand Sonic',
    cost: [F, C, C],
    damage: 60,
    damageCalculation: '+',
    text: 'If you attach a Fighting Energy card from your hand to Flygon during this turn, this attack does 60 damage plus 20 more damage.'
  }];

  public set: string = 'SW';
  public cardImage: string = 'assets/cardback.png';
  public setNumber: string = '5';
  public name: string = 'Flygon';
  public fullName: string = 'Flygon SW';

  public fightingEnergyAttachedThisTurn = false;

  public reduceEffect(store: StoreLike, state: State, effect: Effect): State {
    // Irritating Buzz
    if (effect instanceof BetweenTurnsEffect && effect.player.active.getPokemonCard() === this) {
      const player = effect.player;
      const opponent = StateUtils.getOpponent(state, player);

      if (IS_POKEBODY_BLOCKED(store, state, player, this)) {
        return state;
      }

      const checkType = new CheckPokemonTypeEffect(opponent.active);
      store.reduceEffect(state, checkType);
      if (checkType.cardTypes.includes(CardType.FIGHTING)) {
        return state;
      }

      const placeCounters = new PlaceDamageCountersEffect(
        player,
        opponent.active,
        10,
        this,
        this.powers[0],
      );
      store.reduceEffect(state, placeCounters);
    }

    // Track Fighting Energy attached from hand this turn
    if (effect instanceof AttachEnergyEffect && effect.target.getPokemonCard() === this) {
      if (!effect.player.hand.cards.includes(effect.energyCard)) {
        return state;
      }
      if (
        effect.energyCard.energyType === EnergyType.BASIC &&
        effect.energyCard.provides.includes(CardType.FIGHTING)
      ) {
        this.fightingEnergyAttachedThisTurn = true;
      }
    }

    if (effect instanceof EndTurnEffect) {
      this.fightingEnergyAttachedThisTurn = false;
    }

    // Sand Sonic
    if (WAS_ATTACK_USED(effect, 0, this)) {
      if (this.fightingEnergyAttachedThisTurn) {
        effect.damage += 20;
      }
    }

    return state;
  }
}
