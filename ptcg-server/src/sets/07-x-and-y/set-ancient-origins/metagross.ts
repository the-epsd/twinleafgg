import { Card, CardType, ConfirmPrompt, GameError, GameMessage, PowerType, Stage, StoreLike, State, StateUtils } from '../../../game';
import { EnergyCard } from '../../../game/store/card/energy-card';
import { PokemonCard } from '../../../game/store/card/pokemon-card';
import { DiscardCardsEffect } from '../../../game/store/effects/attack-effects';
import { CheckProvidedEnergyEffect } from '../../../game/store/effects/check-effects';
import { Effect } from '../../../game/store/effects/effect';
import { SWITCH_OUT_OPPONENT_ACTIVE_FROM_ABILITY } from '../../../game/store/prefabs/effect-of-ability-prefabs';
import {
  ABILITY_USED,
  IS_ABILITY_BLOCKED,
  REMOVE_MARKER_AT_END_OF_TURN,
  SWITCH_ACTIVE_WITH_BENCHED,
  USE_ABILITY_ONCE_PER_TURN,
  WAS_ATTACK_USED,
  WAS_POWER_USED,
} from '../../../game/store/prefabs/prefabs';

export class Metagross extends PokemonCard {
  public stage: Stage = Stage.STAGE_2;
  public evolvesFrom: string = 'Metang';
  public hp: number = 150;
  public cardType: CardType[] = [M];
  public weakness = [{ type: R }];
  public resistance = [{ type: P, value: -20 }];
  public retreat = [C, C, C, C];

  public powers = [{
    name: 'Magnetic Warp',
    useWhenInPlay: true,
    powerType: PowerType.ABILITY,
    text: 'Once during your turn (before your attack), you may switch your Active Pokémon with 1 of your Benched Pokémon. If you do, your opponent switches his or her Active Pokémon with 1 of his or her Benched Pokémon.'
  }];

  public attacks = [{
    name: 'Iron Cannon',
    cost: [M, M, C, C],
    damage: 80,
    damageCalculation: '+',
    text: 'You may discard all [M] Energy attached to this Pokémon. If you do, this attack does 80 more damage.'
  }];

  public set: string = 'AOR';
  public cardImage: string = 'assets/cardback.png';
  public setNumber: string = '49';
  public name: string = 'Metagross';
  public fullName: string = 'Metagross AOR';

  public readonly MAGNETIC_WARP_MARKER = 'METAGROSS_AOR_MAGNETIC_WARP_MARKER';

  public reduceEffect(store: StoreLike, state: State, effect: Effect): State {
    // Magnetic Warp
    if (WAS_POWER_USED(effect, 0, this)) {
      const player = effect.player;
      const opponent = StateUtils.getOpponent(state, player);

      if (IS_ABILITY_BLOCKED(store, state, player, this)) {
        throw new GameError(GameMessage.BLOCKED_BY_EFFECT);
      }

      if (!player.bench.some(b => b.cards.length > 0)) {
        throw new GameError(GameMessage.CANNOT_USE_POWER);
      }

      USE_ABILITY_ONCE_PER_TURN(player, this.MAGNETIC_WARP_MARKER, this);
      ABILITY_USED(player, this);

      SWITCH_ACTIVE_WITH_BENCHED(store, state, player);

      if (opponent.bench.some(b => b.cards.length > 0)) {
        return SWITCH_OUT_OPPONENT_ACTIVE_FROM_ABILITY(
          store,
          state,
          player,
          this.powers[0],
          this,
          { allowCancel: false },
        );
      }
    }

    REMOVE_MARKER_AT_END_OF_TURN(effect, this.MAGNETIC_WARP_MARKER, this);

    // Iron Cannon
    if (WAS_ATTACK_USED(effect, 0, this)) {
      const player = effect.player;

      const checkEnergy = new CheckProvidedEnergyEffect(player);
      store.reduceEffect(state, checkEnergy);

      const metalCards: Card[] = [];
      for (const em of checkEnergy.energyMap) {
        if (em.card instanceof EnergyCard && em.provides.some(t => t === CardType.METAL || t === CardType.ANY)) {
          metalCards.push(em.card);
        }
      }

      if (metalCards.length > 0) {
        state = store.prompt(state, new ConfirmPrompt(
          player.id,
          GameMessage.WANT_TO_USE_ABILITY,
        ), wantToDiscard => {
          if (wantToDiscard) {
            const discardEnergy = new DiscardCardsEffect(effect, metalCards);
            discardEnergy.target = player.active;
            store.reduceEffect(state, discardEnergy);
            effect.damage += 80;
          }
        });
      }
    }

    return state;
  }
}
