import { PokemonCard } from '../../game/store/card/pokemon-card';
import { Stage, CardType, CardTag } from '../../game/store/card/card-types';
import { StoreLike, State, PowerType } from '../../game';
import { Effect } from '../../game/store/effects/effect';
import { MEGA_EVOLUTION_END_TURN, WAS_ATTACK_USED } from '../../game/store/prefabs/prefabs';
import { PlayPokemonEffect } from '../../game/store/effects/play-card-effects';

export class MRayquazaEX2 extends PokemonCard {
  public tags = [CardTag.POKEMON_EX, CardTag.MEGA];
  public stage: Stage = Stage.MEGA;
  public evolvesFrom = 'Rayquaza-EX';
  public cardType: CardType = C;
  public hp: number = 220;
  public weakness = [{ type: L }];
  public resistance = [{ type: F, value: -20 }];
  public retreat = [C];

  public powers = [{
    name: 'Δ Evolution',
    powerType: PowerType.ANCIENT_TRAIT,
    text: 'You may play this card from your hand to evolve a Pokémon during your first turn or the turn you play that Pokémon.',
  }];

  public attacks = [{
    name: 'Emerald Break',
    cost: [C, C, C],
    damage: 30,
    damageCalculation: 'x',
    text: 'This attack does 30 damage times the number of your Benched Pokémon.',
  }];

  public set: string = 'ROS';
  public name: string = 'M Rayquaza-EX';
  public fullName: string = 'M Rayquaza-EX2 ROS';
  public cardImage: string = 'assets/cardback.png';
  public setNumber: string = '76';

  public reduceEffect(store: StoreLike, state: State, effect: Effect): State {
    // love me some funny evolution crap, especially when they CHEAT
    if (effect instanceof PlayPokemonEffect && effect.pokemonCard === this) {
      // maybe this will allow the ancient trait to go through
      effect.player.canEvolve = true;
      effect.target.pokemonPlayedTurn = state.turn - 1;
    }

    MEGA_EVOLUTION_END_TURN(store, state, effect, this);

    // Emerald Break
    if (WAS_ATTACK_USED(effect, 0, this)) {
      const player = effect.player;

      const playerBench = player.bench.reduce((left, b) => left + (b.cards.length ? 1 : 0), 0);
      effect.damage = playerBench * 30;
    }

    return state;
  }
}
