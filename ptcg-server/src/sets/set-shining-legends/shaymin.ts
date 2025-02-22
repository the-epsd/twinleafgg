import { PokemonCard } from '../../game/store/card/pokemon-card';
import { Stage, CardType } from '../../game/store/card/card-types';
import { StoreLike } from '../../game/store/store-like';
import { State } from '../../game/store/state/state';
import { Effect } from '../../game/store/effects/effect';
import { AttackEffect, KnockOutEffect } from '../../game/store/effects/game-effects';
import { ShuffleDeckPrompt, StateUtils, GamePhase } from '../../game';
import { EndTurnEffect } from '../../game/store/effects/game-phase-effects';


export class Shaymin extends PokemonCard {

  public stage: Stage = Stage.BASIC;

  public cardType: CardType = CardType.GRASS;

  public hp: number = 70;

  public weakness = [{ type: CardType.FIRE }];

  public retreat = [CardType.COLORLESS];

  public attacks = [
    {
      name: 'Flippity Flap',
      cost: [CardType.GRASS],
      damage: 0,
      text: 'Shuffle your hand into your deck. Then, draw 6 cards.'
    },
    {
        name: 'Rally Back',
        cost: [CardType.GRASS, CardType.COLORLESS],
        damage: 30,
        damageCalculation: '+',
        text: 'If any of your Pokémon were Knocked Out by damage from an attack from your opponent\'s Pokémon during their last turn, this attack does 90 more damage.'
    }
  ];

  public set: string = 'SLG';

  public cardImage: string = 'assets/cardback.png';

  public setNumber: string = '7';

  public name: string = 'Shaymin';

  public fullName: string = 'Shaymin SLG';

  public readonly RETALIATE_MARKER = 'RETALIATE_MARKER';


  public reduceEffect(store: StoreLike, state: State, effect: Effect): State {

    if (effect instanceof AttackEffect && effect.attack === this.attacks[0]) {

      const player = effect.player;
      const cards = player.hand.cards.filter(c => c !== this);

      if (cards.length > 0) {
        player.hand.moveCardsTo(cards, player.deck);

        store.prompt(state, new ShuffleDeckPrompt(player.id), order => {
          player.deck.applyOrder(order);
        });
      }

      player.deck.moveTo(player.hand, 6);
      return state;
    }

    if (effect instanceof AttackEffect && effect.attack === this.attacks[1]) {
        const player = effect.player;
  
        if (player.marker.hasMarker(this.RETALIATE_MARKER)) {
          effect.damage += 90;
        }
  
        return state;
      }
  
      if (effect instanceof KnockOutEffect && effect.player.marker.hasMarker(effect.player.DAMAGE_DEALT_MARKER)) {
        const player = effect.player;
        const opponent = StateUtils.getOpponent(state, player);
  
        // Do not activate between turns, or when it's not opponents turn.
        if (state.phase !== GamePhase.ATTACK || state.players[state.activePlayer] !== opponent) {
          return state;
        }
  
        const cardList = StateUtils.findCardList(state, this);
        const owner = StateUtils.findOwner(state, cardList);
        if (owner === player) {
          effect.player.marker.addMarkerToState(this.RETALIATE_MARKER);
        }
        return state;
      }
  
      if (effect instanceof EndTurnEffect) {
        effect.player.marker.removeMarker(this.RETALIATE_MARKER);
      }
      return state;

  }
}