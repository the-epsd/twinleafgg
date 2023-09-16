import { PokemonCard } from '../../game/store/card/pokemon-card';
import { Stage, CardType, CardTag } from '../../game/store/card/card-types';
import { GamePhase, State, StateUtils, StoreLike } from '../../game';
import { AttackEffect, KnockOutEffect } from '../../game/store/effects/game-effects';
import { Effect } from '../../game/store/effects/effect';

export class IronHandsex extends PokemonCard {

  public stage: Stage = Stage.BASIC;

  public tags = [ CardTag.POKEMON_ex, CardTag.FUTURE ];

  public cardType: CardType = CardType.LIGHTNING;

  public hp: number = 230;

  public weakness = [{ type: CardType.FIGHTING }];

  public retreat = [ CardType.COLORLESS, CardType.COLORLESS ];

  public attacks = [
    {
      name: 'Arm Spike',
      cost: [ CardType.COLORLESS ],
      damage: 160,
      text: ''
    },
    {
      name: 'Extreme Amplifier',
      cost: [ CardType.COLORLESS ],
      damage: 120,
      text: 'If your opponent\'s Pokemon is Knocked Out by damage from this attack, take I more Prize card.'
    },
  ];

  public set: string = 'PAR';

  public name: string = 'Iron Hands ex';

  public fullName: string = 'Iron Hands ex PAR';

  public reduceEffect(store: StoreLike, state: State, effect: Effect): State {

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

      if (effect instanceof AttackEffect && effect.attack === this.attacks[1]) {

        effect.prizeCount += 1;
        return state;
      }

      return state;
    }
    return state;
  }
}
