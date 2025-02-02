import { PokemonCard } from '../../game/store/card/pokemon-card';
import { Stage, CardType, SuperType } from '../../game/store/card/card-types';
import { Card, ChooseCardsPrompt, CoinFlipPrompt, EnergyCard, GameMessage, PlayerType, StateUtils } from '../../game';
import { StoreLike, State } from '../../game';
import { AttackEffect } from '../../game/store/effects/game-effects';
import { Effect } from '../../game/store/effects/effect';
import { PutCountersEffect } from '../../game/store/effects/attack-effects';

export class Yveltal extends PokemonCard {
  public stage: Stage = Stage.BASIC;
  public cardType: CardType = D;
  public hp: number = 120;
  public weakness = [{ type: L }];
  public resistance = [{ type: F, value: -20 }];
  public retreat = [C];

  public attacks = [
    {
      name: 'Corrosive Winds',
      cost: [CardType.DARK],
      damage: 0,
      text: 'Put 2 damage counters on each of your opponent\'s Pokemon that has any damage counters on it.'
    },
    {
      name: 'Destructive Beam',
      cost: [CardType.DARK, CardType.DARK, CardType.COLORLESS],
      damage: 100,
      text: 'Flip a coin. If heads, discard an Energy from your opponent\'s Active Pokemon.'
    },
  ];

  public regulationMark = 'H';
  public set = 'SFA';
  public setNumber = '35';
  public cardImage = 'assets/cardback.png';
  public name = 'Yveltal';
  public fullName = 'Yveltal SFA';

  public reduceEffect(store: StoreLike, state: State, effect: Effect): State {
    // Corrosive Winds
    if (effect instanceof AttackEffect && effect.attack === this.attacks[0]) {
      const opponent = effect.opponent;
      opponent.forEachPokemon(PlayerType.TOP_PLAYER, (cardList, card) => {
        if ((cardList.damage > 0)) {
          const putCountersEffect = new PutCountersEffect(effect, 20);
          putCountersEffect.target = cardList;
          store.reduceEffect(state, putCountersEffect);
        }
      });
    }

    // Destructive Beam
    if (effect instanceof AttackEffect && effect.attack === this.attacks[1]) {

      const player = effect.player;
      const opponent = StateUtils.getOpponent(state, player);

      // Defending Pokemon has no energy cards attached
      if (!opponent.active.cards.some(c => c instanceof EnergyCard)) {
        return state;
      }

      return store.prompt(state, [
        new CoinFlipPrompt(player.id, GameMessage.COIN_FLIP)
      ], result => {
        if (result === true) {

          let card: Card;
          return store.prompt(state, new ChooseCardsPrompt(
            player,
            GameMessage.CHOOSE_CARD_TO_DISCARD,
            opponent.active,
            { superType: SuperType.ENERGY },
            { min: 1, max: 1, allowCancel: false }
          ), selected => {
            card = selected[0];

            opponent.active.moveCardTo(card, opponent.discard);
            return state;
          });
        }
      });
    }

    return state;
  }
}