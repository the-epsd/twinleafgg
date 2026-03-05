import { ADD_PARALYZED_TO_PLAYER_ACTIVE, COIN_FLIP_PROMPT, IS_POKEMON_POWER_BLOCKED, WAS_ATTACK_USED } from '../../game/store/prefabs/prefabs';
import { CardType, Stage } from '../../game/store/card/card-types';
import { PokemonCard } from '../../game/store/card/pokemon-card';
import { Effect } from '../../game/store/effects/effect';
import { PowerType, State, StateUtils, StoreLike } from '../../game';
import { PlayPokemonEffect } from '../../game/store/effects/play-card-effects';
import { PutDamageEffect } from '../../game/store/effects/attack-effects';

export class Articuno extends PokemonCard {
  public stage: Stage = Stage.BASIC;
  public cardType: CardType = W;
  public hp: number = 100;
  public weakness = [];
  public resistance = [{ type: F, value: -30 }];
  public retreat = [C, C];

  public powers = [{
    name: 'Quickfreeze',
    powerType: PowerType.POKEMON_POWER,
    text: 'When you put Articuno into play during your turn (not during set-up), flip a coin. If heads, the Defending Pokémon is now Paralyzed.'
  }];

  public attacks = [{
    name: 'Ice Breath',
    cost: [W, W, W],
    damage: 0,
    text: 'Does 40 damage to 1 of your opponent\'s Pokémon chosen at random. Don\'t apply Weakness and Resistance for this attack. (Any other effects that would happen after applying Weakness and Resistance still happen.)'
  }];

  public set: string = 'GB1';
  public cardImage: string = 'assets/cardback.png';
  public setNumber: string = 'P03';
  public name: string = 'Articuno';
  public fullName: string = 'Articuno GB1';

  public reduceEffect(store: StoreLike, state: State, effect: Effect): State {

    if (effect instanceof PlayPokemonEffect && effect.pokemonCard === this && !IS_POKEMON_POWER_BLOCKED(store, state, effect.player, this)) {
      const player = effect.player;
      const opponent = StateUtils.getOpponent(state, player);
      COIN_FLIP_PROMPT(store, state, effect.player, result => {
        if (result) {
          ADD_PARALYZED_TO_PLAYER_ACTIVE(store, state, opponent, this);
        }
      });
    }

    if (WAS_ATTACK_USED(effect, 0, this)) {
      const player = effect.player;
      const opponent = StateUtils.getOpponent(state, player);

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