
import { PokemonCard } from '../../game/store/card/pokemon-card';
import { Stage, CardType, CardTag } from '../../game/store/card/card-types';
import { StoreLike, State, StateUtils, GamePhase } from '../../game';
import { Effect } from '../../game/store/effects/effect';
import { AttackEffect, KnockOutEffect } from '../../game/store/effects/game-effects';

export class Guzzlord extends PokemonCard {
  public stage: Stage = Stage.BASIC;
  public cardType: CardType = CardType.DARK;
  public hp: number = 150;
  public tags = [CardTag.ULTRA_BEAST];
  public weakness = [{ type: CardType.FIGHTING }];
  public resistance = [{ type: CardType.PSYCHIC, value: -20 }];
  public retreat = [CardType.COLORLESS, CardType.COLORLESS, CardType.COLORLESS, CardType.COLORLESS];

  public attacks = [{
    name: 'Mountain Munch',
    cost: [CardType.DARK],
    damage: 0,
    text: 'Discard the top card of your opponent\'s deck.'
  },
  {
    name: 'Red Banquet',
    cost: [CardType.DARK, CardType.DARK, CardType.COLORLESS, CardType.COLORLESS],
    damage: 120,
    text: 'If your opponent\'s Pokemon is Knocked Out by damage from this attack, take 1 more Prize card.'
  }];

  public set: string = 'CEC';
  public cardImage: string = 'assets/cardback.png';
  public setNumber: string = '136';
  public name: string = 'Guzzlord';
  public fullName: string = 'Guzzlord CEC';

  private usedRedBanquet = false;

  public reduceEffect(store: StoreLike, state: State, effect: Effect): State {

    if (effect instanceof AttackEffect && effect.attack === this.attacks[0]) {
      this.usedRedBanquet = false;
      const player = effect.player;
      const opponent = StateUtils.getOpponent(state, player);

      opponent.deck.moveTo(opponent.discard, 1);
    }

    if (effect instanceof AttackEffect && effect.attack === this.attacks[1]) {
      this.usedRedBanquet = true;
    }

    if (effect instanceof KnockOutEffect && effect.target === effect.player.active) {
      const player = effect.player;
      const opponent = StateUtils.getOpponent(state, player);

      // Do not activate between turns, or when it's not opponents turn.
      if (state.phase !== GamePhase.ATTACK || state.players[state.activePlayer] !== opponent) {
        return state;
      }

      // Guzzy wasn't attacking
      const pokemonCard = opponent.active.getPokemonCard();
      if (pokemonCard !== this) {
        return state;
      }

      // Check if the attack that caused the KnockOutEffect is "Red Banquet"
      if (this.usedRedBanquet === true) {
        if (effect.prizeCount > 0) {
          effect.prizeCount += 1;
          this.usedRedBanquet = false;
        }
      }

      return state;
    }
    return state;
  }
}