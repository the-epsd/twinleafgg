import { CardTag, CardType, PokemonCard, Stage, State, StateUtils, StoreLike } from '../../game';
import { Effect } from '../../game/store/effects/effect';
import { DealDamageEffect, PutDamageEffect } from '../../game/store/effects/attack-effects';
import { CoinFlipEffect } from '../../game/store/effects/play-card-effects';
import { WAS_ATTACK_USED } from '../../game/store/prefabs/prefabs';

export class MegaZygardeex extends PokemonCard {
  public stage: Stage = Stage.BASIC;
  public tags = [CardTag.POKEMON_SV_MEGA, CardTag.POKEMON_ex];
  public cardType: CardType = F;
  public hp: number = 310;
  public weakness = [{ type: G }];
  public retreat = [C, C];

  public attacks = [{
    name: 'Gaia Wave',
    cost: [F, F, F],
    damage: 200,
    text: 'During your opponent\'s next turn, this Pokémon takes 30 less damage from attacks.',
  },
  {
    name: 'Munikis Zero',
    cost: [F, F, F, F, F],
    damage: 0,
    text: 'For each of your opponent\'s Pokémon, flip a coin. If heads, this attack does 150 damage to that Pokemon.',
  }];

  public regulationMark: string = 'J';
  public set: string = 'M3';
  public setNumber: string = '46';
  public cardImage: string = 'assets/cardback.png';
  public name: string = 'Mega Zygarde ex';
  public fullName: string = 'Mega Zygarde ex M3';

  public reduceEffect(store: StoreLike, state: State, effect: Effect): State {
    // Gaia Wave
    if (WAS_ATTACK_USED(effect, 0, this)) {
      const player = effect.player;
      player.active.damageReductionNextTurn = 30;
    }

    // Munikis Zero
    if (WAS_ATTACK_USED(effect, 1, this)) {
      const player = effect.player;
      const opponent = StateUtils.getOpponent(state, player);

      // Collect all opponent Pokemon (active + bench)
      const allOpponentPokemon = [opponent.active, ...opponent.bench.filter(b => b.cards.length > 0)];

      // Flip coins sequentially for each Pokemon
      let currentIndex = 0;
      const flipCoinForPokemon = (s: State): State => {
        if (currentIndex >= allOpponentPokemon.length) {
          return s;
        }

        const target = allOpponentPokemon[currentIndex];
        const coinFlipEffect = new CoinFlipEffect(player, (result: boolean) => {
          if (result) {
            // Heads - apply 150 damage to this Pokemon
            let damageEffect;

            // Use DealDamageEffect for active Pokemon (applies Weakness/Resistance)
            // Use PutDamageEffect for benched Pokemon (doesn't apply Weakness/Resistance)
            if (target === opponent.active) {
              damageEffect = new DealDamageEffect(effect, 150);
            } else {
              damageEffect = new PutDamageEffect(effect, 150);
            }

            damageEffect.target = target;
            store.reduceEffect(s, damageEffect);
          }

          // Move to next Pokemon
          currentIndex++;
          flipCoinForPokemon(s);
        });
        return store.reduceEffect(s, coinFlipEffect);
      };
      return flipCoinForPokemon(state);
    }
    return state;
  }
}