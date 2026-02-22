import { PokemonCard } from '../../game/store/card/pokemon-card';
import { Stage, CardType, SpecialCondition } from '../../game/store/card/card-types';
import { StoreLike, State, ChoosePokemonPrompt, GameMessage, PlayerType, SlotType, GamePhase, StateUtils } from '../../game';
import { Effect } from '../../game/store/effects/effect';
import { KnockOutEffect } from '../../game/store/effects/game-effects';
import { AddSpecialConditionsEffect } from '../../game/store/effects/attack-effects';
import { EndTurnEffect } from '../../game/store/effects/game-phase-effects';
import { DAMAGE_OPPONENT_POKEMON, WAS_ATTACK_USED } from '../../game/store/prefabs/prefabs';

export class Crobat extends PokemonCard {
  public stage: Stage = Stage.STAGE_2;
  public regulationMark: string = 'F';
  public cardType: CardType = CardType.DARK;
  public hp: number = 130;
  public weakness = [{ type: CardType.FIGHTING }];
  public retreat = [];
  public evolvesFrom = 'Golbat';

  public attacks = [{
    name: 'Venomous Fang',
    cost: [CardType.DARK],
    damage: 50,
    text: 'Your opponent\'s Active Pokemon is now Poisoned.'
  },
  {
    name: 'Critical Bite',
    cost: [CardType.COLORLESS, CardType.COLORLESS, CardType.COLORLESS],
    damage: 0,
    text: 'This attack does 30 damage to 1 of your opponent\'s Pokemon. (Don\'t apply Weakness and Resistance for Benched Pokémon.) If 1 of your opponent\'s Pokemon is Knocked Out by damage from this attack, take 2 more Prize Cards.',
  }];

  public set: string = 'SIT';
  public cardImage: string = 'assets/cardback.png';
  public setNumber: string = '105';
  public name: string = 'Crobat';
  public fullName: string = 'Crobat SIT';

  private usedCriticalBite = false;
  public reduceEffect(store: StoreLike, state: State, effect: Effect): State {

    if (WAS_ATTACK_USED(effect, 0, this)) {
      this.usedCriticalBite = false;
      const specialConditionEffect = new AddSpecialConditionsEffect(effect, [SpecialCondition.POISONED]);
      store.reduceEffect(state, specialConditionEffect);
    }

    if (WAS_ATTACK_USED(effect, 1, this)) {
      const player = effect.player;
      this.usedCriticalBite = true;

      const max = Math.min(1);
      return store.prompt(state, new ChoosePokemonPrompt(
        player.id,
        GameMessage.CHOOSE_POKEMON_TO_DAMAGE,
        PlayerType.TOP_PLAYER,
        [SlotType.ACTIVE, SlotType.BENCH],
        { min: 1, max: max, allowCancel: false }
      ), selected => {
        const targets = selected || [];
        DAMAGE_OPPONENT_POKEMON(store, state, effect, 30, targets);
      });
    }

    if (effect instanceof KnockOutEffect) {
      const player = effect.player;
      const opponent = StateUtils.getOpponent(state, player);

      // Do not activate between turns, or when it's not opponents turn.
      if (state.phase !== GamePhase.ATTACK || state.players[state.activePlayer] !== opponent) {
        return state;
      }

      // Crobat wasn't attacking
      const pokemonCard = opponent.active.getPokemonCard();
      if (pokemonCard !== this) {
        return state;
      }

      // Check if the attack that caused the KnockOutEffect is "Critical Bite"
      if (this.usedCriticalBite === true) {
        if (effect.prizeCount > 0) {
          effect.prizeCount += 2;
          this.usedCriticalBite = false;
        }
      }
      return state;
    }

    if (effect instanceof EndTurnEffect && this.usedCriticalBite === true) {
      this.usedCriticalBite = false;
    }
    return state;
  }
}