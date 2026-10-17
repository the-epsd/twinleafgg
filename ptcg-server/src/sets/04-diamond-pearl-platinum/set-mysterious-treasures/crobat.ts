import { PokemonCard } from '../../../game/store/card/pokemon-card';
import { CardType, Stage } from '../../../game/store/card/card-types';
import { PowerType, State, StateUtils, StoreLike } from '../../../game';
import { Effect } from '../../../game/store/effects/effect';
import { AfterAttackEffect } from '../../../game/store/effects/game-phase-effects';
import { GameMessage } from '../../../game/game-message';
import { SHUFFLE_THIS_POKEMON_AND_ALL_ATTACHED_CARDS_INTO_YOUR_DECK } from '../../../game/store/prefabs/attack-effects';
import { THIS_ATTACK_DOES_X_DAMAGE_TO_1_OF_YOUR_OPPONENTS_POKEMON } from '../../../game/store/prefabs/attack-effects';
import { ADD_POISON_TO_PLAYER_ACTIVE, COIN_FLIP_PROMPT, CONFIRMATION_PROMPT, IS_POKEPOWER_BLOCKED, JUST_EVOLVED, WAS_ATTACK_USED } from '../../../game/store/prefabs/prefabs';

export class Crobat extends PokemonCard {
  public stage: Stage = Stage.STAGE_2;
  public evolvesFrom: string = 'Golbat';
  public hp: number = 100;
  public cardType: CardType[] = [P];
  public weakness = [{ type: P, value: +30 }];
  public resistance = [{ type: F, value: -20 }];
  public retreat = [];

  public powers = [{
    name: 'Evolutionary Toxic',
    powerType: PowerType.POKEPOWER,
    text: 'Once during your turn, when you play Crobat from your hand to evolve 1 of your Pokémon, you may choose 1 of the Defending Pokémon. That Pokémon is now Poisoned. Put 2 damage counters instead of 1 on that Pokémon between turns.'
  }];

  public attacks = [{
    name: 'Strike and Fade',
    cost: [P, P],
    damage: 0,
    text: 'Choose 1 of your opponent\'s Pokémon. This attack does 50 damage to that Pokémon. (Don\'t apply Weakness and Resistance for Benched Pokémon.) Flip a coin. If tails, shuffle Crobat and all cards attached to it back into your deck.'
  }];

  public set: string = 'MT';
  public cardImage: string = 'assets/cardback.png';
  public setNumber: string = '23';
  public name: string = 'Crobat';
  public fullName: string = 'Crobat MT';

  private shuffleOnTails = false;

  public reduceEffect(store: StoreLike, state: State, effect: Effect): State {
    // Evolutionary Toxic
    if (JUST_EVOLVED(effect, this) && !IS_POKEPOWER_BLOCKED(store, state, effect.player, this)) {
      CONFIRMATION_PROMPT(store, state, effect.player, wantToUse => {
        if (!wantToUse) {
          return;
        }
        const opponent = StateUtils.getOpponent(state, effect.player);
        ADD_POISON_TO_PLAYER_ACTIVE(store, state, opponent, this, 20);
      }, GameMessage.WANT_TO_USE_ABILITY);
    }

    // Strike and Fade
    if (WAS_ATTACK_USED(effect, 0, this)) {
      THIS_ATTACK_DOES_X_DAMAGE_TO_1_OF_YOUR_OPPONENTS_POKEMON(50, effect, store, state);
      this.shuffleOnTails = false;
      COIN_FLIP_PROMPT(store, state, effect.player, result => {
        if (!result) {
          this.shuffleOnTails = true;
        }
      });
    }

    if (effect instanceof AfterAttackEffect && this.shuffleOnTails) {
      this.shuffleOnTails = false;
      SHUFFLE_THIS_POKEMON_AND_ALL_ATTACHED_CARDS_INTO_YOUR_DECK(store, state, effect);
    }

    return state;
  }
}
