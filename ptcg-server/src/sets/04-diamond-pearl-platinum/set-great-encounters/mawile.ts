import { PokemonCard } from '../../../game/store/card/pokemon-card';
import { CardType, Stage, TrainerType } from '../../../game/store/card/card-types';
import { ChoosePrizePrompt, GameMessage, SelectOptionPrompt, State, StoreLike, TrainerCard } from '../../../game';
import { Effect } from '../../../game/store/effects/effect';
import { TrainerEffect } from '../../../game/store/effects/play-card-effects';
import { WAS_ATTACK_USED } from '../../../game/store/prefabs/prefabs';
import { DEFENDING_POKEMON_TAKES_MORE_DAMAGE_DURING_YOUR_NEXT_TURN } from '../../../game/store/prefabs/effect-of-attack-prefabs';
import { CAN_PLAY_SUPPORTER_CARD } from '../../../game/store/prefabs/trainer-prefabs';

export class Mawile extends PokemonCard {
  public stage: Stage = Stage.BASIC;
  public hp: number = 70;
  public cardType: CardType[] = [M];
  public weakness = [{ type: R, value: +10 }];
  public resistance = [{ type: P, value: -20 }];
  public retreat = [C];

  public attacks = [{
    name: 'Pick Out',
    cost: [],
    damage: 0,
    text: 'Choose 1 face-down Prize card (yours or your opponent\'s) and put it face up. If that card is a Supporter card, use the effect of that card as the effect of this attack. (That card remains face up for the rest of the game.)'
  },
  {
    name: 'Jaw Bite',
    cost: [M, C],
    damage: 20,
    text: 'During your next turn, if an attack does damage to the Defending Pokémon (after applying Weakness and Resistance), that attack does 20 more damage.'
  }];

  public set: string = 'GE';
  public cardImage: string = 'assets/cardback.png';
  public setNumber: string = '24';
  public name: string = 'Mawile';
  public fullName: string = 'Mawile GE';

  public reduceEffect(store: StoreLike, state: State, effect: Effect): State {
    // Pick Out
    if (WAS_ATTACK_USED(effect, 0, this)) {
      const player = effect.player;
      const opponent = effect.opponent;

      const hasOwn = player.prizes.some(p => p.cards.length > 0 && p.isSecret && !p.faceUpPrize);
      const hasOpp = opponent.prizes.some(p => p.cards.length > 0 && p.isSecret && !p.faceUpPrize);
      if (!hasOwn && !hasOpp) {
        return state;
      }

      const pickPrize = (useOpponentPrizes: boolean) => {
        const targetPlayer = useOpponentPrizes ? opponent : player;
        const prizesWithCards = targetPlayer.prizes.filter(p => p.cards.length > 0);
        const blocked: number[] = [];
        prizesWithCards.forEach((p, index) => {
          if (!p.isSecret || p.faceUpPrize) {
            blocked.push(index);
          }
        });

        return store.prompt(state, new ChoosePrizePrompt(
          player.id,
          GameMessage.CHOOSE_PRIZE_CARD,
          { count: 1, allowCancel: false, isSecret: true, blocked, useOpponentPrizes }
        ), chosen => {
          const prize = chosen && chosen[0];
          if (!prize || prize.cards.length === 0) {
            return;
          }
          prize.isSecret = false;
          prize.isPublic = true;
          prize.faceUpPrize = true;

          const card = prize.cards[0];
          if (card instanceof TrainerCard && card.trainerType === TrainerType.SUPPORTER) {
            if (!CAN_PLAY_SUPPORTER_CARD(store, state, player, card, true)) {
              return;
            }
            const originalSupporterTurn = player.supporterTurn;
            player.supporterTurn = 0;
            try {
              store.reduceEffect(state, new TrainerEffect(player, card));
            } finally {
              player.supporterTurn = originalSupporterTurn;
            }
          }
        });
      };

      if (hasOwn && hasOpp) {
        return store.prompt(state, new SelectOptionPrompt(
          player.id,
          GameMessage.CHOOSE_OPTION,
          ['Your Prize cards', 'Opponent\'s Prize cards'],
          { allowCancel: false, defaultValue: 0 }
        ), choice => {
          pickPrize(choice === 1);
        });
      }

      return pickPrize(!hasOwn);
    }

    // Jaw Bite
    if (WAS_ATTACK_USED(effect, 1, this)) {
      return DEFENDING_POKEMON_TAKES_MORE_DAMAGE_DURING_YOUR_NEXT_TURN(store, state, effect, this, 20);
    }

    return state;
  }
}
