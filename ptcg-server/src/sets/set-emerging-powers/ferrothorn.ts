import { PokemonCard } from '../../game/store/card/pokemon-card';
import { Stage, CardType } from '../../game/store/card/card-types';
import { StoreLike, State, StateUtils, GameMessage, PlayerType, SlotType } from '../../game';
import { Effect } from '../../game/store/effects/effect';
import { AttackEffect } from '../../game/store/effects/game-effects';
import { WAS_ATTACK_USED, MULTIPLE_COIN_FLIPS_PROMPT } from '../../game/store/prefabs/prefabs';
import { ChoosePokemonPrompt } from '../../game/store/prompts/choose-pokemon-prompt';
import { AfterAttackEffect, EndTurnEffect } from '../../game/store/effects/game-phase-effects';

export class Ferrothorn extends PokemonCard {
  public stage: Stage = Stage.STAGE_1;
  public evolvesFrom: string = 'Ferroseed';
  public cardType: CardType = M;
  public hp: number = 90;
  public weakness = [{ type: R }];
  public resistance = [{ type: P, value: -20 }];
  public retreat = [C, C];

  public attacks = [
    {
      name: 'Steel Feelers',
      cost: [M],
      damage: 30,
      damageCalculation: 'x',
      text: 'Flip 3 coins. This attack does 30 damage times the number of heads.'
    },
    {
      name: 'Gyro Ball',
      cost: [M, C, C],
      damage: 60,
      text: 'Switch this Pokémon with 1 of your Benched Pokémon. Then, your opponent switches the Defending Pokémon with 1 of his or her Benched Pokémon.'
    }
  ];

  public set: string = 'EPO';
  public cardImage: string = 'assets/cardback.png';
  public setNumber: string = '72';
  public name: string = 'Ferrothorn';
  public fullName: string = 'Ferrothorn EPO';

  public usedGyroBall = false;

  public reduceEffect(store: StoreLike, state: State, effect: Effect): State {
    if (WAS_ATTACK_USED(effect, 0, this)) {
      MULTIPLE_COIN_FLIPS_PROMPT(store, state, effect.player, 3, results => {
        let heads = 0;
        results.forEach(r => { if (r) heads++; });
        (effect as AttackEffect).damage = 30 * heads;
      });
    }

    // Gyro Ball - set flag when attack is used
    if (WAS_ATTACK_USED(effect, 1, this)) {
      this.usedGyroBall = true;
    }

    // Gyro Ball - switch both Pokemon after damage is dealt
    if (effect instanceof AfterAttackEffect && this.usedGyroBall) {
      const player = effect.player;
      const opponent = StateUtils.getOpponent(state, player);

      const playerHasBench = player.bench.some(b => b.cards.length > 0);
      const opponentHasBench = opponent.bench.some(b => b.cards.length > 0);

      if (playerHasBench) {
        return store.prompt(state, new ChoosePokemonPrompt(
          player.id,
          GameMessage.CHOOSE_POKEMON_TO_SWITCH,
          PlayerType.BOTTOM_PLAYER,
          [SlotType.BENCH],
          { allowCancel: false }
        ), playerResult => {
          const playerTarget = playerResult[0];
          player.switchPokemon(playerTarget);

          if (opponentHasBench) {
            return store.prompt(state, new ChoosePokemonPrompt(
              opponent.id,
              GameMessage.CHOOSE_POKEMON_TO_SWITCH,
              PlayerType.TOP_PLAYER,
              [SlotType.BENCH],
              { allowCancel: false }
            ), opponentResult => {
              const opponentTarget = opponentResult[0];
              opponent.switchPokemon(opponentTarget);
            });
          }
        });
      } else if (opponentHasBench) {
        return store.prompt(state, new ChoosePokemonPrompt(
          opponent.id,
          GameMessage.CHOOSE_POKEMON_TO_SWITCH,
          PlayerType.TOP_PLAYER,
          [SlotType.BENCH],
          { allowCancel: false }
        ), opponentResult => {
          const opponentTarget = opponentResult[0];
          opponent.switchPokemon(opponentTarget);
        });
      }
    }

    // Clean up Gyro Ball flag at end of turn
    if (effect instanceof EndTurnEffect && this.usedGyroBall) {
      this.usedGyroBall = false;
    }

    return state;
  }
}
