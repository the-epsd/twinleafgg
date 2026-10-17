import { PokemonCard } from '../../game/store/card/pokemon-card';
import { CardType, SpecialCondition, Stage } from '../../game/store/card/card-types';
import { PowerType, State, StateUtils, StoreLike } from '../../game';
import { Effect } from '../../game/store/effects/effect';
import { PutDamageEffect } from '../../game/store/effects/attack-effects';
import { PlayPokemonEffect } from '../../game/store/effects/play-card-effects';
import { APPLY_SPECIAL_CONDITIONS_FROM_ABILITY } from '../../game/store/prefabs/effect-of-ability-prefabs';
import { COIN_FLIP_PROMPT, IS_POKEMON_POWER_BLOCKED, WAS_ATTACK_USED } from '../../game/store/prefabs/prefabs';

export class Articuno extends PokemonCard {
  public stage: Stage = Stage.BASIC;
  public hp: number = 100;
  public cardType: CardType[] = [W];
  public weakness = [];
  public resistance = [{ type: F, value: -30 }];
  public retreat = [C, C];

  public powers = [{
    name: 'Quickfreeze',
    powerType: PowerType.POKEMON_POWER,
    text: 'When you put Articuno into play during your turn (not during set-up), flip a coin. If heads, the Defending Pokémon is now Paralyzed.',
  }];

  public attacks = [{
    name: 'Ice Breath',
    cost: [W, W, W],
    damage: 0,
    text: 'Does 40 damage to 1 of your opponent\'s Pokémon chosen at random. Don\'t apply Weakness and Resistance for this attack. (Any other effects that would happen after applying Weakness and Resistance still happen.)',
  }];

  public set: string = 'GB1';
  public cardImage: string = 'assets/cardback.png';
  public setNumber: string = 'P03';
  public name: string = 'Articuno';
  public fullName: string = 'Articuno GB1';

  public reduceEffect(store: StoreLike, state: State, effect: Effect): State {
    // Quickfreeze
    if (effect instanceof PlayPokemonEffect && effect.pokemonCard === this && !IS_POKEMON_POWER_BLOCKED(store, state, effect.player, this)) {
      const player = effect.player;
      const opponent = StateUtils.getOpponent(state, player);
      COIN_FLIP_PROMPT(store, state, effect.player, result => {
        if (result) {
          APPLY_SPECIAL_CONDITIONS_FROM_ABILITY(
            store,
            state,
            player,
            this.powers[0],
            this,
            opponent.active,
            [SpecialCondition.PARALYZED],
          );
        }
      });
    }

    // Ice Breath
    if (WAS_ATTACK_USED(effect, 0, this)) {
      const opponent = StateUtils.getOpponent(state, effect.player);

      effect.ignoreWeakness = true;
      effect.ignoreResistance = true;

      const targets = opponent.getPokemonInPlay();
      const randomIndex = Math.floor(Math.random() * targets.length);
      const target = targets[randomIndex];

      const damageEffect = new PutDamageEffect(effect, 40);
      damageEffect.target = target;
      store.reduceEffect(state, damageEffect);
      return state;
    }

    return state;
  }
}
