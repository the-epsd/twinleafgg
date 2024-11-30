import { PokemonCard } from '../../game/store/card/pokemon-card';
import { Stage, CardType, SuperType, CardTag } from '../../game/store/card/card-types';
import { StoreLike, State, ChooseCardsPrompt, GamePhase, StateUtils } from '../../game';
import { AttackEffect, KnockOutEffect } from '../../game/store/effects/game-effects';
import { Effect } from '../../game/store/effects/effect';
import { GameMessage } from '../../game/game-message';
import { EndTurnEffect } from '../../game/store/effects/game-phase-effects';

export class IronLeaves extends PokemonCard {

  public tags = [CardTag.FUTURE];

  public regulationMark = 'H';

  public stage: Stage = Stage.BASIC;

  public cardType: CardType = CardType.GRASS;

  public hp: number = 120;

  public weakness = [{ type: CardType.FIRE }];

  public retreat = [CardType.COLORLESS];

  public attacks = [
    {
      name: 'Recovery Net',
      cost: [CardType.GRASS],
      damage: 0,
      text: 'Choose up to 2 Pokémon from your discard pile, reveal them, and put them into your hand.'
    },
    {
      name: 'Avenging Edge',
      cost: [CardType.GRASS, CardType.COLORLESS, CardType.COLORLESS],
      damage: 100,
      damageCalculation: '+',
      text: 'If any of your Pokémon were Knocked Out by damage from an attack during your opponent\'s last turn, this attack does 60 more damage.'
    }
  ];

  public set: string = 'TWM';

  public name: string = 'Iron Leaves';

  public fullName: string = 'Iron Leaves TWM';

  public cardImage: string = 'assets/cardback.png';

  public setNumber: string = '19';

  public readonly RETALIATE_MARKER = 'RETALIATE_MARKER';

  // public damageDealt = false;

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
          player,
          GameMessage.CHOOSE_CARD_TO_HAND,
          player.discard,
          { superType: SuperType.POKEMON },
          { min: 1, max, allowCancel: false }
        )], selected => {
          const cards = selected || [];
          player.discard.moveCardsTo(cards, player.hand);
        });
    }

    if (effect instanceof EndTurnEffect) {
      effect.player.marker.removeMarker(this.RETALIATE_MARKER);
    }

    // if (effect instanceof DealDamageEffect || effect instanceof PutDamageEffect) {
    //   const player = StateUtils.getOpponent(state, effect.player);
    //   const cardList = StateUtils.findCardList(state, this);
    //   const owner = StateUtils.findOwner(state, cardList);

    //   if (player !== owner) {
    //     this.damageDealt = true;
    //   }
    // }

    // if (effect instanceof EndTurnEffect && effect.player === StateUtils.getOpponent(state, effect.player)) {
    //   const cardList = StateUtils.findCardList(state, this);
    //   const owner = StateUtils.findOwner(state, cardList);

    //   if (owner === effect.player) {
    //     this.damageDealt = false;
    //   }
    // }

    if (effect instanceof AttackEffect && effect.attack === this.attacks[1]) {
      const player = effect.player;

      if (player.marker.hasMarker(this.RETALIATE_MARKER)) {
        effect.damage += 60;
      }
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

    return state;
  }
}