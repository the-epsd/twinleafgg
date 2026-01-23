import { PokemonCard } from '../../game/store/card/pokemon-card';
import { Stage, CardType } from '../../game/store/card/card-types';
import { StoreLike, State, StateUtils, PlayerType, SlotType, GameMessage } from '../../game';
import { PowerType } from '../../game/store/card/pokemon-types';
import { Effect } from '../../game/store/effects/effect';
import { PlayPokemonEffect } from '../../game/store/effects/play-card-effects';
import { WAS_ATTACK_USED, IS_ABILITY_BLOCKED, COIN_FLIP_PROMPT, SHUFFLE_CARDS_INTO_DECK, SWITCH_ACTIVE_WITH_BENCHED } from '../../game/store/prefabs/prefabs';
import { ConfirmPrompt } from '../../game/store/prompts/confirm-prompt';
import { ChoosePokemonPrompt } from '../../game/store/prompts/choose-pokemon-prompt';
import { AfterAttackEffect } from '../../game/store/effects/game-phase-effects';
import { EndTurnEffect } from '../../game/store/effects/game-phase-effects';

export class Shiftry extends PokemonCard {
  public stage: Stage = Stage.STAGE_2;
  public evolvesFrom = 'Nuzleaf';
  public cardType: CardType = D;
  public hp: number = 130;
  public weakness = [{ type: F }];
  public resistance = [{ type: P, value: -20 }];
  public retreat = [C];

  public powers = [{
    name: 'Giant Fan',
    powerType: PowerType.ABILITY,
    text: 'When you play this Pokemon from your hand to evolve 1 of your Pokemon, you may flip a coin. If heads, choose 1 of your opponent\'s Pokemon. Your opponent shuffles that Pokemon and all cards attached to it into his or her deck.'
  }];

  public attacks = [{
    name: 'Whirlwind',
    cost: [D, D, C],
    damage: 60,
    text: 'Your opponent switches the Defending Pokemon with 1 of his or her Benched Pokemon.'
  }];

  public set: string = 'NXD';
  public setNumber: string = '72';
  public cardImage: string = 'assets/cardback.png';
  public name: string = 'Shiftry';
  public fullName: string = 'Shiftry NXD';

  public usedWhirlwind: boolean = false;

  public reduceEffect(store: StoreLike, state: State, effect: Effect): State {
    // Giant Fan - when evolved, may shuffle opponent's Pokemon into deck
    if (effect instanceof PlayPokemonEffect && effect.pokemonCard === this) {
      const player = effect.player;

      // Check if ability is blocked
      if (IS_ABILITY_BLOCKED(store, state, player, this)) {
        return state;
      }

      // Prompt player to use ability
      state = store.prompt(state, new ConfirmPrompt(
        player.id,
        GameMessage.WANT_TO_USE_ABILITY
      ), wantToUse => {
        if (wantToUse) {
          // Flip a coin
          COIN_FLIP_PROMPT(store, state, player, result => {
            if (result) {
              const opponent = StateUtils.getOpponent(state, player);

              // Choose any of opponent's Pokemon
              store.prompt(state, new ChoosePokemonPrompt(
                player.id,
                GameMessage.CHOOSE_POKEMON_TO_PICK_UP,
                PlayerType.TOP_PLAYER,
                [SlotType.ACTIVE, SlotType.BENCH],
                { min: 1, max: 1, allowCancel: false }
              ), targets => {
                if (targets && targets.length > 0) {
                  const targetPokemon = targets[0];

                  // Shuffle all cards (Pokemon + attached cards) into deck
                  const cardsToShuffle = targetPokemon.cards.slice();
                  targetPokemon.clearEffects();
                  targetPokemon.cards = [];
                  SHUFFLE_CARDS_INTO_DECK(store, state, opponent, cardsToShuffle);
                }
              });
            }
          });
        }
      });

      return state;
    }

    // Whirlwind - opponent switches
    if (WAS_ATTACK_USED(effect, 0, this)) {
      this.usedWhirlwind = true;
    }

    // Execute switch after attack damage
    if (effect instanceof AfterAttackEffect && this.usedWhirlwind) {
      this.usedWhirlwind = false;
      const opponent = StateUtils.getOpponent(state, effect.player);

      const hasBenched = opponent.bench.some(b => b.cards.length > 0);
      if (hasBenched) {
        SWITCH_ACTIVE_WITH_BENCHED(store, state, opponent);
      }
    }

    // Clean up flag at end of turn
    if (effect instanceof EndTurnEffect && this.usedWhirlwind) {
      this.usedWhirlwind = false;
    }

    return state;
  }
}
