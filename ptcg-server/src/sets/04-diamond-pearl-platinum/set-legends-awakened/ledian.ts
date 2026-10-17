import { PokemonCard } from '../../../game/store/card/pokemon-card';
import { CardType, Stage } from '../../../game/store/card/card-types';
import { CardTarget, GameMessage, MoveEnergyPrompt, PlayerType, SlotType, State, StateUtils, StoreLike, SuperType } from '../../../game';
import { Effect } from '../../../game/store/effects/effect';
import { AfterAttackEffect, EndTurnEffect } from '../../../game/store/effects/game-phase-effects';
import { CONFIRMATION_PROMPT, MULTIPLE_COIN_FLIPS_PROMPT, SWITCH_ACTIVE_WITH_BENCHED, WAS_ATTACK_USED } from '../../../game/store/prefabs/prefabs';

export class Ledian extends PokemonCard {
  public stage: Stage = Stage.STAGE_1;
  public evolvesFrom: string = 'Ledyba';
  public hp: number = 80;
  public cardType: CardType[] = [G];
  public weakness = [{ type: R, value: +20 }];
  public resistance = [{ type: F, value: -20 }];
  public retreat = [C];

  public attacks = [{
    name: 'Comet Punch',
    cost: [C],
    damage: 20,
    damageCalculation: 'x',
    text: 'Flip 4 coins. This attack does 20 damage times the number of heads.'
  },
  {
    name: 'Baton Pass',
    cost: [G, G],
    damage: 50,
    text: 'You may switch Ledian with 1 of your Benched Pokémon. If you do, move as many Energy cards attached to Ledian as you like to the new Active Pokémon.'
  }];

  public set: string = 'LA';
  public cardImage: string = 'assets/cardback.png';
  public setNumber: string = '60';
  public name: string = 'Ledian';
  public fullName: string = 'Ledian LA';

  public usedSwitchAttack1 = false;
  public reduceEffect(store: StoreLike, state: State, effect: Effect): State {
    // Comet Punch
    if (WAS_ATTACK_USED(effect, 0, this)) {
      const player = effect.player;
      MULTIPLE_COIN_FLIPS_PROMPT(store, state, player, 4, results => {
        effect.damage = 20 * results.filter(r => r).length;
      });
    }

    // Baton Pass
    if (WAS_ATTACK_USED(effect, 1, this)) {
      const player = effect.player;
      const hasBench = player.bench.some(b => b.cards.length > 0);
      if (!hasBench) {
        return state;
      }
      CONFIRMATION_PROMPT(store, state, player, result => {
        if (result) {
          this.usedSwitchAttack1 = true;
        }
      }, GameMessage.WANT_TO_SWITCH_POKEMON);
    }

    if (effect instanceof AfterAttackEffect && this.usedSwitchAttack1) {
      this.usedSwitchAttack1 = false;
      const player = effect.player;
      const oldActive = player.active;
      SWITCH_ACTIVE_WITH_BENCHED(store, state, player);
      const newActive = player.active;
      if (oldActive === newActive) {
        return state;
      }
      const blockedFrom: CardTarget[] = [];
      const blockedTo: CardTarget[] = [];
      player.forEachPokemon(PlayerType.BOTTOM_PLAYER, (list, _card, target) => {
        if (list !== oldActive) {
          blockedFrom.push(target);
        }
        if (target.slot !== SlotType.ACTIVE) {
          blockedTo.push(target);
        }
      });
      store.prompt(state, new MoveEnergyPrompt(
        player.id,
        GameMessage.MOVE_ENERGY_CARDS,
        PlayerType.BOTTOM_PLAYER,
        [SlotType.ACTIVE, SlotType.BENCH],
        { superType: SuperType.ENERGY },
        { allowCancel: true, min: 0, blockedFrom, blockedTo },
      ), transfers => {
        transfers = transfers || [];
        for (const transfer of transfers) {
          const source = StateUtils.getTarget(state, player, transfer.from);
          const target = StateUtils.getTarget(state, player, transfer.to);
          source.moveCardTo(transfer.card, target);
        }
      });
    }

    if (effect instanceof EndTurnEffect) {
      this.usedSwitchAttack1 = false;
    }
    return state;
  }
}
