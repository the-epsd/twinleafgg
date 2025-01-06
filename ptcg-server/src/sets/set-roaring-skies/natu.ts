import { PokemonCard } from '../../game/store/card/pokemon-card';
import { Stage, CardType } from '../../game/store/card/card-types';
import { PowerType } from '../../game/store/card/pokemon-types';
import { StoreLike, State, StateUtils, GamePhase, EnergyCard } from '../../game';
import { Effect } from '../../game/store/effects/effect';
import { AttackEffect, KnockOutEffect } from '../../game/store/effects/game-effects';

export class Natu extends PokemonCard {
  public stage: Stage = Stage.BASIC;
  public cardType: CardType = CardType.PSYCHIC;
  public hp: number = 40;
  public weakness = [{ type: CardType.PSYCHIC }];
  public retreat = [CardType.COLORLESS];

  public powers = [{
    name: 'Delta Plus',
    powerType: PowerType.ANCIENT_TRAIT,
    text: 'If your opponent\'s Pokemon is Knocked Out by damage from an ' +
      'attack of this Pokemon, take 1 more Prize card.'
  }];

  public attacks = [{
    name: 'Psywave',
    cost: [CardType.PSYCHIC, CardType.COLORLESS],
    damage: 10,
    text: ' This attack does 10 damage times the amount of Energy attached to your opponent\'s Active Pokémon.'
  }];

  public set: string = 'ROS';
  public setNumber: string = '28';
  public cardImage: string = 'assets/cardback.png';
  public name: string = 'Natu';
  public fullName: string = 'Natu ROS';

  public reduceEffect(store: StoreLike, state: State, effect: Effect): State {

    // Delta Plus
    if (effect instanceof KnockOutEffect) {
      const player = effect.player;
      const opponent = StateUtils.getOpponent(state, player);

      // Do not activate between turns, or when it's not opponents turn.
      if (state.phase !== GamePhase.ATTACK || state.players[state.activePlayer] !== opponent) {
        return state;
      }

      // Natu wasn't attacking
      const pokemonCard = opponent.active.getPokemonCard();
      if (pokemonCard !== this) {
        return state;
      }
      if (effect.prizeCount > 0) {
        effect.prizeCount += 1;
        return state;
      }
    }

    if (effect instanceof AttackEffect && effect.attack === this.attacks[0]) {
      const player = effect.player;
      const opponent = StateUtils.getOpponent(state, player);
      const opponentActivePokemon = opponent.active;

      let energyCount = 0;

      opponentActivePokemon.cards.forEach(c => {
        if (c instanceof EnergyCard) {
          energyCount++;
        }
      });

      effect.damage = energyCount * 10;

    }

    return state;
  }
}