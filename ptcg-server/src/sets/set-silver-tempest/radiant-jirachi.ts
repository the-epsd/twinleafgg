import { PokemonCard } from '../../game/store/card/pokemon-card';
import { Stage, CardType, CardTag } from '../../game/store/card/card-types';
import { StoreLike } from '../../game/store/store-like';
import { State } from '../../game/store/state/state';
import { Effect } from '../../game/store/effects/effect';
import { AttackEffect, KnockOutEffect, PowerEffect } from '../../game/store/effects/game-effects';
import { PowerType } from '../../game/store/card/pokemon-types';
import { ChooseCardsPrompt, CoinFlipPrompt, GameMessage, PlayerType, ShuffleDeckPrompt, StateUtils } from '../../game';


export class RadiantJirachi extends PokemonCard {

  public tags = [CardTag.RADIANT];

  public regulationMark = 'F';

  public stage: Stage = Stage.BASIC;

  public cardType: CardType = CardType.METAL;

  public hp: number = 90;

  public weakness = [{ type: CardType.FIRE }];

  public resistance = [{ type: CardType.GRASS, value: -30 }];

  public retreat = [CardType.COLORLESS];

  public powers = [{
    name: 'Entrusted Wishes',
    powerType: PowerType.ABILITY,
    text: 'If this Pokémon is in the Active Spot and is Knocked Out by damage from an attack from your opponent\'s Pokémon, search your deck for up to 3 cards and put them into your hand. Then, shuffle your deck.'
  }];

  public attacks = [{
    name: 'Astral Misfortune',
    cost: [CardType.COLORLESS, CardType.COLORLESS],
    damage: 0,
    text: 'Flip 2 coins. If both of them are heads, your opponent\'s Active Pokémon is Knocked Out.'
  }];

  public set: string = 'SIT';

  public cardImage: string = 'assets/cardback.png';

  public setNumber: string = '120';

  public name: string = 'Radiant Jirachi';

  public fullName: string = 'Radiant Jirachi SIT';

  public reduceEffect(store: StoreLike, state: State, effect: Effect): State {

    if (effect instanceof KnockOutEffect && effect.target.cards.includes(this) && effect.player.marker.hasMarker(effect.player.DAMAGE_DEALT_MARKER)) {
      // This Pokemon was knocked out
      const player = effect.player;

      try {
        const stub = new PowerEffect(player, {
          name: 'test',
          powerType: PowerType.ABILITY,
          text: ''
        }, this);
        store.reduceEffect(state, stub);
      } catch {
        return state;
      }

      let cards: any[] = [];
      return store.prompt(state, new ChooseCardsPrompt(
        player,
        GameMessage.CHOOSE_CARD_TO_HAND,
        player.deck,
        {},
        { min: 0, max: 3, allowCancel: false }),
        (selected: any[]) => {
          cards = selected || [];
          if (cards.length > 0) {
            player.deck.moveCardsTo(cards, player.hand);
          }
          return store.prompt(state, new ShuffleDeckPrompt(player.id), (order: any[]) => {
            player.deck.applyOrder(order);
            return state;
          });
        });
    }

    if (effect instanceof AttackEffect && effect.attack === this.attacks[0]) {

      const player = effect.player;
      const opponent = StateUtils.getOpponent(state, player);

      let coin1Result = false;
      let coin2Result = false;

      return store.prompt(state, new CoinFlipPrompt(player.id, GameMessage.COIN_FLIP), (result: boolean) => {
        coin1Result = result;

        return store.prompt(state, new CoinFlipPrompt(player.id, GameMessage.COIN_FLIP), (result: boolean) => {
          coin2Result = result;

          if (coin1Result && coin2Result) {
            // Both heads

            opponent.forEachPokemon(PlayerType.TOP_PLAYER, cardList => {
              if (cardList.getPokemonCard() === opponent.active.cards[0]) {
                cardList.damage += 999;
              }
            });
          }
        });
      });
    }
    return state;
  }
}
