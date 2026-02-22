import { PokemonCard } from '../../game/store/card/pokemon-card';
import { Stage, CardType, SuperType } from '../../game/store/card/card-types';
import { Card, ChooseCardsPrompt, CoinFlipPrompt, GameMessage, PlayerType, StateUtils } from '../../game';
import { StoreLike, State } from '../../game';

import { Effect } from '../../game/store/effects/effect';
import { DiscardCardsEffect, PutCountersEffect } from '../../game/store/effects/attack-effects';
import { WAS_ATTACK_USED } from '../../game/store/prefabs/prefabs';

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
    if (WAS_ATTACK_USED(effect, 0, this)) {
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
    if (WAS_ATTACK_USED(effect, 1, this)) {

      const player = effect.player;
      const opponent = StateUtils.getOpponent(state, player);

      // Defending Pokemon has no energy cards attached
      if (!opponent.active.cards.some(c => c.superType === SuperType.ENERGY)) {
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
            return store.reduceEffect(state, new DiscardCardsEffect(effect, [card]));
          });
        }
      });
    }

    return state;
  }
}