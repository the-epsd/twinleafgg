import { Card, CardList, CardTag, CardType, ChooseCardsPrompt, ChoosePrizePrompt, GameMessage, PokemonCard, Stage, State, StoreLike, SuperType } from '../../game';
import { Effect } from '../../game/store/effects/effect';
import { AttackEffect } from '../../game/store/effects/game-effects';


export class BlacephalonUNB extends PokemonCard {
  public tags = [CardTag.ULTRA_BEAST];
  public stage: Stage = Stage.BASIC;
  public cardType: CardType = CardType.FIRE;
  public hp: number = 120;
  public weakness = [{ type: CardType.WATER }];
  public retreat = [CardType.COLORLESS, CardType.COLORLESS];
  public set = 'UNB';
  public setNumber = '32';
  public cardImage = 'assets/cardback.png';
  public name = 'Blacephalon';
  public fullName = 'Blacephalon UNB';
  public attacks = [
    {
      name: 'Blazer',
      cost: [CardType.FIRE],
      damage: 10,
      text: 'Turn 1 of your face-down Prize cards face up. If it\'s a R Energy card, this attack does ' +
        '50 more damage. (That Prize card remains face up for the rest of the game.)'
    },
    {
      name: 'Fireball Circus',
      cost: [CardType.FIRE, CardType.FIRE, CardType.FIRE],
      damage: 0,
      text: 'Discard any number of R Energy cards from your hand. This attack does 50 damage for ' +
        'each card you discarded in this way..'
    },
  ];

  public reduceEffect(store: StoreLike, state: State, effect: Effect): State {
    // Blazer
    if (effect instanceof AttackEffect && effect.attack === this.attacks[0]) {
      const player = effect.player;
      return store.prompt(state, new ChoosePrizePrompt(
        player.id,
        GameMessage.CHOOSE_PRIZE_CARD,
        { count: 1, allowCancel: false }
      ), prizes => {
        if (prizes && prizes.length > 0) {
          const prize: CardList = prizes[0];
          const prizeCard: Card = prize.cards[0];
          if ((prizeCard.superType == SuperType.ENERGY) && (prizeCard.name == 'Fire Energy')) {
            effect.damage += 50;
          }
          prize.isPublic = true;
          prize.isSecret = false;
        }
      });
    }
    // Fireball Circus
    if (effect instanceof AttackEffect && effect.attack === this.attacks[1]) {
      const player = effect.player;
      return store.prompt(state, new ChooseCardsPrompt(
        player,
        GameMessage.CHOOSE_CARD_TO_DISCARD,
        player.hand,
        { superType: SuperType.ENERGY, name: 'Fire Energy' },
        { min: 1, allowCancel: false }
      ), selected => {
        effect.damage += (50 * selected.length);
        player.hand.moveCardsTo(selected, player.discard);
      });
    }

    return state;
  }
}