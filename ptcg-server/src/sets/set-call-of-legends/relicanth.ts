import { CardType, Stage } from '../../game/store/card/card-types';
import { StoreLike } from '../../game/store/store-like';
import { State } from '../../game/store/state/state';
import { Effect } from '../../game/store/effects/effect';
import { ChooseCardsPrompt, GameMessage, PlayerType, PokemonCard, StateUtils } from '../../game';

import { PutDamageEffect } from '../../game/store/effects/attack-effects';
import { EndTurnEffect } from '../../game/store/effects/game-phase-effects';
import { DRAW_CARDS, MOVE_CARDS, WAS_ATTACK_USED } from '../../game/store/prefabs/prefabs';

export class Relicanth extends PokemonCard {

  public stage: Stage = Stage.BASIC;

  public cardType: CardType = CardType.WATER;

  public hp: number = 80;

  public retreat = [CardType.COLORLESS, CardType.COLORLESS];

  public attacks = [
    {
      name: 'Prehistoric Wisdom',
      cost: [CardType.COLORLESS],
      damage: 0,
      text: 'Choose a card from your hand and put it in the Lost Zone. Then, draw 3 cards.'
    },
    {
      name: 'Granite Head',
      cost: [CardType.WATER, CardType.COLORLESS, CardType.COLORLESS],
      damage: 30,
      text: 'During your opponent\'s next turn, any damage done to Relicanth by attacks is reduced by 30 (after applying Weakness and Resistance).'
    },
  ];

  public set: string = 'CL';

  public cardImage: string = 'assets/cardback.png';

  public setNumber: string = '69';

  public name: string = 'Relicanth';

  public fullName: string = 'Relicanth CL';

  public readonly DURING_OPPONENTS_NEXT_TURN_TAKE_LESS_DAMAGE_MARKER = 'DURING_OPPONENTS_NEXT_TURN_TAKE_LESS_DAMAGE_MARKER';
  public readonly CLEAR_DURING_OPPONENTS_NEXT_TURN_TAKE_LESS_DAMAGE_MARKER = 'CLEAR_DURING_OPPONENTS_NEXT_TURN_TAKE_LESS_DAMAGE_MARKER';

  public reduceEffect(store: StoreLike, state: State, effect: Effect): State {

    if (WAS_ATTACK_USED(effect, 0, this)) {
      const player = effect.player;

      state = store.prompt(state, new ChooseCardsPrompt(
        player,
        GameMessage.CHOOSE_CARD_TO_DISCARD,
        player.hand,
        {},
        { allowCancel: false, min: 1, max: 1 }
      ), cards => {
        cards = cards || [];
        if (cards.length === 0) {
          return;
        }
        MOVE_CARDS(store, state, player.hand, player.lostzone, { cards, sourceCard: this, sourceEffect: this.attacks[0] });
        DRAW_CARDS(player, 3);
      });

      return state;
    }

    if (WAS_ATTACK_USED(effect, 0, this)) {
      const player = effect.player;
      const opponent = StateUtils.getOpponent(state, player);

      player.active.marker.addMarker(this.DURING_OPPONENTS_NEXT_TURN_TAKE_LESS_DAMAGE_MARKER, this);
      opponent.marker.addMarker(this.CLEAR_DURING_OPPONENTS_NEXT_TURN_TAKE_LESS_DAMAGE_MARKER, this);
      console.log('marker added');
    }

    if (effect instanceof PutDamageEffect && effect.target.cards.includes(this)) {
      if (effect.target.marker.hasMarker(this.DURING_OPPONENTS_NEXT_TURN_TAKE_LESS_DAMAGE_MARKER, this)) {
        effect.damage -= 30;
        return state;
      }
    }

    if (effect instanceof EndTurnEffect
      && effect.player.active.marker.hasMarker(this.CLEAR_DURING_OPPONENTS_NEXT_TURN_TAKE_LESS_DAMAGE_MARKER, this)) {
      effect.player.active.marker.removeMarker(this.CLEAR_DURING_OPPONENTS_NEXT_TURN_TAKE_LESS_DAMAGE_MARKER, this);
      const opponent = StateUtils.getOpponent(state, effect.player);
      opponent.forEachPokemon(PlayerType.TOP_PLAYER, (cardList) => {
        cardList.marker.removeMarker(this.DURING_OPPONENTS_NEXT_TURN_TAKE_LESS_DAMAGE_MARKER, this);
      });
      console.log('marker removed');
    }
    return state;
  }
}
