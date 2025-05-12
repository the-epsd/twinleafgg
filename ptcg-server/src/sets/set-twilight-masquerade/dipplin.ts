import { CardType, Stage } from '../../game/store/card/card-types';
import { Attack, PokemonCard, Power, PowerType, State, StateUtils, StoreLike } from '../../game';
import { AttackEffect, PowerEffect, UseAttackEffect } from '../../game/store/effects/game-effects';
import { AfterAttackEffect, EndTurnEffect } from '../../game/store/effects/game-phase-effects';
import { DealDamageEffect } from '../../game/store/effects/attack-effects';
import { Effect } from '../../game/store/effects/effect';
import { ConfirmPrompt } from '../../game/store/prompts/confirm-prompt';
import { GameMessage } from '../../game/game-message';
import { ChooseAttackPrompt } from '../../game/store/prompts/choose-attack-prompt';
import { SuperType, TrainerType } from '../../game/store/card/card-types';
import { TrainerCard } from '../../game/store/card/trainer-card';
import { checkState } from '../../game/store/effect-reducers/check-effect';

export class Dipplin extends PokemonCard {

  public stage: Stage = Stage.STAGE_1;

  public evolvesFrom = 'Applin';
  public cardType: CardType = CardType.GRASS;

  public hp: number = 80;

  public weakness = [{ type: CardType.FIRE }];

  public retreat = [CardType.COLORLESS, CardType.COLORLESS];

  public powers: Power[] = [{
    name: 'Festival Lead',
    powerType: PowerType.ABILITY,
    text: 'If Festival Grounds is in play, this Pokémon may use an attack it has twice. If the first attack Knocks Out your opponent\'s Active Pokémon, you may attack again after your opponent chooses a new Active Pokémon.'
  }];

  public attacks: Attack[] = [{
    name: 'Do the Wave',
    cost: [CardType.GRASS],
    damage: 20,
    text: 'This attack does 20 damage for each of your Benched Pokémon.'
  }];

  public regulationMark = 'H';
  public set: string = 'TWM';
  public setNumber: string = '18';
  public cardImage: string = 'assets/cardback.png';
  public name: string = 'Dipplin';
  public fullName: string = 'Dipplin TWM1';

  // Track if the ability is active and Dipplin can attack twice
  private abilityActive: boolean = false;

  public reduceEffect(store: StoreLike, state: State, effect: Effect): State {
    // Handle the Do the Wave attack
    if (effect instanceof AttackEffect && effect.attack === this.attacks[0]) {
      const player = effect.player;
      const opponent = StateUtils.getOpponent(state, player);
      const activePokemon = opponent.active.getPokemonCard();

      if (activePokemon) {
        const playerBenched = player.bench.reduce((left, b) => left + (b.cards.length ? 1 : 0), 0);
        effect.damage = playerBenched * 20;
      }

      // Track attacks this turn
      player.active.attacksThisTurn = (player.active.attacksThisTurn || 0) + 1;

      // Check if ability should be active
      this.checkAbilityActive(store, state, player);
    }

    // Handle the UseAttackEffect for second attack logic
    if (effect instanceof UseAttackEffect &&
      effect.attack === this.attacks[0] &&
      this.abilityActive &&
      (effect.player.active.attacksThisTurn || 0) === 1) {

      // Check if opponent has an active Pokemon
      const opponent = StateUtils.getOpponent(state, effect.player);
      if (opponent.active.cards.length > 0) {
        // Prompt for second attack
        store.prompt(state, new ConfirmPrompt(
          effect.player.id,
          GameMessage.WANT_TO_ATTACK_AGAIN
        ), wantToAttackAgain => {
          if (wantToAttackAgain) {
            // Get all available attacks including tool attacks
            const attackableCards = effect.player.active.cards.filter(card =>
              card.superType === SuperType.POKEMON ||
              (card.superType === SuperType.TRAINER && card instanceof TrainerCard && card.trainerType === TrainerType.TOOL && card.attacks.length > 0)
            );

            // Use ChooseAttackPrompt for second attack
            store.prompt(state, new ChooseAttackPrompt(
              effect.player.id,
              GameMessage.CHOOSE_ATTACK_TO_COPY,
              attackableCards,
              { allowCancel: false }
            ), selectedAttack => {
              if (selectedAttack) {
                // Create and execute second attack
                const secondAttackEffect = new AttackEffect(effect.player, opponent, selectedAttack);
                state = store.reduceEffect(state, secondAttackEffect);

                // Apply damage from second attack if any
                if (secondAttackEffect.damage > 0) {
                  const dealDamage = new DealDamageEffect(secondAttackEffect, secondAttackEffect.damage);
                  state = store.reduceEffect(state, dealDamage);
                }

                // Process after attack effects
                state = store.reduceEffect(state, new AfterAttackEffect(effect.player));

                // Check for knockouts again
                state = checkState(store, state);

                // End turn after second attack
                state = store.reduceEffect(state, new EndTurnEffect(effect.player));
              }
            });
          } else {
            // End turn if player declined second attack
            state = store.reduceEffect(state, new EndTurnEffect(effect.player));
          }
        });
      } else {
        // End turn if opponent has no active Pokemon
        state = store.reduceEffect(state, new EndTurnEffect(effect.player));
      }
    }

    return state;
  }

  // Check if the Festival Lead ability is active
  private checkAbilityActive(store: StoreLike, state: State, player: any): void {
    // Try to reduce PowerEffect, to check if something is blocking our ability
    try {
      const stub = new PowerEffect(player, {
        name: 'test',
        powerType: PowerType.ABILITY,
        text: ''
      }, this);
      store.reduceEffect(state, stub);

      // Check if 'Festival Grounds' stadium is in play
      const stadiumCard = StateUtils.getStadiumCard(state);
      this.abilityActive = !!(stadiumCard && stadiumCard.name === 'Festival Grounds');

      // Update the canAttackTwice property directly
      this.canAttackTwice = this.abilityActive;

    } catch {
      // If the ability is blocked, we can't attack twice
      this.abilityActive = false;
      this.canAttackTwice = false;
    }
  }
}
