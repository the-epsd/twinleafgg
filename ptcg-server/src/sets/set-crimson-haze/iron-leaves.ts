import { PokemonCard } from '../../game/store/card/pokemon-card';
import { Stage, CardType, SuperType, CardTag } from '../../game/store/card/card-types';
import { StoreLike, State, ChooseCardsPrompt, GamePhase, StateUtils } from '../../game';
import { AttackEffect, KnockOutEffect } from '../../game/store/effects/game-effects';
import { Effect } from '../../game/store/effects/effect';
import { GameMessage } from '../../game/game-message';
import { EndTurnEffect } from '../../game/store/effects/game-phase-effects';

export class IronLeaves extends PokemonCard {

  public tags = [ CardTag.FUTURE ];

  public regulationMark = 'H';
  
  public stage: Stage = Stage.BASIC;
  
  public cardType: CardType = CardType.GRASS;
  
  public hp: number = 120;
  
  public weakness = [{ type: CardType.FIRE }];
  
  public retreat = [ CardType.COLORLESS ];

  public attacks = [
    {
      name: 'Recovery Net',
      cost: [ CardType.GRASS ],
      damage: 0,
      text: 'Choose up to 2 Pokémon from your discard pile, reveal them, and put them into your hand.'
    },
    {
      name: 'Vengeful Edge',
      cost: [ CardType.GRASS, CardType.COLORLESS, CardType.COLORLESS ],
      damage: 100,
      text: 'If any of your Pokémon were Knocked Out by damage from an attack during your opponent\'s last turn, +60 damage.'
    }
  ];

  public set: string = 'SV5a';

  public name: string = 'Iron Leaves';

  public fullName: string = 'Iron Leaves SV5a';

  public cardImage: string = 'assets/cardback.png';

  public setNumber: string = '62';

  public readonly VENGEFUL_EDGE_MARKER = 'VENGEFUL_EDGE_MARKER';

  public reduceEffect(store: StoreLike, state: State, effect: Effect): State {

    if (effect instanceof AttackEffect && effect.attack === this.attacks[0]) {
      const player = effect.player;

      const pokemonCount = player.discard.cards.filter(c => {
        return c instanceof PokemonCard;
      }).length;

      if (pokemonCount === 0) {
        return state;
      }

      const max = Math.min(2, pokemonCount);

      return store.prompt(state, [
        new ChooseCardsPrompt(
          player.id,
          GameMessage.CHOOSE_CARD_TO_HAND,
          player.discard,
          { superType: SuperType.POKEMON },
          { min: 1, max, allowCancel: false }
        )], selected => {
        const cards = selected || [];
        player.discard.moveCardsTo(cards, player.hand);
      });
    }

    if (effect instanceof AttackEffect && effect.attack === this.attacks[1]) {
      const player = effect.player;
  
      if (player.marker.hasMarker(this.VENGEFUL_EDGE_MARKER)) {
        effect.damage += 60;
      }
  
      return state;
    }
  
    if (effect instanceof KnockOutEffect) {
      const player = effect.player;
      const opponent = StateUtils.getOpponent(state, player);
  
      // Do not activate between turns, or when it's not opponents turn.
      if (state.phase !== GamePhase.ATTACK || state.players[state.activePlayer] !== opponent) {
        return state;
      }
  
      const cardList = StateUtils.findCardList(state, this);
      const owner = StateUtils.findOwner(state, cardList);
      if (owner === player) {
        effect.player.marker.addMarker(this.VENGEFUL_EDGE_MARKER, this);
      }
      return state;
    }
  
    if (effect instanceof EndTurnEffect) {
      effect.player.marker.removeMarker(this.VENGEFUL_EDGE_MARKER);
    }
  
  
    return state;
  }

}
