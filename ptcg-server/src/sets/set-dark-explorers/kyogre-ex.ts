import { PokemonCard } from '../../game/store/card/pokemon-card';
import { Stage, CardType, CardTag } from '../../game/store/card/card-types';
import { StoreLike, State, ConfirmPrompt, GameMessage, ChoosePokemonPrompt, PlayerType, SlotType } from '../../game';
import { Effect } from '../../game/store/effects/effect';
import { WAS_ATTACK_USED, SWITCH_ACTIVE_WITH_BENCHED, DAMAGE_OPPONENT_POKEMON } from '../../game/store/prefabs/prefabs';
import { AfterAttackEffect, EndTurnEffect } from '../../game/store/effects/game-phase-effects';

export class KyogreEx extends PokemonCard {

  public tags = [CardTag.POKEMON_EX];

  public stage: Stage = Stage.BASIC;

  public cardType: CardType = CardType.WATER;

  public hp: number = 170;

  public weakness = [{ type: CardType.LIGHTNING }];

  public retreat = [CardType.COLORLESS, CardType.COLORLESS, CardType.COLORLESS, CardType.COLORLESS];

  public attacks = [
    {
      name: 'Smash Turn',
      cost: [CardType.WATER, CardType.COLORLESS],
      damage: 30,
      text: 'You may switch this Pokemon with 1 of your Benched Pokemon.'
    },
    {
      name: 'Dual Splash',
      cost: [CardType.WATER, CardType.WATER, CardType.COLORLESS],
      damage: 0,
      text: 'This attack does 50 damage to 2 of your opponent\'s Pokemon. (Don\'t apply Weakness and Resistance for Benched Pokemon.)'
    }
  ];

  public set: string = 'DEX';

  public setNumber: string = '26';

  public cardImage: string = 'assets/cardback.png';

  public name: string = 'Kyogre-EX';

  public fullName: string = 'Kyogre EX DEX';

  private usedSmashTurn: boolean = false;

  public reduceEffect(store: StoreLike, state: State, effect: Effect): State {

    // Smash Turn - set flag to switch after attack
    if (WAS_ATTACK_USED(effect, 0, this)) {
      this.usedSmashTurn = true;
    }

    // Dual Splash - does 50 damage to 2 of opponent's Pokemon
    if (WAS_ATTACK_USED(effect, 1, this)) {
      const player = effect.player;

      return store.prompt(state, new ChoosePokemonPrompt(
        player.id,
        GameMessage.CHOOSE_POKEMON_TO_DAMAGE,
        PlayerType.TOP_PLAYER,
        [SlotType.ACTIVE, SlotType.BENCH],
        { min: 2, max: 2, allowCancel: false }
      ), selected => {
        const targets = selected || [];
        DAMAGE_OPPONENT_POKEMON(store, state, effect, 50, targets);
      });
    }

    // After Smash Turn, optionally switch self
    if (effect instanceof AfterAttackEffect && this.usedSmashTurn) {
      this.usedSmashTurn = false;
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

    // Cleanup
    if (effect instanceof EndTurnEffect) {
      this.usedSmashTurn = false;
    }

    return state;
  }

}
