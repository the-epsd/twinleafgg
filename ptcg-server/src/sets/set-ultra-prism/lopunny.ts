import { PokemonCard } from '../../game/store/card/pokemon-card';
import { Stage, CardType } from '../../game/store/card/card-types';
import { ConfirmPrompt, GameMessage, StoreLike, State } from '../../game';
import { Effect } from '../../game/store/effects/effect';
import { AfterAttackEffect, EndTurnEffect } from '../../game/store/effects/game-phase-effects';
import { WAS_ATTACK_USED, MULTIPLE_COIN_FLIPS_PROMPT } from '../../game/store/prefabs/prefabs';
import { SHUFFLE_THIS_POKEMON_AND_ALL_ATTACHED_CARDS_INTO_YOUR_DECK } from '../../game/store/prefabs/attack-effects';

export class Lopunny extends PokemonCard {
  public stage: Stage = Stage.STAGE_1;
  public evolvesFrom: string = 'Buneary';
  public cardType: CardType = C;
  public hp: number = 90;
  public weakness = [{ type: F }];
  public retreat = [C];

  public wantsToShuffle: boolean = false;

  public attacks = [
    {
      name: 'Stompy Stomp',
      cost: [C],
      damage: 40,
      damageCalculation: 'x' as 'x',
      text: 'Flip 2 coins. This attack does 40 damage for each heads.'
    },
    {
      name: 'Happy Turn',
      cost: [C, C],
      damage: 60,
      text: 'You may shuffle this Pokémon and all cards attached to it into your deck.'
    }
  ];

  public set: string = 'UPR';
  public setNumber: string = '107';
  public cardImage: string = 'assets/cardback.png';
  public name: string = 'Lopunny';
  public fullName: string = 'Lopunny UPR';

  public reduceEffect(store: StoreLike, state: State, effect: Effect): State {
    // Attack 1: Stompy Stomp
    // Ref: set-x-and-y/scolipede.ts (Random Peck - multiple coin flips damage)
    if (WAS_ATTACK_USED(effect, 0, this)) {
      MULTIPLE_COIN_FLIPS_PROMPT(store, state, effect.player, 2, results => {
        effect.damage = 40 * results.filter(r => r).length;
      });
    }

    // Attack 2: Happy Turn
    // Ref: set-guardians-rising/politoed.ts (Hyper Jump - optional shuffle self into deck)
    if (WAS_ATTACK_USED(effect, 1, this)) {
      store.prompt(state, new ConfirmPrompt(
        effect.player.id,
        GameMessage.WANT_TO_USE_ABILITY,
      ), wantToShuffle => {
        this.wantsToShuffle = wantToShuffle;
      });
    }

    if (effect instanceof AfterAttackEffect && this.wantsToShuffle) {
      this.wantsToShuffle = false;
      return SHUFFLE_THIS_POKEMON_AND_ALL_ATTACHED_CARDS_INTO_YOUR_DECK(store, state, effect);
    }

    if (effect instanceof EndTurnEffect) {
      this.wantsToShuffle = false;
    }

    return state;
  }
}
