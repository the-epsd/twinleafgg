import { IS_POKEMON_POWER_BLOCKED, WAS_ATTACK_USED } from '../../game/store/prefabs/prefabs';
import { CardType, Stage } from '../../game/store/card/card-types';
import { PokemonCard } from '../../game/store/card/pokemon-card';
import { Effect } from '../../game/store/effects/effect';
import { PowerType, State, StateUtils, StoreLike } from '../../game';
import { PlayPokemonEffect } from '../../game/store/effects/play-card-effects';
import { PutDamageEffect } from '../../game/store/effects/attack-effects';

export class Zapdos extends PokemonCard {
  public stage: Stage = Stage.BASIC;
  public cardType: CardType = L;
  public hp: number = 100;
  public weakness = [];
  public resistance = [{ type: F, value: -30 }];
  public retreat = [C, C];

  public powers = [{
    name: 'Peal of Thunder',
    powerType: PowerType.POKEMON_POWER,
    text: 'When you put Zapdos into play during your turn (not during set-up), do 30 damage to a Pokémon other than Zapdos chosen at random. (Don\'t apply Weakness and Resistance.)'
  }];

  public attacks = [{
    name: 'Big Thunder',
    cost: [L, L, L],
    damage: 0,
    text: 'Choose a Pokémon other than Zapdos at random. This attack does 70 damage to that Pokémon. Don\'t apply Weakness or Resistance for this attack. (Any other effects that would happen after applying Weakness and Resistance still happen.)'
  }];

  public set: string = 'GB1';
  public cardImage: string = 'assets/cardback.png';
  public setNumber: string = 'P10';
  public name: string = 'Zapdos';
  public fullName: string = 'Zapdos GB1';

  public reduceEffect(store: StoreLike, state: State, effect: Effect): State {

    if (effect instanceof PlayPokemonEffect && effect.pokemonCard === this && !IS_POKEMON_POWER_BLOCKED(store, state, effect.player, this)) {
      const player = effect.player;
      const opponent = StateUtils.getOpponent(state, player);

      const targets = [...player.getPokemonInPlay(), ...opponent.getPokemonInPlay()]
        .filter(target => target.getPokemonCard() !== this);
      if (targets.length === 0) {
        return state;
      }
      const randomIndex = Math.floor(Math.random() * targets.length);
      const target = targets[randomIndex];

      target.damage += 30;
    }

    if (WAS_ATTACK_USED(effect, 0, this)) {
      const player = effect.player;
      const opponent = StateUtils.getOpponent(state, player);

      effect.ignoreWeakness = true;
      effect.ignoreResistance = true;

      const targets = [...player.getPokemonInPlay(), ...opponent.getPokemonInPlay()]
        .filter(target => target.getPokemonCard() !== this);
      if (targets.length === 0) {
        return state;
      }
      const randomIndex = Math.floor(Math.random() * targets.length);
      const target = targets[randomIndex];

      const damageEffect = new PutDamageEffect(effect, 70);
      damageEffect.target = target;
      store.reduceEffect(state, damageEffect);
      return state;
    }

    return state;
  }
}