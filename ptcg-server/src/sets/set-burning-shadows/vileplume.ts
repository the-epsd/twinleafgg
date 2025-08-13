import { Attack, CardType, GameError, GameMessage, PokemonCard, Power, PowerType, Stage, State, StateUtils, StoreLike } from '../../game';
import { Effect } from '../../game/store/effects/effect';
import { EffectOfAbilityEffect, UseAttackEffect } from '../../game/store/effects/game-effects';
import { ADD_CONFUSION_TO_PLAYER_ACTIVE, ADD_SLEEP_TO_PLAYER_ACTIVE, AFTER_ATTACK, COIN_FLIP_PROMPT, IS_ABILITY_BLOCKED } from '../../game/store/prefabs/prefabs';

export class Vileplume extends PokemonCard {
  public stage: Stage = Stage.STAGE_2;
  public evolvesFrom: string = 'Gloom';
  public cardType: CardType = G;
  public hp: number = 140;
  public weakness = [{ type: R }];
  public retreat = [C, C, C];

  public powers: Power[] = [
    {
      name: 'Disgusting Pollen',
      powerType: PowerType.ABILITY,
      text: 'As long as this Pokémon is your Active Pokémon, your opponent\'s Basic Pokémon can\'t attack.'
    }
  ];

  public attacks: Attack[] = [
    {
      name: 'Downer Shock',
      cost: [G, G, C],
      damage: 60,
      text: 'Flip a coin. If heads, your opponent\'s Active Pokémon is now Asleep. If tails, your opponent\'s Active Pokémon is now Confused.'
    },
  ];

  public set: string = 'BUS';
  public setNumber: string = '6';
  public cardImage: string = 'assets/cardback.png';
  public name: string = 'Vileplume';
  public fullName: string = 'Vileplume BUS';

  public reduceEffect(store: StoreLike, state: State, effect: Effect): State {

    // Disgusting Pollen
    if (effect instanceof UseAttackEffect) {
      const opponent = StateUtils.getOpponent(state, effect.player);

      // Return if attacker is not a basic, this Pokemon is not in the opponent's active, or Ability is blocked
      if (!effect.source.isStage(Stage.BASIC)
        || opponent.active.getPokemonCard() !== this
        || IS_ABILITY_BLOCKED(store, state, opponent, this)) {
        return state;
      }

      // Check if Ability can target the attacker
      const basicBlockEffect = new EffectOfAbilityEffect(opponent, this.powers[0], this, effect.source);
      store.reduceEffect(state, basicBlockEffect);
      if (basicBlockEffect.target === effect.source) {
        throw new GameError(GameMessage.BLOCKED_BY_ABILITY);
      }
    }

    // Downer Shock
    if (AFTER_ATTACK(effect, 0, this)) {
      COIN_FLIP_PROMPT(store, state, effect.player, result => {
        const opponent = StateUtils.getOpponent(state, effect.player);
        if (result) {
          ADD_SLEEP_TO_PLAYER_ACTIVE(store, state, opponent, this);
        }
        else {
          ADD_CONFUSION_TO_PLAYER_ACTIVE(store, state, opponent, this);
        }
      });
    }

    return state;
  }
}