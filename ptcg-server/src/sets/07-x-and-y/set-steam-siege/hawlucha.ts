import { CardType, Stage } from '../../../game/store/card/card-types';
import { PokemonCard } from '../../../game/store/card/pokemon-card';
import { Effect } from '../../../game/store/effects/effect';
import { PowerEffect } from '../../../game/store/effects/game-effects';
import { PlayPokemonEffect } from '../../../game/store/effects/play-card-effects';
import { ConfirmPrompt } from '../../../game/store/prompts/confirm-prompt';
import { GameMessage, PowerType, StateUtils, StoreLike, State } from '../../../game';
import { SWITCH_OUT_OPPONENT_ACTIVE_FROM_ABILITY } from '../../../game/store/prefabs/effect-of-ability-prefabs';
import { MULTIPLE_COIN_FLIPS_PROMPT, WAS_ATTACK_USED } from '../../../game/store/prefabs/prefabs';

export class Hawlucha extends PokemonCard {
  public stage: Stage = Stage.BASIC;
  public hp: number = 80;
  public cardType: CardType[] = [C];
  public weakness = [{ type: L }];
  public resistance = [{ type: F, value: -20 }];
  public retreat = [C];

  public powers = [{
    name: 'Sudden Cyclone',
    powerType: PowerType.ABILITY,
    exemptFromInitialize: true,
    text: 'When you play this Pok\u00e9mon from your hand onto your Bench, you may have your opponent switch his or her Active Pok\u00e9mon with 1 of his or her Benched Pok\u00e9mon.'
  }];

  public attacks = [{
    name: 'Acrobatics',
    cost: [C, C],
    damage: 20,
    damageCalculation: '+',
    text: 'Flip 2 coins. This attack does 20 more damage for each heads.'
  }];

  public set: string = 'STS';
  public cardImage: string = 'assets/cardback.png';
  public setNumber: string = '97';
  public name: string = 'Hawlucha';
  public fullName: string = 'Hawlucha STS';

  public reduceEffect(store: StoreLike, state: State, effect: Effect): State {
    // Sudden Cyclone
    if (effect instanceof PlayPokemonEffect && effect.pokemonCard === this) {
      const player = effect.player;
      const opponent = StateUtils.getOpponent(state, player);

      if (!opponent.bench.some(b => b.cards.length > 0)) {
        return state;
      }

      state = store.prompt(state, new ConfirmPrompt(
        player.id,
        GameMessage.WANT_TO_USE_ABILITY
      ), wantToUse => {
        if (!wantToUse) {
          return;
        }

        try {
          const stub = new PowerEffect(player, this.powers[0], this);
          store.reduceEffect(state, stub);
        } catch {
          return;
        }

        SWITCH_OUT_OPPONENT_ACTIVE_FROM_ABILITY(
          store,
          state,
          player,
          this.powers[0],
          this,
          { allowCancel: false },
        );
      });
    }

    // Acrobatics
    if (WAS_ATTACK_USED(effect, 0, this)) {
      MULTIPLE_COIN_FLIPS_PROMPT(store, state, effect.player, 2, results => {
        const heads = results.filter(r => r).length;
        effect.damage += 20 * heads;
      });
    }

    return state;
  }
}
