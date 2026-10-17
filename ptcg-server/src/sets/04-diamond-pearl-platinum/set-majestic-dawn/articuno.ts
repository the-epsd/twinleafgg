import { PokemonCard } from '../../../game/store/card/pokemon-card';
import { CardType, Stage } from '../../../game/store/card/card-types';
import { PowerType, State, StateUtils, StoreLike } from '../../../game';
import { Effect } from '../../../game/store/effects/effect';
import { PlayPokemonEffect } from '../../../game/store/effects/play-card-effects';
import { PutDamageEffect } from '../../../game/store/effects/attack-effects';
import { ADD_PARALYZED_TO_PLAYER_ACTIVE, COIN_FLIP_PROMPT, CONFIRMATION_PROMPT, IS_POKEPOWER_BLOCKED, WAS_ATTACK_USED } from '../../../game/store/prefabs/prefabs';

export class Articuno extends PokemonCard {
  public stage: Stage = Stage.BASIC;
  public hp: number = 100;
  public cardType: CardType[] = [W];
  public weakness = [{ type: M, value: +30 }];
  public resistance = [{ type: F, value: -20 }];
  public retreat = [C, C];

  public powers = [{
    name: 'Freezing Screech',
    powerType: PowerType.POKEPOWER,
    text: 'Once during your turn, when you put Articuno from your hand onto your Bench, you may flip a coin. If heads, choose 1 of the Defending Pokémon. That Pokémon is now Paralyzed.',
  }];

  public attacks = [{
    name: 'Blizzard',
    cost: [W, W, C],
    damage: 60,
    text: 'Flip a coin. If heads, this attack does 10 damage to each of your opponent\'s Benched Pokémon. If tails, this attack does 10 damage to each of your Benched Pokémon. (Don\'t apply Weakness and Resistance for Benched Pokémon.)'
  }];

  public set: string = 'MD';
  public cardImage: string = 'assets/cardback.png';
  public setNumber: string = '1';
  public name: string = 'Articuno';
  public fullName: string = 'Articuno MD';

  public reduceEffect(store: StoreLike, state: State, effect: Effect): State {
    // Freezing Screech
    if (effect instanceof PlayPokemonEffect && effect.pokemonCard === this) {
      const player = effect.player;
      const opponent = StateUtils.getOpponent(state, player);

      if (IS_POKEPOWER_BLOCKED(store, state, player, this)) {
        return state;
      }

      state = CONFIRMATION_PROMPT(store, state, player, wantToUse => {
        if (!wantToUse) {
          return state;
        }

        COIN_FLIP_PROMPT(store, state, player, result => {
          if (result) {
            ADD_PARALYZED_TO_PLAYER_ACTIVE(store, state, opponent, this);
          }
        });
      });
    }

    // Blizzard
    if (WAS_ATTACK_USED(effect, 0, this)) {
      const player = effect.player;
      const opponent = effect.opponent;
      return COIN_FLIP_PROMPT(store, state, player, result => {
        if (result) {
          opponent.bench.forEach(bench => {
            if (bench.cards.length > 0) {
              const damageEffect = new PutDamageEffect(effect, 10);
              damageEffect.target = bench;
              store.reduceEffect(state, damageEffect);
            }
          });
        } else {
          player.bench.forEach(bench => {
            if (bench.cards.length > 0) {
              const damageEffect = new PutDamageEffect(effect, 10);
              damageEffect.target = bench;
              store.reduceEffect(state, damageEffect);
            }
          });
        }
      });
    }

    return state;
  }
}
