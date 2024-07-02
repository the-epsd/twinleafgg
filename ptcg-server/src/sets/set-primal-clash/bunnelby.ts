import { ChooseAttackPrompt, ChooseCardsPrompt, ConfirmPrompt, ShowCardsPrompt, ShuffleDeckPrompt } from '../../game';
import { GameLog, GameMessage } from '../../game/game-message';
import { CardType, Stage } from '../../game/store/card/card-types';
import { PokemonCard } from '../../game/store/card/pokemon-card';
import { Attack, PowerType } from '../../game/store/card/pokemon-types';
import { DealDamageEffect } from '../../game/store/effects/attack-effects';
import { Effect } from '../../game/store/effects/effect';
import { AttackEffect } from '../../game/store/effects/game-effects';
import { EndTurnEffect } from '../../game/store/effects/game-phase-effects';
import { StateUtils } from '../../game/store/state-utils';
import { State } from '../../game/store/state/state';
import { StoreLike } from '../../game/store/store-like';

export class Bunnelby extends PokemonCard {

  public stage: Stage = Stage.BASIC;

  public cardType: CardType = CardType.COLORLESS;

  public hp: number = 60;

  public weakness = [{ type: CardType.FIGHTING }];

  public retreat = [ CardType.COLORLESS, CardType.COLORLESS ];

  public powers = [{
    name: 'Barrage',
    powerType: PowerType.ANCIENT_TRAIT,
    text: 'This Pokémon may attack twice a turn. (If the first attack Knocks Out your opponent\'s Active Pokémon, you may attack again after your opponent chooses a new Active Pokémon.)'
  }];

  public attacks = [{
    name: 'Burrow',
    cost: [ CardType.COLORLESS ],
    damage: 0,
    text: 'Discard the top card of your opponent\'s deck.'
  }, {
    name: 'Rototiller',
    cost: [ CardType.COLORLESS],
    damage: 0,
    text: 'Shuffle a card from your discard pile into your deck.'
  }];

  public set: string = 'PRC';

  public name: string = 'Bunnelby';

  public fullName: string = 'Bunnelby PRC';

  public cardImage: string = 'assets/cardback.png';

  public setNumber: string = '121';
  
  public attacksThisTurn = 0;

  public reduceEffect(store: StoreLike, state: State, effect: Effect): State {

    if (effect instanceof EndTurnEffect) {
      this.attacksThisTurn = 0;
    }
    
    if (effect instanceof AttackEffect && effect.attack !== this.attacks[0] &&
      effect.attack !== this.attacks[1] && effect.player.active.cards.includes(this)) {
    
      
    }
    
    if (effect instanceof AttackEffect && effect.attack === this.attacks[0]) {
      if (this.attacksThisTurn >= 2) {
        return state;
      }
      
      const player = effect.player;
      const opponent = StateUtils.getOpponent(state, player);

      opponent.deck.moveTo(opponent.discard, 1);
      
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
            [player.active.getPokemonCard()!],
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
      const opponent = StateUtils.getOpponent(state, effect.player);
      
      if (player.discard.cards.length === 0) {
        this.attacksThisTurn += 1;        
      } else {
        state = store.prompt(state, new ChooseCardsPrompt(
          player.id,
          GameMessage.CHOOSE_CARD_TO_HAND,
          player.discard,
          { },
          { min: 1, max: 1, allowCancel: false }
        ), selected => {
          const cards = selected || [];
          
          this.attacksThisTurn += 1;
          
          store.prompt(state, [new ShowCardsPrompt(
            opponent.id,
            GameMessage.CARDS_SHOWED_BY_THE_OPPONENT,
            cards
          )], () => {
            player.discard.moveCardsTo(cards, player.deck);
          });
          
          cards.forEach(card => {
            store.log(state, GameLog.LOG_PLAYER_RETURNS_TO_DECK_FROM_DISCARD, { name: player.name, card: card.name });
          });
          
          store.prompt(state, new ShuffleDeckPrompt(player.id), order => {
            player.deck.applyOrder(order);
          });
        });        
      }
      
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
            [player.active.getPokemonCard()!],
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
