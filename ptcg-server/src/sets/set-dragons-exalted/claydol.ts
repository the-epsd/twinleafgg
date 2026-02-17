import { PokemonCard } from '../../game/store/card/pokemon-card';
import { Stage, CardType } from '../../game/store/card/card-types';
import { GameMessage, PlayerType, SlotType, StateUtils, StoreLike, State } from '../../game';
import { Effect } from '../../game/store/effects/effect';
import { AfterAttackEffect, EndTurnEffect } from '../../game/store/effects/game-phase-effects';
import { WAS_ATTACK_USED } from '../../game/store/prefabs/prefabs';
import { FLIP_A_COIN_IF_HEADS_DEAL_MORE_DAMAGE } from '../../game/store/prefabs/attack-effects';
import { ChoosePokemonPrompt } from '../../game/store/prompts/choose-pokemon-prompt';

export class Claydol extends PokemonCard {
  public stage: Stage = Stage.STAGE_1;
  public evolvesFrom: string = 'Baltoy';
  public cardType: CardType = F;
  public hp: number = 90;
  public weakness = [{ type: G }];
  public retreat = [C, C, C];

  public attacks = [
    {
      name: 'Rapid Spin',
      cost: [C, C],
      damage: 30,
      text: 'Switch this Pokémon with 1 of your Benched Pokémon. Then, your opponent switches the Defending Pokémon with 1 of his or her Benched Pokémon.'
    },
    {
      name: 'Rock Smash',
      cost: [F, C, C],
      damage: 60,
      text: 'Flip a coin. If heads, this attack does 30 more damage.'
    }
  ];

  public set: string = 'DRX';
  public setNumber: string = '64';
  public cardImage: string = 'assets/cardback.png';
  public name: string = 'Claydol';
  public fullName: string = 'Claydol DRX';

  public usedRapidSpin = false;

  public reduceEffect(store: StoreLike, state: State, effect: Effect): State {
    // Rapid Spin - switch both after damage
    if (WAS_ATTACK_USED(effect, 0, this)) {
      this.usedRapidSpin = true;
    }

    if (effect instanceof AfterAttackEffect && this.usedRapidSpin) {
      this.usedRapidSpin = false;

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

    if (effect instanceof EndTurnEffect && this.usedRapidSpin) {
      this.usedRapidSpin = false;
    }

    // Rock Smash
    if (WAS_ATTACK_USED(effect, 1, this)) {
      FLIP_A_COIN_IF_HEADS_DEAL_MORE_DAMAGE(store, state, effect, 30);
    }

    return state;
  }
}
