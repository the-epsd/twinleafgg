import { PokemonCard } from '../../game/store/card/pokemon-card';
import { Stage, CardType, CardTag } from '../../game/store/card/card-types';
import { StoreLike, State, StateUtils, GameError, GameMessage, ChooseCardsPrompt } from '../../game';
import { Effect } from '../../game/store/effects/effect';
import { AttackEffect, RetreatEffect } from '../../game/store/effects/game-effects';
import { EndTurnEffect } from '../../game/store/effects/game-phase-effects';

export class Arbokex extends PokemonCard {
  public regulationMark = 'G';
  public tags = [CardTag.POKEMON_ex];
  public stage: Stage = Stage.STAGE_1;
  public evolvesFrom = 'Ekans';
  public cardType: CardType = CardType.DARK;
  public hp: number = 270;
  public weakness = [{ type: CardType.FIGHTING }];
  public retreat = [CardType.COLORLESS, CardType.COLORLESS];

  public attacks = [{
    name: 'Bind Down',
    cost: [CardType.DARK, CardType.DARK],
    damage: 70,
    text: ' During your opponent\'s next turn, the Defending Pokémon can\'t retreat. '
  },
  {
    name: 'Menacing Fangs',
    cost: [CardType.DARK, CardType.DARK, CardType.DARK],
    damage: 150,
    text: ' Your opponent discards 2 cards from their hand. '
  }];

  public set: string = 'MEW';
  public cardImage: string = 'assets/cardback.png';
  public setNumber: string = '24';
  public name: string = 'Arbok ex';
  public fullName: string = 'Arbok ex MEW';

  public readonly DEFENDING_POKEMON_CANNOT_RETREAT_MARKER = 'DEFENDING_POKEMON_CANNOT_RETREAT_MARKER';


  public reduceEffect(store: StoreLike, state: State, effect: Effect): State {

    if (effect instanceof AttackEffect && effect.attack === this.attacks[0]) {
      const player = effect.player;
      const opponent = StateUtils.getOpponent(state, player);
      opponent.active.attackMarker.addMarker(this.DEFENDING_POKEMON_CANNOT_RETREAT_MARKER, this);
    }

    if (effect instanceof RetreatEffect && effect.player.active.attackMarker.hasMarker(this.DEFENDING_POKEMON_CANNOT_RETREAT_MARKER, this)) {
      throw new GameError(GameMessage.BLOCKED_BY_EFFECT);
    }

    if (effect instanceof EndTurnEffect) {
      effect.player.active.attackMarker.removeMarker(this.DEFENDING_POKEMON_CANNOT_RETREAT_MARKER, this);
    }

    if (effect instanceof AttackEffect && effect.attack === this.attacks[1]) {
      const player = effect.player;
      const opponent = StateUtils.getOpponent(state, player);

      if (opponent.hand.cards.length < 2) {
        const cards = opponent.hand.cards;
        opponent.hand.moveCardsTo(cards, player.discard);
        return state;
      }

      store.prompt(state, new ChooseCardsPrompt(
          opponent,
        GameMessage.CHOOSE_CARD_TO_DISCARD,
        opponent.hand,
        {},
        { min: 2, max: 2, allowCancel: false }
      ), selected => {
        const cards = selected || [];
        opponent.hand.moveCardsTo(cards, opponent.discard);
      });

      return state;
    }

    return state;
  }
}