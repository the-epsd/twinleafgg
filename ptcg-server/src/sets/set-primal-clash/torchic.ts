import { PokemonCard } from '../../game/store/card/pokemon-card';
import { Stage, CardType, SuperType } from '../../game/store/card/card-types';
import { Attack, PowerType } from '../../game/store/card/pokemon-types';
import { StoreLike, State, StateUtils, ConfirmPrompt, GameMessage, ChooseAttackPrompt, GameLog, EnergyCard, GameError, ChooseCardsPrompt, CoinFlipPrompt } from '../../game';
import { Effect } from '../../game/store/effects/effect';
import { EndTurnEffect } from '../../game/store/effects/game-phase-effects';
import { AttackEffect } from '../../game/store/effects/game-effects';
import { DealDamageEffect } from '../../game/store/effects/attack-effects';

export class Torchic extends PokemonCard {
  public stage: Stage = Stage.BASIC;
  public cardType: CardType = CardType.FIRE;
  public hp: number = 50;
  public weakness = [{ type: CardType.WATER }];
  public retreat = [CardType.COLORLESS];

  public powers = [{
    name: 'Barrage',
    powerType: PowerType.ANCIENT_TRAIT,
    text: 'This Pokémon may attack twice a turn. (If the first attack Knocks Out your opponent\'s Active Pokémon, you may attack again after your opponent chooses a new Active Pokémon.)'
  }];

  public attacks = [{
    name: 'Flare Bonus',
    cost: [CardType.FIRE],
    damage: 0,
    text: ' Discard a [R] Energy card from your hand. If you do, draw 2 cards. '
  },
  {
    name: 'Claw',
    cost: [CardType.FIRE],
    damage: 20,
    text: ' Flip a coin. If tails, this attack does nothing. '
  }];

  public set = 'PRC';
  public cardImage: string = 'assets/cardback.png';
  public setNumber: string = '26';
  public name = 'Torchic';
  public fullName = 'Torchic PRC';

  public attacksThisTurn = 0;

  public reduceEffect(store: StoreLike, state: State, effect: Effect): State {

    if (effect instanceof EndTurnEffect) {
      this.attacksThisTurn = 0;
    }

    if (effect instanceof AttackEffect && effect.attack !== this.attacks[0] &&
      effect.attack !== this.attacks[1] && effect.player.active.cards.includes(this)) {
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
        };
      });
    }

    if (effect instanceof AttackEffect && effect.attack === this.attacks[0]) {
      if (this.attacksThisTurn >= 2) {
        return state;
      }

      const player = effect.player;
      const opponent = StateUtils.getOpponent(state, player);

      const thisPokemon = player.active.cards;

      //DO ATTACK

      let hasCardsInHand = false;
      const blocked: number[] = [];
      player.hand.cards.forEach((c, index) => {
        if (c instanceof EnergyCard) {
          if (c.provides.includes(CardType.FIRE)) {
            hasCardsInHand = true;
          } else {
            blocked.push(index);
          }
        }
      });

      if (hasCardsInHand === false) {
        throw new GameError(GameMessage.CANNOT_USE_POWER);
      }

      state = store.prompt(state, new ChooseCardsPrompt(
        player,
        GameMessage.CHOOSE_CARD_TO_DISCARD,
        player.hand,
        { superType: SuperType.ENERGY },
        { allowCancel: true, min: 1, max: 1, blocked }
      ), selected => {
        selected = selected || [];
        if (selected.length === 0) {
          return;
        }
        player.hand.moveCardsTo(selected, player.discard);
        player.deck.moveTo(player.hand, 2);
      });

      // BARRAGE ORIGIN TRAIT

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
        };
      });
    }

    if (effect instanceof AttackEffect && effect.attack === this.attacks[1]) {
      if (this.attacksThisTurn >= 2) {
        return state;
      }

      const player = effect.player;
      const opponent = StateUtils.getOpponent(state, player);

      const thisPokemon = player.active.cards;

      // DO ATTACK

      state = store.prompt(state, [
        new CoinFlipPrompt(player.id, GameMessage.COIN_FLIP)
      ], result => {
        if (result === false) {
          effect.damage = 0;
        }
      });

      // BARRAGE ORIGIN TRAIT

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
        };
      });

    }

    return state;
  }
}