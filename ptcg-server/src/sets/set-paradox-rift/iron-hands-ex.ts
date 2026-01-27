
import { PokemonCard } from '../../game/store/card/pokemon-card';
import { Stage, CardType, CardTag } from '../../game/store/card/card-types';
import { GamePhase, State, StateUtils, StoreLike } from '../../game';
import { Effect } from '../../game/store/effects/effect';
import { KnockOutEffect } from '../../game/store/effects/game-effects';
import { WAS_ATTACK_USED } from '../../game/store/prefabs/prefabs';

export class IronHandsex extends PokemonCard {

  public stage: Stage = Stage.BASIC;

  public tags = [CardTag.POKEMON_ex, CardTag.FUTURE];

  public cardType: CardType = L;

  public hp: number = 230;

  public weakness = [{ type: F }];

  public retreat = [C, C, C, C];

  public attacks = [
    {
      name: 'Arm Press',
      cost: [L, L, C],
      damage: 160,
      text: ''
    },
    {
      name: 'Amp You Very Much',
      cost: [L, C, C, C],
      damage: 120,
      text: 'If your opponent\'s Pokemon is Knocked Out by damage from this attack, take 1 more Prize card.'
    },
  ];

  public regulationMark = 'G';

  public set: string = 'PAR';

  public cardImage: string = 'assets/cardback.png';

  public setNumber: string = '70';

  public name: string = 'Iron Hands ex';

  public fullName: string = 'Iron Hands ex PAR';

  private usedAmpYouVeryMuch = false;

  public reduceEffect(store: StoreLike, state: State, effect: Effect): State {

    if (WAS_ATTACK_USED(effect, 0, this)) {
      this.usedAmpYouVeryMuch = false;
    }

    if (WAS_ATTACK_USED(effect, 1, this)) {
      this.usedAmpYouVeryMuch = true;
    }

    if (effect instanceof KnockOutEffect && effect.target === effect.player.active) {
      const player = effect.player;
      const opponent = StateUtils.getOpponent(state, player);

      // Do not activate between turns, or when it's not opponents turn.
      if (state.phase !== GamePhase.ATTACK || state.players[state.activePlayer] !== opponent) {
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
