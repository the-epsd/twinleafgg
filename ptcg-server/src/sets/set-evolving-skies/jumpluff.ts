import { PokemonCard } from '../../game/store/card/pokemon-card';
import { CardTag, CardType, Stage, TrainerType } from '../../game/store/card/card-types';
import { Attack, ChooseAttackPrompt, ConfirmPrompt, GameLog, GameMessage, PowerType, State, StateUtils, StoreLike, TrainerCard } from '../../game';
import { Effect } from '../../game/store/effects/effect';
import { EndTurnEffect } from '../../game/store/effects/game-phase-effects';
import { AttackEffect } from '../../game/store/effects/game-effects';
import { DealDamageEffect } from '../../game/store/effects/attack-effects';

export class Jumpluff extends PokemonCard {
  public stage: Stage = Stage.STAGE_2;
  public evolvesFrom = 'Skiploom';
  public tags = [CardTag.RAPID_STRIKE];
  public cardType: CardType = CardType.GRASS;
  public hp: number = 90;
  public weakness = [{ type: CardType.FIRE }];

  public powers = [{
    name: 'Fluffy Barrage',
    powerType: PowerType.ABILITY,
    text: 'This Pokémon may attack twice each turn. If the first attack Knocks Out your opponent\'s Active Pokémon,'
      + ' you may attack again after your opponent chooses a new Active Pokémon.'
  }];

  public attacks = [{
    name: 'Spinning Attack',
    cost: [CardType.GRASS],
    damage: 60,
    text: ''
  }];

  public set: string = 'EVS';
  public regulationMark: string = 'E';
  public cardImage: string = 'assets/cardback.png';
  public setNumber: string = '4';
  public name: string = 'Jumpluff';
  public fullName: string = 'Jumpluff EVS';

  public attacksThisTurn = 0;

  public reduceEffect(store: StoreLike, state: State, effect: Effect): State {

    if (effect instanceof EndTurnEffect) {
      this.attacksThisTurn = 0;
    }

    //Copying TM or Scroll

    if (effect instanceof AttackEffect && effect.attack !== this.attacks[0] && effect.player.active.cards.includes(this)) {
      if (this.attacksThisTurn >= 2) {
        return state;
      }

      const player = effect.player;
      const opponent = StateUtils.getOpponent(state, player);

      const thisPokemon = player.active.cards;

      //do the attack that's NOT on the pokemon

      this.attacksThisTurn += 1;

      if (this.attacksThisTurn >= 2) {
        return state;
      }

      state = store.prompt(state, new ConfirmPrompt(
        effect.player.id,
        GameMessage.WANT_TO_USE_BARRAGE,
      ), wantToUse => {
        if (wantToUse) {
          let selected: Attack | null;
          store.prompt(state, new ChooseAttackPrompt(
            player.id,
            GameMessage.CHOOSE_ATTACK_TO_COPY,
            thisPokemon,
            { allowCancel: false }
          ), result => {
            selected = result;
            const attack: Attack | null = selected;

            if (attack !== null) {
              store.log(state, GameLog.LOG_PLAYER_COPIES_ATTACK, {
                name: player.name,
                attack: attack.name
              });

              // Perform attack
              const attackEffect = new AttackEffect(player, opponent, attack);
              store.reduceEffect(state, attackEffect);

              if (store.hasPrompts()) {
                store.waitPrompt(state, () => { });
              }

              if (attackEffect.damage > 0) {
                const dealDamage = new DealDamageEffect(attackEffect, attackEffect.damage);
                state = store.reduceEffect(state, dealDamage);
              }

            }

            return state;
          });
        }
      });
    }

    if (effect instanceof AttackEffect && effect.attack === this.attacks[0]) {
      if (this.attacksThisTurn >= 2) {
        return state;
      }

      const player = effect.player;
      const opponent = StateUtils.getOpponent(state, player);

      const thisPokemon = player.active.cards.filter(x => x.name === this.name || (x instanceof TrainerCard && x.trainerType === TrainerType.TOOL));


      // Ask if want to activate Fluyffy Barrage

      this.attacksThisTurn += 1;

      if (this.attacksThisTurn >= 2) {
        return state;
      }

      state = store.prompt(state, new ConfirmPrompt(
        effect.player.id,
        GameMessage.WANT_TO_USE_BARRAGE,
      ), wantToUse => {
        if (wantToUse) {
          let selected: Attack | null;
          store.prompt(state, new ChooseAttackPrompt(
            player.id,
            GameMessage.CHOOSE_ATTACK_TO_COPY,
            thisPokemon,
            { allowCancel: false, }
          ), result => {
            selected = result;
            const attack: Attack | null = selected;

            if (attack !== null) {
              store.log(state, GameLog.LOG_PLAYER_COPIES_ATTACK, {
                name: player.name,
                attack: attack.name
              });

              // Perform attack
              const attackEffect = new AttackEffect(player, opponent, attack);
              store.reduceEffect(state, attackEffect);

              if (store.hasPrompts()) {
                store.waitPrompt(state, () => { });
              }

              if (attackEffect.damage > 0) {
                const dealDamage = new DealDamageEffect(attackEffect, attackEffect.damage);
                state = store.reduceEffect(state, dealDamage);
              }

            }

            return state;
          });
        }
      });
    }


    return state;
  }
}