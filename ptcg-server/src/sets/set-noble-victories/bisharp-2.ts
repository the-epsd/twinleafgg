import { PokemonCard } from '../../game/store/card/pokemon-card';
import { Stage, CardType } from '../../game/store/card/card-types';
import { StoreLike, State, StateUtils, ConfirmPrompt, GameMessage } from '../../game';
import { Effect } from '../../game/store/effects/effect';
import { WAS_ATTACK_USED, SWITCH_ACTIVE_WITH_BENCHED } from '../../game/store/prefabs/prefabs';
import { AfterAttackEffect } from '../../game/store/effects/game-phase-effects';
import { EndTurnEffect } from '../../game/store/effects/game-phase-effects';

export class Bisharp2 extends PokemonCard {
  public stage: Stage = Stage.STAGE_1;
  public evolvesFrom = 'Pawniard';
  public cardType: CardType = D;
  public hp: number = 90;
  public weakness = [{ type: F }];
  public resistance = [{ type: P, value: -20 }];
  public retreat = [C];

  public attacks = [
    {
      name: 'Night Slash',
      cost: [D, C],
      damage: 30,
      text: 'You may switch this Pokemon with 1 of your Benched Pokemon.'
    },
    {
      name: 'Metal Claw',
      cost: [D, C, C],
      damage: 50,
      damageCalculation: '+',
      text: 'If this Pokemon has any damage counters on it, this attack does 50 more damage. Then, switch the Defending Pokemon with 1 of your opponent\'s Benched Pokemon.'
    }
  ];

  public set: string = 'NVI';
  public setNumber: string = '76';
  public cardImage: string = 'assets/cardback.png';
  public name: string = 'Bisharp';
  public fullName: string = 'Bisharp NVI 76';

  private usedNightSlash: boolean = false;
  private usedMetalClaw: boolean = false;

  public reduceEffect(store: StoreLike, state: State, effect: Effect): State {
    // Night Slash - may switch self
    if (WAS_ATTACK_USED(effect, 0, this)) {
      this.usedNightSlash = true;
    }

    // Metal Claw - +50 if damaged, switch opponent's active
    if (WAS_ATTACK_USED(effect, 1, this)) {
      const player = effect.player;

      if (player.active.damage > 0) {
        effect.damage += 50;
      }

      this.usedMetalClaw = true;
    }

    // After Night Slash, optionally switch self
    if (effect instanceof AfterAttackEffect && this.usedNightSlash) {
      this.usedNightSlash = false;
      const player = effect.player;
      const hasBenched = player.bench.some(b => b.cards.length > 0);

      if (hasBenched) {
        return store.prompt(state, new ConfirmPrompt(
          player.id,
          GameMessage.WANT_TO_SWITCH_POKEMON
        ), wantToSwitch => {
          if (wantToSwitch) {
            SWITCH_ACTIVE_WITH_BENCHED(store, state, player);
          }
        });
      }
    }

    // After Metal Claw, switch opponent's active
    if (effect instanceof AfterAttackEffect && this.usedMetalClaw) {
      this.usedMetalClaw = false;
      const player = effect.player;
      const opponent = StateUtils.getOpponent(state, player);
      const hasBenched = opponent.bench.some(b => b.cards.length > 0);

      if (hasBenched) {
        SWITCH_ACTIVE_WITH_BENCHED(store, state, opponent);
      }
    }

    // Cleanup
    if (effect instanceof EndTurnEffect) {
      this.usedNightSlash = false;
      this.usedMetalClaw = false;
    }

    return state;
  }
}
