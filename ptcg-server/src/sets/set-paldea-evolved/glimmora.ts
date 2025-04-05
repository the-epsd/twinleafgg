import { PokemonCard } from '../../game/store/card/pokemon-card';
import { Stage, CardType } from '../../game/store/card/card-types';
import { StoreLike, State, StateUtils, PowerType, GameLog } from '../../game';
import { Effect } from '../../game/store/effects/effect';
import { KnockOutEffect } from '../../game/store/effects/game-effects';
import { CoinFlipEffect } from '../../game/store/effects/play-card-effects';
import { ADD_POISON_TO_PLAYER_ACTIVE, IS_ABILITY_BLOCKED, SIMULATE_COIN_FLIP, WAS_ATTACK_USED } from '../../game/store/prefabs/prefabs';

export class Glimmora extends PokemonCard {
  public stage: Stage = Stage.STAGE_1;
  public evolvesFrom = 'Glimmet';
  public cardType: CardType = F;
  public hp: number = 130;
  public weakness = [{ type: G }];
  public retreat = [C, C, C];

  public powers = [{
    name: 'Shattering Crystal',
    powerType: PowerType.ABILITY,
    text: 'When this Pokémon is Knocked Out, flip a coin. If heads, your opponent can\'t take any Prize cards for it.',
  }];

  public attacks = [
    {
      name: 'Poison Petals',
      cost: [F],
      damage: 0,
      text: 'Your opponent\'s Active Pokémon is now Poisoned. During Pokémon Checkup, put 6 damage counters on that Pokémon instead of 1.'
    },
  ];

  public set: string = 'PAL';
  public setNumber = '126';
  public cardImage = 'assets/cardback.png';
  public regulationMark: string = 'G';
  public name: string = 'Glimmora';
  public fullName: string = 'Glimmora PAL';

  public reduceEffect(store: StoreLike, state: State, effect: Effect): State {
    // Shattering Crystal
    if (effect instanceof KnockOutEffect) {
      const player = effect.player;
      const opponent = StateUtils.getOpponent(state, player);

      if (IS_ABILITY_BLOCKED(store, state, player, this)){ return state; }

      // checking if this is the target for the damage
      if (effect.target.getPokemonCard() !== this){ return state; }

      // Flip a coin, and if heads, prevent damage.
      try {
        const coinFlip = new CoinFlipEffect(player);
        store.reduceEffect(state, coinFlip);
      } catch {
        return state;
      }

      const coinFlipResult = SIMULATE_COIN_FLIP(store, state, player);

      if (coinFlipResult) {
        effect.prizeCount = 0;
        store.log(state, GameLog.LOG_ABILITY_BLOCKS_DAMAGE, { name: opponent.name, pokemon: this.name });
      }
    }

    // Energy Feather
    if (WAS_ATTACK_USED(effect, 0, this)){
      const opponent = effect.opponent;

      ADD_POISON_TO_PLAYER_ACTIVE(store, state, opponent, this, 60);
    }
    return state;
  }
}