
import { PokemonCard } from '../../game/store/card/pokemon-card';
import { Stage, CardType, CardTag } from '../../game/store/card/card-types';
import { StoreLike, State, StateUtils, GamePhase } from '../../game';
import { Effect } from '../../game/store/effects/effect';
import { KnockOutEffect } from '../../game/store/effects/game-effects';
import { DRAW_CARDS, WAS_ATTACK_USED } from '../../game/store/prefabs/prefabs';

export class GreedentVMAX extends PokemonCard {
  public stage: Stage = Stage.VMAX;
  public evolvesFrom = 'Greedent V';
  public cardType: CardType = C;
  public hp: number = 320;
  public tags = [CardTag.POKEMON_VMAX];
  public weakness = [{ type: F }];
  public retreat = [C, C, C];

  public attacks = [{
    name: 'Turn a Profit',
    cost: [C, C],
    damage: 30,
    text: 'If your opponent\'s Basic Pokémon is Knocked Out by damage from this attack, take 2 more Prize cards.'
  },
  {
    name: 'Max Gimme Gimme',
    cost: [C, C, C],
    damage: 160,
    text: 'Draw 3 cards.'
  }];

  public set: string = 'FST';
  public cardImage: string = 'assets/cardback.png';
  public setNumber: string = '218';
  public name: string = 'Greedent VMAX';
  public fullName: string = 'Greedent VMAX FST';

  private usedTurnAProfit = false;

  public reduceEffect(store: StoreLike, state: State, effect: Effect): State {

    if (WAS_ATTACK_USED(effect, 0, this)) {
      const opponent = effect.opponent;
      if (opponent.active.getPokemonCard()?.stage === Stage.BASIC){
        this.usedTurnAProfit = true;
      }
    }
    
    if (WAS_ATTACK_USED(effect, 1, this)) {
      const player = effect.player;
      this.usedTurnAProfit = false;
      DRAW_CARDS(player, 3);
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

      // Check if the attack that caused the KnockOutEffect is "Turn a Profit"
      if (this.usedTurnAProfit === true) {
        if (effect.prizeCount > 0) {
          effect.prizeCount += 2;
        }
        this.usedTurnAProfit = false;
      }

      return state;
    }
    return state;
  }
}