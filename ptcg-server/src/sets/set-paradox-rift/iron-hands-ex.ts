
import { PokemonCard } from '../../game/store/card/pokemon-card';
import { Stage, CardType, CardTag } from '../../game/store/card/card-types';
import { GamePhase, State, StateUtils, StoreLike } from '../../game';
import { Effect } from '../../game/store/effects/effect';
import { AttackEffect, KnockOutEffect } from '../../game/store/effects/game-effects';

export class IronHandsex extends PokemonCard {

  public stage: Stage = Stage.BASIC;

  public regulationMark = 'G';

  public tags = [CardTag.POKEMON_ex, CardTag.FUTURE];

  public cardType: CardType = CardType.LIGHTNING;

  public hp: number = 230;

  public weakness = [{ type: CardType.FIGHTING }];

  public retreat = [CardType.COLORLESS, CardType.COLORLESS, CardType.COLORLESS, CardType.COLORLESS];

  public attacks = [
    {
      name: 'Arm Press',
      cost: [CardType.LIGHTNING, CardType.LIGHTNING, CardType.COLORLESS],
      damage: 160,
      text: ''
    },
    {
      name: 'Amp You Very Much',
      cost: [CardType.LIGHTNING, CardType.COLORLESS, CardType.COLORLESS, CardType.COLORLESS],
      damage: 120,
      text: 'If your opponent\'s Pokemon is Knocked Out by damage from this attack, take 1 more Prize card.'
    },
  ];

  public set: string = 'PAR';

  public cardImage: string = 'assets/cardback.png';

  public setNumber: string = '70';

  public name: string = 'Iron Hands ex';

  public fullName: string = 'Iron Hands ex PAR';

  private usedAmpYouVeryMuch = false;

  public reduceEffect(store: StoreLike, state: State, effect: Effect): State {

    if (effect instanceof AttackEffect && effect.attack === this.attacks[0]) {
      this.usedAmpYouVeryMuch = false;
    }

    if (effect instanceof AttackEffect && effect.attack === this.attacks[1]) {
      this.usedAmpYouVeryMuch = true;
    }

    if (effect instanceof KnockOutEffect && effect.target === effect.player.active) {
      const player = effect.player;
      const opponent = StateUtils.getOpponent(state, player);

      // Do not activate between turns, or when it's not opponents turn.
      if (state.phase !== GamePhase.ATTACK || state.players[state.activePlayer] !== opponent) {
        return state;
      }

      // Iron Hands wasn't attacking
      const pokemonCard = opponent.active.getPokemonCard();
      if (pokemonCard !== this) {
        return state;
      }

      // Check if the attack that caused the KnockOutEffect is "Amp You Very Much"
      if (this.usedAmpYouVeryMuch === true) {
        if (effect.prizeCount > 0) {
          effect.prizeCount += 1;
          this.usedAmpYouVeryMuch = false;
        }
      }

      return state;
    }

    return state;
  }
}
