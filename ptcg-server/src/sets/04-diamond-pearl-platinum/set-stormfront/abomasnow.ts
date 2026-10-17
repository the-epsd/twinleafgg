import { PokemonCard } from '../../../game/store/card/pokemon-card';
import { CardType, Stage } from '../../../game/store/card/card-types';
import { PlayerType, PokemonCardList, PowerType, State, StateUtils, StoreLike } from '../../../game';
import { Effect } from '../../../game/store/effects/effect';
import { DealDamageEffect, PutDamageEffect, PutCountersEffect } from '../../../game/store/effects/attack-effects';
import { CheckPokemonTypeEffect } from '../../../game/store/effects/check-effects';
import { ADD_PARALYZED_TO_PLAYER_ACTIVE, IS_POKEBODY_BLOCKED, WAS_ATTACK_USED } from '../../../game/store/prefabs/prefabs';

export class Abomasnow extends PokemonCard {
  public stage: Stage = Stage.STAGE_1;
  public evolvesFrom: string = 'Snover';
  public hp: number = 100;
  public cardType: CardType[] = [W];
  public weakness = [{ type: R, value: +30 }];
  public retreat = [C, C, C];

  public powers = [{
    name: 'Snow Veil',
    powerType: PowerType.POKEBODY,
    text: 'As long as Abomasnow is your Active Pokémon, any damage done to your Pokémon by an opponent\'s attack is reduced by 20 (after applying Weakness and Resistance).'
  }];

  public attacks = [{
    name: 'Snow Play',
    cost: [C, C],
    damage: 20,
    text: 'Does 20 damage to each of your opponent\'s Benched Pokémon, excluding Grass Pokémon and Water Pokémon. (Don\'t apply Weakness and Resistance for Benched Pokémon.)'
  },
  {
    name: 'Below Zero',
    cost: [W, C, C],
    damage: 60,
    text: 'If Abomasnow evolved from Snover during this turn, the Defending Pokémon is now Paralyzed.'
  }];

  public set: string = 'SF';
  public cardImage: string = 'assets/cardback.png';
  public setNumber: string = '12';
  public name: string = 'Abomasnow';
  public fullName: string = 'Abomasnow SF';

  public reduceEffect(store: StoreLike, state: State, effect: Effect): State {
    // Snow Veil
    if (effect instanceof PutDamageEffect || effect instanceof DealDamageEffect) {
      const targetOwner = StateUtils.findOwner(state, effect.target);
      const sourceOwner = StateUtils.findOwner(state, effect.source);
      if (targetOwner === sourceOwner) {
        return state;
      }
      if (targetOwner.active.getPokemonCard() !== this) {
        return state;
      }
      if (IS_POKEBODY_BLOCKED(store, state, targetOwner, this)) {
        return state;
      }
      effect.damage = Math.max(0, effect.damage - 20);
    }

    // Snow Play
    if (WAS_ATTACK_USED(effect, 0, this)) {
      const player = effect.player;
      const opponent = StateUtils.getOpponent(state, player);
      opponent.forEachPokemon(PlayerType.TOP_PLAYER, (cardList) => {
        if (cardList === opponent.active) {
          return;
        }
        const typeCheck = new CheckPokemonTypeEffect(cardList);
        store.reduceEffect(state, typeCheck);
        if (typeCheck.cardTypes.includes(CardType.GRASS) || typeCheck.cardTypes.includes(CardType.WATER)) {
          return;
        }
        const countersEffect = new PutCountersEffect(effect, 20);
        countersEffect.target = cardList;
        store.reduceEffect(state, countersEffect);
      });
    }

    // Below Zero
    if (WAS_ATTACK_USED(effect, 1, this)) {
      const cardList = StateUtils.findCardList(state, this) as PokemonCardList;
      const evolvedFromSnoverThisTurn = cardList.pokemonPlayedTurn === state.turn
        && cardList.getPokemons().some(p => p.name === 'Snover');
      if (evolvedFromSnoverThisTurn) {
        ADD_PARALYZED_TO_PLAYER_ACTIVE(store, state, effect.opponent, this);
      }
    }

    return state;
  }
}
