import { PokemonCard } from '../../game/store/card/pokemon-card';
import { Stage, CardType, SuperType } from '../../game/store/card/card-types';
import { StoreLike } from '../../game/store/store-like';
import { State } from '../../game/store/state/state';
import { Effect } from '../../game/store/effects/effect';
import { CardList, PlayerType, PowerType, StateUtils } from '../../game';
import { CheckPokemonTypeEffect } from '../../game/store/effects/check-effects';
import { IS_POKEBODY_BLOCKED, WAS_ATTACK_USED } from '../../game/store/prefabs/prefabs';
import { FLIP_A_COIN_IF_HEADS_DEAL_MORE_DAMAGE, THIS_ATTACK_DOES_X_DAMAGE_TO_1_OF_YOUR_OPPONENTS_POKEMON } from '../../game/store/prefabs/attack-effects';

export class Kecleon extends PokemonCard {
  public stage: Stage = Stage.BASIC;
  public cardType: CardType = C;
  public hp: number = 60;
  public weakness = [{ type: F }];
  public retreat = [C];

  public powers = [{
    name: 'Reactive Colors',
    powerType: PowerType.POKEBODY,
    text: 'If Kecleon has any React Energy cards attached to it, Kecleon is [G], [R], [W], [L], [P], and [F] type.'
  }];

  public attacks = [{
    name: 'Tongue Whip',
    cost: [C],
    damage: 0,
    text: 'Choose 1 of your opponent\'s Pokémon. This attack does 10 damage to that Pokémon. (Don\'t apply Weakness and Resistance for Benched Pokémon.)'
  },
  {
    name: 'Quick Attack',
    cost: [C, C],
    damage: 10,
    damageCalculation: '+',
    text: 'Flip a coin. If heads, this attack does 10 damage plus 20 more damage.'
  }];

  public set: string = 'LM';
  public name: string = 'Kecleon';
  public fullName: string = 'Kecleon LM';
  public setNumber: string = '37';
  public cardImage: string = 'assets/cardback.png';

  public reduceEffect(store: StoreLike, state: State, effect: Effect): State {

    if (effect instanceof CheckPokemonTypeEffect && effect.target.getPokemonCard() === this && !IS_POKEBODY_BLOCKED(store, state, StateUtils.findOwner(state, effect.target), this)){
      const player = StateUtils.findOwner(state, effect.target);

      player.forEachPokemon(PlayerType.BOTTOM_PLAYER, (cardList, card) => {
        if (card === this){
          const energies = new CardList();
          energies.cards = cardList.cards.filter(card => card.superType === SuperType.ENERGY && card.name === 'React Energy');

          if (energies.cards.length === 0){
            effect.cardTypes = [C];
            return state;
          } else {
            effect.cardTypes = [G, R, W, L, P, F];
            return state;
          }
        }
      });
    }

    if (WAS_ATTACK_USED(effect, 0, this)) {
      THIS_ATTACK_DOES_X_DAMAGE_TO_1_OF_YOUR_OPPONENTS_POKEMON(10, effect, store, state);
    }

    if (WAS_ATTACK_USED(effect, 1, this)) {
      FLIP_A_COIN_IF_HEADS_DEAL_MORE_DAMAGE(store, state, effect, 20);
    }
    
    return state;
  }
}
