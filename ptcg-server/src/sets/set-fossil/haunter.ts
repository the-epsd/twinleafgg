import { PokemonCard } from '../../game/store/card/pokemon-card';
import { Stage, CardType, SpecialCondition } from '../../game/store/card/card-types';
import { StoreLike } from '../../game/store/store-like';
import { GamePhase, State } from '../../game/store/state/state';
import { PowerEffect, AttackEffect } from '../../game/store/effects/game-effects';
import { Effect } from '../../game/store/effects/effect';
import { GameLog, Player, PowerType, StateUtils } from '../../game';
import { AddSpecialConditionsEffect, PutDamageEffect } from '../../game/store/effects/attack-effects';
import { CoinFlipEffect } from '../../game/store/effects/play-card-effects';

export class Haunter extends PokemonCard {

  public stage: Stage = Stage.STAGE_1;

  public evolvesFrom = 'Gastly';

  public cardType: CardType = P;

  public hp: number = 50;

  public weakness = [];

  public resistance = [{ type: F, value: -30 }];

  public retreat = [];

  public powers = [{
    name: 'Transparency',
    powerType: PowerType.POKEPOWER,
    text: 'Whenever an attack does anything to Haunter, flip a coin. If heads, prevent all effects of that attack, including damage, done to Haunter. This power stops working while Haunter is Asleep, Confused, or Paralyzed.'
  }];

  public attacks = [{
    name: 'Nightmare',
    cost: [P, C],
    damage: 10,
    text: 'The Defending Pokémon is now Asleep.'
  }];

  public set: string = 'FO';

  public cardImage: string = 'assets/cardback.png';

  public setNumber: string = '6';

  public name: string = 'Haunter';

  public fullName: string = 'Haunter FO';

  public reduceEffect(store: StoreLike, state: State, effect: Effect): State {
    function simulateCoinFlip(store: StoreLike, state: State, player: Player): boolean {
      const result = Math.random() < 0.5;
      const gameMessage = result ? GameLog.LOG_PLAYER_FLIPS_HEADS : GameLog.LOG_PLAYER_FLIPS_TAILS;
      store.log(state, gameMessage, { name: player.name });
      return result;
    }

    if (effect instanceof PutDamageEffect && effect.target.cards.includes(this)) {
      const player = effect.player;
      const opponent = StateUtils.getOpponent(state, player);
      const pokemonCard = effect.target.getPokemonCard();
      const sourceCard = effect.source.getPokemonCard();

      if (pokemonCard !== this || sourceCard === undefined || state.phase !== GamePhase.ATTACK) {
        return state;
      }

      if (effect.target.specialConditions.includes(SpecialCondition.PARALYZED)
        || effect.target.specialConditions.includes(SpecialCondition.ASLEEP)
        || effect.target.specialConditions.includes(SpecialCondition.CONFUSED)) {
        return state;
      }

      try {
        const stub = new PowerEffect(player, {
          name: 'test',
          powerType: PowerType.ABILITY,
          text: ''
        }, this);
        store.reduceEffect(state, stub);
      } catch {
        return state;
      }

      try {
        const coinFlip = new CoinFlipEffect(player);
        store.reduceEffect(state, coinFlip);
      } catch {
        return state;
      }

      const coinFlipResult = simulateCoinFlip(store, state, player);

      if (coinFlipResult) {
        effect.damage = 0;
        store.log(state, GameLog.LOG_ABILITY_BLOCKS_DAMAGE, { name: opponent.name, pokemon: this.name });
      }

      return state;
    }

    if (effect instanceof AttackEffect && effect.attack === this.attacks[0]) {
      const sleepEffect = new AddSpecialConditionsEffect(effect, [SpecialCondition.ASLEEP]);
      store.reduceEffect(state, sleepEffect);
      return state;
    }

    return state;
  }
}