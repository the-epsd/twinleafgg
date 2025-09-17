import { PokemonCard } from '../../game/store/card/pokemon-card';
import { Stage, CardType, CardTag } from '../../game/store/card/card-types';
import { StoreLike } from '../../game/store/store-like';
import { State } from '../../game/store/state/state';
import { Effect } from '../../game/store/effects/effect';
import { CardList, PlayerType, PowerType, StateUtils } from '../../game';
import { CheckPokemonTypeEffect } from '../../game/store/effects/check-effects';
import { HEAL_X_DAMAGE_FROM_THIS_POKEMON, IS_POKEBODY_BLOCKED, WAS_ATTACK_USED } from '../../game/store/prefabs/prefabs';

export class Armaldoex extends PokemonCard {
  public stage: Stage = Stage.STAGE_2;
  public evolvesFrom: string = 'Anorith';
  public tags = [CardTag.POKEMON_ex];
  public cardType: CardType = F;
  public hp: number = 160;
  public weakness = [{ type: G }];
  public retreat = [C, C, C];

  public powers = [{
    name: 'Dual Armor',
    powerType: PowerType.POKEBODY,
    text: 'As long as Armaldo ex has any React Energy cards attached to it, Armaldo ex is both [G] and [F] type.'
  }];

  public attacks = [{
    name: 'Spiral Drain',
    cost: [F, C],
    damage: 40,
    text: 'Remove 2 damage counters from Armaldo ex.'
  },
  {
    name: 'Vortex Chop',
    cost: [F, C, C],
    damage: 70,
    text: 'If the Defending Pokémon has any Resistance, this attack\'s base damage is 100 instead of 70.'
  }];

  public set: string = 'LM';
  public name: string = 'Armaldo ex';
  public fullName: string = 'Armaldo ex LM';
  public setNumber: string = '84';
  public cardImage: string = 'assets/cardback.png';

  public reduceEffect(store: StoreLike, state: State, effect: Effect): State {

    if (effect instanceof CheckPokemonTypeEffect && effect.target.getPokemonCard() === this && !IS_POKEBODY_BLOCKED(store, state, StateUtils.findOwner(state, effect.target), this)) {
      const player = StateUtils.findOwner(state, effect.target);

      player.forEachPokemon(PlayerType.BOTTOM_PLAYER, (cardList, card) => {
        if (card === this) {
          const energies = new CardList();
          energies.cards = cardList.cards.filter(card => card.name === 'React Energy');

          if (energies.cards.length > 0) {
            effect.cardTypes = [G, F];
          }

          return state;
        }
      });
    }

    if (WAS_ATTACK_USED(effect, 0, this)) {
      HEAL_X_DAMAGE_FROM_THIS_POKEMON(effect, store, state, 20);
    }

    if (WAS_ATTACK_USED(effect, 1, this)) {
      const target = effect.opponent.active.getPokemonCard();
      if (target?.resistance !== undefined && target.resistance.length > 0) {
        effect.damage = 100;
      }
    }

    return state;
  }
}
